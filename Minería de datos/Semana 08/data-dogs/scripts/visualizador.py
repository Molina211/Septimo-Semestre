#!/usr/bin/env python3
import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import logging
from scipy.stats import skew, kurtosis

# -----------------------------
# CONFIGURACIÓN GENERAL
# -----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

DATA_PATH = "data/dogs_normalized.csv"

# -----------------------------
# CARGA DE DATOS LIMPIOS
# -----------------------------
def cargar_datos():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            "❌ No existe dogs_normalized.csv. Ejecuta primero el extractor."
        )

    df = pd.read_csv(DATA_PATH)

    # Eliminar duplicados
    df = df.drop_duplicates(subset="raza")

    logging.info(f"📄 Razas analizadas: {len(df)}")
    return df

# ==========================================================
# IMAGEN 1 — ANÁLISIS ESTADÍSTICO GENERAL
# ==========================================================
def generar_imagen_principal(df):
    fig, axs = plt.subplots(2, 2, figsize=(16, 12))

    # 1️⃣ Histograma peso promedio
    axs[0, 0].hist(df["peso_promedio"], bins=20)
    axs[0, 0].set_title("Distribución del peso promedio (kg)")
    axs[0, 0].set_xlabel("Kg")
    axs[0, 0].set_ylabel("Frecuencia")

    # 2️⃣ Boxplot peso (outliers)
    axs[0, 1].boxplot(df["peso_promedio"], vert=False)
    axs[0, 1].set_title("Outliers del peso promedio")

    # 3️⃣ Peso promedio vs vida promedio
    axs[1, 0].scatter(df["peso_promedio"], df["vida_promedio"])
    axs[1, 0].set_title("Peso promedio vs esperanza de vida")
    axs[1, 0].set_xlabel("Peso (kg)")
    axs[1, 0].set_ylabel("Años")

    # 4️⃣ Conteo por categoría de peso
    conteo = df["categoria_peso"].value_counts()
    axs[1, 1].bar(conteo.index, conteo.values)
    axs[1, 1].set_title("Cantidad de razas por categoría de peso")
    axs[1, 1].tick_params(axis="x", rotation=45)

    plt.tight_layout()
    plt.savefig("data/dogs_statistical_analysis.png", dpi=300)
    plt.close()

    logging.info("✅ Imagen dogs_statistical_analysis.png creada correctamente")

# ==========================================================
# IMAGEN 2 — ANÁLISIS ESTADÍSTICO AVANZADO
# ==========================================================
def generar_imagen_extra(df):
    fig, axs = plt.subplots(2, 2, figsize=(16, 12))

    # 5️⃣ Donut — Proporción de razas por categoría de peso
    conteo = df["categoria_peso"].value_counts()

    axs[0, 0].pie(
        conteo.values,
        labels=conteo.index,
        autopct="%1.1f%%",
        startangle=90,
        wedgeprops={"width": 0.4}
    )
    axs[0, 0].set_title("Proporción de razas por categoría de peso")

    # 6️⃣ Violin Plot — Vida promedio por categoría de peso
    categorias = df["categoria_peso"].unique()
    datos_por_categoria = [
        df[df["categoria_peso"] == cat]["vida_promedio"]
        for cat in categorias
    ]

    axs[0, 1].violinplot(datos_por_categoria, showmeans=True)

    axs[0, 1].set_title("Distribución de vida promedio por categoría de peso")
    axs[0, 1].set_xticks(range(1, len(categorias) + 1))
    axs[0, 1].set_xticklabels(categorias, rotation=45)
    axs[0, 1].set_ylabel("Años")

    # 7️⃣ Top 10 razas más longevas
    top_life = df.sort_values(
        "vida_promedio", ascending=False
    ).head(10)

    axs[1, 0].barh(top_life["raza"], top_life["vida_promedio"])
    axs[1, 0].set_title("Top 10 razas más longevas")
    axs[1, 0].invert_yaxis()

    # 8️⃣ Diferencia sexual de peso
    axs[1, 1].hist(df["diferencia_sexual_peso"], bins=20)
    axs[1, 1].set_title("Distribución diferencia de peso (M - H)")
    axs[1, 1].set_xlabel("Kg")

    plt.tight_layout()
    plt.savefig("data/dogs_statistical_analysis_extra.png", dpi=300)
    plt.close()

    logging.info("✅ Imagen dogs_statistical_analysis_extra.png creada correctamente")

# -----------------------------
# MAIN
# -----------------------------
def main():
    df = cargar_datos()
    generar_imagen_principal(df)
    generar_imagen_extra(df)

if __name__ == "__main__":
    main()