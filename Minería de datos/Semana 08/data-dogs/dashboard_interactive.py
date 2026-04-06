#!/usr/bin/env python3
import sys
sys.path.insert(0, ".")

from datetime import datetime, timedelta, time

import pandas as pd
import plotly.express as px
import streamlit as st

from scripts.database import SessionLocal
from scripts.models import RazaPerro


st.set_page_config(
    page_title="Dashboard Interactivo DATA-DOGS",
    page_icon="🎛️",
    layout="wide"
)

st.markdown("""
    <style>
    .main-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
    }
    .subtitle {
        color: #9aa4b2;
        margin-bottom: 1rem;
    }
    </style>
""", unsafe_allow_html=True)

st.markdown(
    '<div class="main-title">🎛️ Dashboard Interactivo - DATA-DOGS</div>',
    unsafe_allow_html=True
)
st.markdown(
    '<div class="subtitle">CORHUILA - Ingeniería de Sistemas | Minería de Datos</div>',
    unsafe_allow_html=True
)
st.markdown("Exploración interactiva de razas de perros almacenadas en PostgreSQL.")
st.markdown("---")


@st.cache_data(ttl=60)
def cargar_datos():
    db = SessionLocal()
    try:
        rows = db.query(RazaPerro).order_by(RazaPerro.raza.asc()).all()
        data = []
        for r in rows:
            data.append({
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


def texto_hipo(valor):
    if valor is True:
        return "Sí"
    if valor is False:
        return "No"
    return "Sin dato"


df = cargar_datos()

if df.empty:
    st.warning("⚠️ No hay datos en la tabla `razas_perros`. Ejecuta primero el ETL.")
    st.stop()

df["Hipoalergénico texto"] = df["Hipoalergénico"].apply(texto_hipo)


st.sidebar.markdown("### 🔧 Controles interactivos")

categorias_orden = ["Muy pequeño", "Pequeño", "Mediano", "Grande", "Gigante"]
categorias_disponibles = [
    c for c in categorias_orden
    if c in df["Categoría peso"].dropna().unique()
]

categorias_sel = st.sidebar.multiselect(
    "🐕 Tamaño de raza",
    options=categorias_disponibles,
    default=categorias_disponibles
)

hipo_sel = st.sidebar.multiselect(
    "🌿 Hipoalergénico",
    options=["Sí", "No", "Sin dato"],
    default=["Sí", "No", "Sin dato"]
)

busqueda_raza = st.sidebar.text_input(
    "🔎 Buscar raza",
    placeholder="Ej: terrier, shepherd, bulldog..."
)
st.sidebar.caption("Busca por nombre completo o parcial de la raza.")

peso_min = float(df["Peso promedio"].min())
peso_max = float(df["Peso promedio"].max())
rango_peso = st.sidebar.slider(
    "⚖️ Rango de peso promedio (kg)",
    min_value=float(peso_min),
    max_value=float(peso_max),
    value=(float(peso_min), float(peso_max))
)

vida_min = float(df["Vida promedio"].min())
vida_max = float(df["Vida promedio"].max())
rango_vida = st.sidebar.slider(
    "🧬 Rango de vida promedio (años)",
    min_value=float(vida_min),
    max_value=float(vida_max),
    value=(float(vida_min), float(vida_max))
)

fecha_min = df["Fecha extracción"].min()
fecha_max = df["Fecha extracción"].max()

default_inicio = (
    fecha_min.date()
    if pd.notnull(fecha_min)
    else (datetime.now() - timedelta(days=30)).date()
)
default_fin = (
    fecha_max.date()
    if pd.notnull(fecha_max)
    else datetime.now().date()
)

st.sidebar.markdown("### 📅 Fecha de extracción")
fecha_inicio = st.sidebar.date_input("Desde", value=default_inicio, key="filtro_desde")
fecha_fin = st.sidebar.date_input("Hasta", value=default_fin, key="filtro_hasta")

inicio_dt = datetime.combine(fecha_inicio, time.min)
fin_dt = datetime.combine(fecha_fin, time.max)


df_filtrado = df.copy()

if categorias_sel:
    df_filtrado = df_filtrado[df_filtrado["Categoría peso"].isin(categorias_sel)]
else:
    df_filtrado = df_filtrado.iloc[0:0]

df_filtrado = df_filtrado[
    (df_filtrado["Hipoalergénico texto"].isin(hipo_sel)) &
    (df_filtrado["Peso promedio"] >= rango_peso[0]) &
    (df_filtrado["Peso promedio"] <= rango_peso[1]) &
    (df_filtrado["Vida promedio"] >= rango_vida[0]) &
    (df_filtrado["Vida promedio"] <= rango_vida[1]) &
    (df_filtrado["Fecha extracción"] >= inicio_dt) &
    (df_filtrado["Fecha extracción"] <= fin_dt)
]

if busqueda_raza.strip():
    termino = busqueda_raza.strip()
    palabras = [p for p in termino.split() if p]

    for palabra in palabras:
        df_filtrado = df_filtrado[
            df_filtrado["Raza"].str.contains(palabra, case=False, na=False)
        ]

    st.sidebar.caption(f"Búsqueda activa: {termino}")


if df_filtrado.empty:
    st.warning("⚠️ No hay datos que coincidan con los filtros seleccionados.")
    st.stop()


st.markdown("### 📊 Indicadores clave")

col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric("🐾 Razas filtradas", len(df_filtrado))

with col2:
    st.metric("⚖️ Peso máximo", f"{df_filtrado['Peso promedio'].max():.2f} kg")

with col3:
    st.metric("⚖️ Peso promedio", f"{df_filtrado['Peso promedio'].mean():.2f} kg")

with col4:
    st.metric("🧬 Vida promedio", f"{df_filtrado['Vida promedio'].mean():.2f} años")

with col5:
    pct_hipo = (df_filtrado["Hipoalergénico"] == True).mean() * 100
    if pd.isna(pct_hipo):
        pct_hipo = 0
    st.metric("🌿 % hipoalergénicas", f"{pct_hipo:.1f}%")

st.markdown("---")


col1, col2 = st.columns(2)

with col1:
    st.markdown("#### Distribución de peso por tamaño")
    fig = px.box(
        df_filtrado,
        x="Categoría peso",
        y="Peso promedio",
        color="Categoría peso",
        title="Distribución del peso promedio por categoría"
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("#### Promedio de vida por tamaño")
    vida_categoria = (
        df_filtrado.groupby("Categoría peso")["Vida promedio"]
        .mean()
        .reset_index()
    )
    fig = px.bar(
        vida_categoria,
        x="Categoría peso",
        y="Vida promedio",
        color="Categoría peso",
        title="Vida promedio por categoría de peso"
    )
    st.plotly_chart(fig, use_container_width=True)

st.markdown("---")

col1, col2 = st.columns(2)

with col1:
    st.markdown("#### Relación entre peso y vida")
    fig = px.scatter(
        df_filtrado,
        x="Peso promedio",
        y="Vida promedio",
        color="Categoría peso",
        hover_data=["Raza", "Hipoalergénico texto"],
        title="Peso promedio vs vida promedio"
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.markdown("#### Cantidad de razas por tamaño")
    resumen_tamano = (
        df_filtrado.groupby("Categoría peso")
        .size()
        .reset_index(name="Cantidad")
    )
    fig = px.pie(
        resumen_tamano,
        names="Categoría peso",
        values="Cantidad",
        title="Distribución de razas por tamaño",
        hole=0.4
    )
    st.plotly_chart(fig, use_container_width=True)

st.markdown("---")

st.markdown("#### 📈 Cargas por fecha de extracción")
df_tiempo = (
    df_filtrado.assign(Fecha=df_filtrado["Fecha extracción"].dt.date)
    .groupby("Fecha")
    .size()
    .reset_index(name="Cantidad")
)

fig = px.line(
    df_tiempo,
    x="Fecha",
    y="Cantidad",
    markers=True,
    title="Cantidad de razas filtradas por fecha de extracción"
)
st.plotly_chart(fig, use_container_width=True)

st.markdown("---")


st.markdown("#### 📋 Tabla interactiva")

col1, col2 = st.columns(2)

with col1:
    mostrar_todos = st.checkbox("Mostrar todos los registros", value=False)

with col2:
    columnas_mostrar = st.multiselect(
        "Columnas a mostrar",
        options=df_filtrado.columns.tolist(),
        default=[
            "Raza",
            "Categoría peso",
            "Peso promedio",
            "Vida promedio",
            "Hipoalergénico texto",
            "Fecha extracción",
        ]
    )

st.caption(f"Registros filtrados: {len(df_filtrado)}")

if not columnas_mostrar:
    st.warning("Selecciona al menos una columna para mostrar.")
else:
    tabla = df_filtrado[columnas_mostrar].copy()

    columnas_orden = [c for c in ["Categoría peso", "Raza"] if c in tabla.columns]
    if columnas_orden:
        tabla = tabla.sort_values(by=columnas_orden)

    if mostrar_todos:
        st.dataframe(tabla, use_container_width=True, height=600)
    else:
        st.dataframe(tabla.head(20), use_container_width=True, height=450)

st.markdown("---")


csv = df_filtrado.to_csv(index=False).encode("utf-8")
st.download_button(
    label="⬇️ Descargar datos filtrados como CSV",
    data=csv,
    file_name=f"data_dogs_filtrado_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
    mime="text/csv"
)