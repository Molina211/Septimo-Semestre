#!/usr/bin/env python3
import sys
sys.path.insert(0, ".")

from datetime import datetime, timedelta, time
import pandas as pd
import plotly.express as px
import streamlit as st
from sqlalchemy import func

from scripts.database import SessionLocal
from scripts.models import RazaPerro, MetricasETL

# =========================
# CONFIGURACIÓN DE PÁGINA
# =========================
st.set_page_config(
    page_title="Dashboard Avanzado DATA-DOGS",
    page_icon="🐶",
    layout="wide"
)

st.title("🐶 Dashboard Avanzado - DATA-DOGS")
st.markdown("**CORHUILA - Ingeniería de Sistemas | Minería de Datos**")
st.markdown("Análisis avanzado de razas de perros almacenadas en PostgreSQL")
st.markdown("---")


# =========================
# FUNCIONES DE CARGA
# =========================
@st.cache_data(ttl=60)
def cargar_razas():
    db = SessionLocal()
    try:
        rows = db.query(RazaPerro).order_by(RazaPerro.raza.asc()).all()
        data = []
        for r in rows:
            data.append({
                "id": r.id,
                "raza": r.raza,
                "vida_min": r.vida_min,
                "vida_max": r.vida_max,
                "vida_promedio": r.vida_promedio,
                "peso_macho_max": r.peso_macho_max,
                "peso_hembra_max": r.peso_hembra_max,
                "peso_promedio": r.peso_promedio,
                "categoria_peso": r.categoria_peso,
                "diferencia_sexual_peso": r.diferencia_sexual_peso,
                "hipoalergenico": r.hipoalergenico,
                "fecha_extraccion": r.fecha_extraccion,
                "fecha_creacion": r.fecha_creacion,
            })
        return pd.DataFrame(data)
    finally:
        db.close()


@st.cache_data(ttl=60)
def cargar_metricas():
    db = SessionLocal()
    try:
        rows = (
            db.query(MetricasETL)
            .order_by(MetricasETL.fecha_ejecucion.desc())
            .limit(50)
            .all()
        )

        data = []
        for m in rows:
            data.append({
                "fecha_ejecucion": m.fecha_ejecucion,
                "estado": m.estado,
                "registros_extraidos": m.registros_extraidos,
                "registros_guardados": m.registros_guardados,
                "registros_fallidos": m.registros_fallidos,
                "tiempo_ejecucion_segundos": m.tiempo_ejecucion_segundos,
                "mensaje": m.mensaje
            })
        return pd.DataFrame(data)
    finally:
        db.close()


def texto_hipo(valor):
    if valor is True:
        return "Sí"
    if valor is False:
        return "No"
    return "Sin dato"


# =========================
# CARGA PRINCIPAL
# =========================
df = cargar_razas()
df_metricas = cargar_metricas()

if df.empty:
    st.warning("⚠️ No hay datos en la tabla `razas_perros`. Ejecuta primero tu ETL.")
    st.stop()

df["hipo_texto"] = df["hipoalergenico"].apply(texto_hipo)

# =========================
# TABS PRINCIPALES
# =========================
tab1, tab2, tab3, tab4 = st.tabs([
    "📊 Vista General",
    "📅 Fecha de extracción",
    "🔍 Análisis",
    "📋 Métricas ETL"
])

# =====================================================
# TAB 1 - VISTA GENERAL
# =====================================================
with tab1:
    st.subheader("Vista general del dataset")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("🐾 Total de razas", len(df))

    with col2:
        st.metric("⚖️ Peso promedio global", f"{df['peso_promedio'].mean():.2f} kg")

    with col3:
        st.metric("🧬 Vida promedio global", f"{df['vida_promedio'].mean():.2f} años")

    with col4:
        ultima_fecha = df["fecha_extraccion"].max()
        ultima_fecha_txt = ultima_fecha.strftime("%Y-%m-%d %H:%M") if pd.notnull(ultima_fecha) else "N/A"
        st.metric("⏰ Última extracción", ultima_fecha_txt)

    st.markdown("---")

    col1, col2 = st.columns(2)

    with col1:
        top_pesadas = df.sort_values("peso_promedio", ascending=False).head(10)
        fig = px.bar(
            top_pesadas,
            x="raza",
            y="peso_promedio",
            color="categoria_peso",
            title="Top 10 razas más pesadas",
            text_auto=".2f"
        )
        fig.update_layout(xaxis_title="Raza", yaxis_title="Peso promedio (kg)", xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        top_longevas = df.sort_values("vida_promedio", ascending=False).head(10)
        fig = px.bar(
            top_longevas,
            x="raza",
            y="vida_promedio",
            color="vida_promedio",
            title="Top 10 razas más longevas",
            text_auto=".2f"
        )
        fig.update_layout(xaxis_title="Raza", yaxis_title="Vida promedio (años)", xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

    col1, col2 = st.columns(2)

    with col1:
        cat_df = df["categoria_peso"].value_counts(dropna=False).reset_index()
        cat_df.columns = ["categoria_peso", "cantidad"]

        fig = px.pie(
            cat_df,
            names="categoria_peso",
            values="cantidad",
            title="Distribución por categoría de peso",
            hole=0.4
        )
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        hipo_df = df["hipo_texto"].value_counts(dropna=False).reset_index()
        hipo_df.columns = ["hipo_texto", "cantidad"]

        fig = px.bar(
            hipo_df,
            x="hipo_texto",
            y="cantidad",
            color="hipo_texto",
            title="Conteo de razas hipoalergénicas"
        )
        fig.update_layout(xaxis_title="Hipoalergénico", yaxis_title="Cantidad")
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("---")
    st.dataframe(
        df[[
            "raza", "vida_promedio", "peso_promedio", "categoria_peso",
            "diferencia_sexual_peso", "hipo_texto", "fecha_extraccion"
        ]].sort_values("raza"),
        use_container_width=True
    )

# =====================================================
# TAB 2 - Fecha de extracción
# =====================================================
with tab2:
    st.subheader("Análisis de registros por fecha de extracción")
    st.caption(
    "Aquí se muestran las razas según la fecha en que fueron cargadas o actualizadas por última vez en PostgreSQL."
)
    col1, col2 = st.columns(2)

    fecha_min = df["fecha_extraccion"].min()
    fecha_max = df["fecha_extraccion"].max()

    valor_inicio = fecha_min.date() if pd.notnull(fecha_min) else datetime.now().date() - timedelta(days=7)
    valor_fin = fecha_max.date() if pd.notnull(fecha_max) else datetime.now().date()

    with col1:
        fecha_inicio = st.date_input("Desde:", value=valor_inicio, key="hist_inicio")

    with col2:
        fecha_fin = st.date_input("Hasta:", value=valor_fin, key="hist_fin")

    inicio_dt = datetime.combine(fecha_inicio, time.min)
    fin_dt = datetime.combine(fecha_fin, time.max)

    df_hist = df[
        (df["fecha_extraccion"] >= inicio_dt) &
        (df["fecha_extraccion"] <= fin_dt)
    ].copy()

    if not df_hist.empty:
        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric("Razas en rango", len(df_hist))

        with col2:
            st.metric("Peso promedio", f"{df_hist['peso_promedio'].mean():.2f} kg")

        with col3:
            st.metric("Vida promedio", f"{df_hist['vida_promedio'].mean():.2f} años")

        st.markdown("---")

        col1, col2 = st.columns(2)

        with col1:
            por_fecha = (
                df_hist.assign(fecha=df_hist["fecha_extraccion"].dt.date)
                .groupby("fecha")
                .size()
                .reset_index(name="cantidad")
            )

            fig = px.bar(
                por_fecha,
                x="fecha",
                y="cantidad",
                title="Cantidad de razas por fecha de extracción"
            )
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            por_categoria = (
                df_hist.groupby("categoria_peso")
                .size()
                .reset_index(name="cantidad")
                .sort_values("cantidad", ascending=False)
            )

            fig = px.pie(
                por_categoria,
                names="categoria_peso",
                values="cantidad",
                title="Distribución por tamaño"
            )
            st.plotly_chart(fig, use_container_width=True)

        st.markdown("---")

        resumen = (
            df_hist.groupby("categoria_peso")
            .agg(
                total_razas=("raza", "count"),
                peso_promedio=("peso_promedio", "mean"),
                vida_promedio=("vida_promedio", "mean")
            )
            .reset_index()
            .sort_values("peso_promedio")
        )

        st.markdown("### Resumen por tamaño")
        st.dataframe(resumen, use_container_width=True)

        st.markdown("---")
        st.markdown("### Razas del rango seleccionado")
        st.dataframe(
            df_hist[[
                "raza",
                "categoria_peso",
                "peso_promedio",
                "vida_promedio",
                "hipo_texto",
                "fecha_extraccion"
            ]].sort_values(["categoria_peso", "raza"]),
            use_container_width=True
        )
    else:
        st.warning("No hay datos en ese rango de fechas.")

# =====================================================
# TAB 3 - ANÁLISIS
# =====================================================
with tab3:
    st.subheader("Análisis estadístico por tamaño")

    categorias = ["Muy pequeño", "Pequeño", "Mediano", "Grande", "Gigante"]
    disponibles = [c for c in categorias if c in df["categoria_peso"].dropna().unique()]

    categoria_sel = st.selectbox(
        "Selecciona una categoría de peso",
        options=["Todas"] + disponibles
    )

    if categoria_sel == "Todas":
        df_analisis = df.copy()
    else:
        df_analisis = df[df["categoria_peso"] == categoria_sel].copy()

    if df_analisis.empty:
        st.warning("No hay datos para la categoría seleccionada.")
    else:
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric("Razas", len(df_analisis))

        with col2:
            st.metric("Peso promedio", f"{df_analisis['peso_promedio'].mean():.2f} kg")

        with col3:
            st.metric("Vida promedio", f"{df_analisis['vida_promedio'].mean():.2f} años")

        with col4:
            pct_hipo = (df_analisis["hipoalergenico"] == True).mean() * 100
            if pd.isna(pct_hipo):
                pct_hipo = 0
            st.metric("% hipoalergénicas", f"{pct_hipo:.1f}%")

        st.markdown("---")

        col1, col2 = st.columns(2)

        with col1:
            fig = px.scatter(
                df_analisis,
                x="peso_promedio",
                y="vida_promedio",
                color="categoria_peso",
                hover_data=["raza", "hipo_texto"],
                title="Peso promedio vs Vida promedio"
            )
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            resumen_cat = (
                df.groupby("categoria_peso")
                .agg(
                    total_razas=("raza", "count"),
                    peso_promedio=("peso_promedio", "mean"),
                    vida_promedio=("vida_promedio", "mean")
                )
                .reset_index()
            )

            fig = px.bar(
                resumen_cat,
                x="categoria_peso",
                y="total_razas",
                color="categoria_peso",
                title="Cantidad de razas por tamaño"
            )
            st.plotly_chart(fig, use_container_width=True)

        st.markdown("---")

        st.markdown("### Tabla de razas agrupadas por tamaño")
        st.dataframe(
            df_analisis[[
                "raza",
                "categoria_peso",
                "peso_promedio",
                "vida_promedio",
                "diferencia_sexual_peso",
                "hipo_texto"
            ]].sort_values(["categoria_peso", "peso_promedio"], ascending=[True, False]),
            use_container_width=True,
            height=500
        )

# =====================================================
# TAB 4 - MÉTRICAS ETL
# =====================================================
with tab4:
    st.subheader("Métricas de ejecución ETL")

    if df_metricas.empty:
        st.info(
            "No hay métricas registradas aún. "
            "Tu modelo `MetricasETL` existe, pero tu ETL debe guardar datos en esa tabla para ver esta sección llena."
        )
    else:
        col1, col2, col3 = st.columns(3)

        ultimo = df_metricas.iloc[0]

        with col1:
            st.metric("Último estado", str(ultimo["estado"]))

        with col2:
            st.metric("Últimos guardados", int(ultimo["registros_guardados"]))

        with col3:
            st.metric("Últimos fallidos", int(ultimo["registros_fallidos"]))

        st.markdown("---")

        st.dataframe(
            df_metricas.sort_values("fecha_ejecucion", ascending=False),
            use_container_width=True
        )

        col1, col2 = st.columns(2)

        with col1:
            fig = px.bar(
                df_metricas,
                x="fecha_ejecucion",
                y="registros_guardados",
                color="estado",
                title="Registros guardados por ejecución"
            )
            fig.update_layout(xaxis_title="Fecha de ejecución", yaxis_title="Guardados")
            st.plotly_chart(fig, use_container_width=True)

        with col2:
            fig = px.scatter(
                df_metricas,
                x="fecha_ejecucion",
                y="tiempo_ejecucion_segundos",
                size="registros_guardados",
                color="estado",
                title="Duración de ejecuciones ETL"
            )
            fig.update_layout(xaxis_title="Fecha de ejecución", yaxis_title="Tiempo (s)")
            st.plotly_chart(fig, use_container_width=True)