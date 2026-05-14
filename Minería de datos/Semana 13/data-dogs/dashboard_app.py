#!/usr/bin/env python3
import sys
sys.path.insert(0, ".")

import streamlit as st
import pandas as pd
import plotly.express as px
from sqlalchemy import func

from scripts.database import SessionLocal
from scripts.models import RazaPerro, MetricasETL

# =========================
# CONFIGURACIÓN DE PÁGINA
# =========================
st.set_page_config(
    page_title="DATA-DOGS Dashboard",
    page_icon="🐶",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🐶 DATA-DOGS - Dashboard de Razas de Perros")
st.markdown("Visualización interactiva de los datos extraídos desde Dog API y almacenados en PostgreSQL.")
st.markdown("---")


# =========================
# CARGA DE DATOS
# =========================
@st.cache_data(ttl=60)
def cargar_datos_razas():
    db = SessionLocal()
    try:
        rows = db.query(RazaPerro).order_by(RazaPerro.raza.asc()).all()

        data = []
        for r in rows:
            data.append({
                "ID": r.id,
                "Raza": r.raza,
                "Vida mínima": r.vida_min,
                "Vida máxima": r.vida_max,
                "Vida promedio": r.vida_promedio,
                "Peso macho max": r.peso_macho_max,
                "Peso hembra max": r.peso_hembra_max,
                "Peso promedio": r.peso_promedio,
                "Categoría peso": r.categoria_peso,
                "Diferencia sexual peso": r.diferencia_sexual_peso,
                "Hipoalergénico": r.hipoalergenico,
                "Fecha extracción": r.fecha_extraccion,
                "Fecha creación": r.fecha_creacion,
            })

        return pd.DataFrame(data)

    finally:
        db.close()


@st.cache_data(ttl=60)
def cargar_metricas_etl():
    db = SessionLocal()
    try:
        rows = (
            db.query(MetricasETL)
            .order_by(MetricasETL.fecha_ejecucion.desc())
            .limit(20)
            .all()
        )

        data = []
        for m in rows:
            data.append({
                "Fecha ejecución": m.fecha_ejecucion,
                "Extraídos": m.registros_extraidos,
                "Guardados": m.registros_guardados,
                "Fallidos": m.registros_fallidos,
                "Tiempo (s)": m.tiempo_ejecucion_segundos,
                "Estado": m.estado,
                "Mensaje": m.mensaje,
            })

        return pd.DataFrame(data)

    finally:
        db.close()


df = cargar_datos_razas()
df_metricas = cargar_metricas_etl()

if df.empty:
    st.warning("⚠️ No hay datos en la tabla `razas_perros`. Ejecuta primero tu ETL.")
    st.stop()


# =========================
# SIDEBAR - FILTROS
# =========================
st.sidebar.header("🔎 Filtros")

categorias = sorted([c for c in df["Categoría peso"].dropna().unique()])
categorias_sel = st.sidebar.multiselect(
    "Categoría de peso",
    options=categorias,
    default=categorias
)

hipo_opciones = st.sidebar.multiselect(
    "Hipoalergénico",
    options=["Sí", "No", "Sin dato"],
    default=["Sí", "No", "Sin dato"]
)

peso_min = float(df["Peso promedio"].min())
peso_max = float(df["Peso promedio"].max())
rango_peso = st.sidebar.slider(
    "Rango de peso promedio (kg)",
    min_value=float(peso_min),
    max_value=float(peso_max),
    value=(float(peso_min), float(peso_max))
)

vida_min = float(df["Vida promedio"].min())
vida_max = float(df["Vida promedio"].max())
rango_vida = st.sidebar.slider(
    "Rango de vida promedio (años)",
    min_value=float(vida_min),
    max_value=float(vida_max),
    value=(float(vida_min), float(vida_max))
)

busqueda = st.sidebar.text_input("Buscar raza por nombre")


# =========================
# NORMALIZACIÓN FILTRO HIPO
# =========================
def normalizar_hipo(valor):
    if valor is True:
        return "Sí"
    if valor is False:
        return "No"
    return "Sin dato"


df["Hipoalergénico texto"] = df["Hipoalergénico"].apply(normalizar_hipo)

# =========================
# APLICAR FILTROS
# =========================
df_filtrado = df.copy()

if categorias_sel:
    df_filtrado = df_filtrado[df_filtrado["Categoría peso"].isin(categorias_sel)]

df_filtrado = df_filtrado[
    (df_filtrado["Peso promedio"] >= rango_peso[0]) &
    (df_filtrado["Peso promedio"] <= rango_peso[1]) &
    (df_filtrado["Vida promedio"] >= rango_vida[0]) &
    (df_filtrado["Vida promedio"] <= rango_vida[1]) &
    (df_filtrado["Hipoalergénico texto"].isin(hipo_opciones))
]

if busqueda.strip():
    df_filtrado = df_filtrado[
        df_filtrado["Raza"].str.contains(busqueda, case=False, na=False)
    ]

if df_filtrado.empty:
    st.warning("⚠️ No hay razas que coincidan con los filtros seleccionados.")
    st.stop()


# =========================
# KPIs
# =========================
st.subheader("📊 Indicadores principales")

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("🐾 Total razas", len(df_filtrado))

with col2:
    st.metric("⚖️ Peso promedio global", f"{df_filtrado['Peso promedio'].mean():.2f} kg")

with col3:
    st.metric("🧬 Vida promedio global", f"{df_filtrado['Vida promedio'].mean():.2f} años")

with col4:
    st.metric("🏋️ Raza más pesada", f"{df_filtrado['Peso promedio'].max():.2f} kg")

with col5:
    pct_hipo = (df_filtrado["Hipoalergénico"] == True).mean() * 100
    if pd.isna(pct_hipo):
        pct_hipo = 0
    st.metric("🌿 % hipoalergénicas", f"{pct_hipo:.1f}%")

st.markdown("---")


# =========================
# GRÁFICAS
# =========================
st.subheader("📈 Visualizaciones")

col1, col2 = st.columns(2)

with col1:
    top_pesadas = df_filtrado.sort_values("Peso promedio", ascending=False).head(10)
    fig_peso = px.bar(
        top_pesadas,
        x="Raza",
        y="Peso promedio",
        color="Categoría peso",
        title="Top 10 razas más pesadas",
        text_auto=".2f"
    )
    fig_peso.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig_peso, use_container_width=True)

with col2:
    top_longevas = df_filtrado.sort_values("Vida promedio", ascending=False).head(10)
    fig_vida = px.bar(
        top_longevas,
        x="Raza",
        y="Vida promedio",
        color="Vida promedio",
        title="Top 10 razas más longevas",
        text_auto=".2f"
    )
    fig_vida.update_layout(xaxis_tickangle=-45)
    st.plotly_chart(fig_vida, use_container_width=True)

col1, col2 = st.columns(2)

with col1:
    fig_scatter = px.scatter(
        df_filtrado,
        x="Peso promedio",
        y="Vida promedio",
        color="Categoría peso",
        size="Diferencia sexual peso",
        hover_data=["Raza", "Hipoalergénico texto"],
        title="Peso promedio vs Vida promedio"
    )
    st.plotly_chart(fig_scatter, use_container_width=True)

with col2:
    conteo_cat = (
        df_filtrado["Categoría peso"]
        .value_counts()
        .reset_index()
    )
    conteo_cat.columns = ["Categoría peso", "Cantidad"]

    fig_cat = px.pie(
        conteo_cat,
        names="Categoría peso",
        values="Cantidad",
        title="Distribución por categoría de peso",
        hole=0.4
    )
    st.plotly_chart(fig_cat, use_container_width=True)

col1, col2 = st.columns(2)

with col1:
    conteo_hipo = (
        df_filtrado["Hipoalergénico texto"]
        .value_counts()
        .reset_index()
    )
    conteo_hipo.columns = ["Hipoalergénico", "Cantidad"]

    fig_hipo = px.bar(
        conteo_hipo,
        x="Hipoalergénico",
        y="Cantidad",
        color="Hipoalergénico",
        title="Conteo de razas hipoalergénicas"
    )
    st.plotly_chart(fig_hipo, use_container_width=True)

with col2:
    fig_box = px.box(
        df_filtrado,
        x="Categoría peso",
        y="Vida promedio",
        color="Categoría peso",
        title="Vida promedio por categoría de peso"
    )
    st.plotly_chart(fig_box, use_container_width=True)

st.markdown("---")


# =========================
# TABLA DETALLADA
# =========================
st.subheader("📋 Datos detallados")

columnas_visibles = st.multiselect(
    "Selecciona columnas para visualizar",
    options=[
        "Raza",
        "Vida mínima",
        "Vida máxima",
        "Vida promedio",
        "Peso macho max",
        "Peso hembra max",
        "Peso promedio",
        "Categoría peso",
        "Diferencia sexual peso",
        "Hipoalergénico texto",
        "Fecha extracción",
    ],
    default=[
        "Raza",
        "Vida promedio",
        "Peso promedio",
        "Categoría peso",
        "Diferencia sexual peso",
        "Hipoalergénico texto",
        "Fecha extracción",
    ]
)

st.dataframe(
    df_filtrado[columnas_visibles].sort_values("Raza"),
    use_container_width=True,
    height=450
)


# =========================
# DESCARGA CSV
# =========================
csv = df_filtrado.to_csv(index=False).encode("utf-8")
st.download_button(
    label="⬇️ Descargar datos filtrados en CSV",
    data=csv,
    file_name="razas_perros_filtradas.csv",
    mime="text/csv"
)

st.markdown("---")


# =========================
# MÉTRICAS ETL
# =========================
st.subheader("⚙️ Métricas ETL")

if df_metricas.empty:
    st.info("No hay métricas ETL registradas todavía.")
else:
    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric("Último estado", str(df_metricas.iloc[0]["Estado"]))

    with col2:
        st.metric("Últimos guardados", int(df_metricas.iloc[0]["Guardados"]))

    with col3:
        st.metric("Últimos fallidos", int(df_metricas.iloc[0]["Fallidos"]))

    st.dataframe(df_metricas, use_container_width=True, height=250)

    col1, col2 = st.columns(2)

    with col1:
        fig_metricas = px.bar(
            df_metricas,
            x="Fecha ejecución",
            y="Guardados",
            color="Estado",
            title="Registros guardados por ejecución ETL"
        )
        st.plotly_chart(fig_metricas, use_container_width=True)

    with col2:
        fig_tiempo = px.line(
            df_metricas.sort_values("Fecha ejecución"),
            x="Fecha ejecución",
            y="Tiempo (s)",
            markers=True,
            title="Tiempo de ejecución ETL"
        )
        st.plotly_chart(fig_tiempo, use_container_width=True)