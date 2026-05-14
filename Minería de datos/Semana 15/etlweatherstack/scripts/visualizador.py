import logging
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

df = pd.read_csv('data/clima.csv')

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.suptitle('Análisis Descriptivo del Clima', fontsize=16)

# 1. Histograma de temperaturas
axes[0, 0].hist(df['temperatura'], bins=5)
axes[0, 0].set_title('Distribución de Temperatura')
axes[0, 0].set_xlabel('Temperatura')
axes[0, 0].set_ylabel('Frecuencia')

# 2. Boxplot de humedad
axes[0, 1].boxplot(df['humedad'])
axes[0, 1].set_title('Distribución de Humedad')

# 3. Scatter Temperatura vs Humedad
axes[1, 0].scatter(df['temperatura'], df['humedad'])
axes[1, 0].set_title('Temperatura vs Humedad')
axes[1, 0].set_xlabel('Temperatura')
axes[1, 0].set_ylabel('Humedad')

# 4. Línea de viento por ciudad
axes[1, 1].plot(df['ciudad'], df['velocidad_viento'], marker='o')
axes[1, 1].set_title('Velocidad del Viento por Ciudad')
axes[1, 1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig('data/analisis_1.png', dpi=300)
logger.info("✅ Imagen 1 guardada")
plt.show()

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.suptitle('Análisis Comparativo del Clima', fontsize=16)

# 1. Temperatura vs Sensación térmica (líneas)
axes[0, 0].plot(df['ciudad'], df['temperatura'], marker='o', label='Temperatura')
axes[0, 0].plot(df['ciudad'], df['sensacion_termica'], marker='x', label='Sensación')
axes[0, 0].set_title('Comparación Temperatura vs Sensación')
axes[0, 0].legend()
axes[0, 0].tick_params(axis='x', rotation=45)

# 2. Gráfico de dispersión viento vs humedad
axes[0, 1].scatter(df['velocidad_viento'], df['humedad'])
axes[0, 1].set_title('Viento vs Humedad')
axes[0, 1].set_xlabel('Velocidad del viento')
axes[0, 1].set_ylabel('Humedad')

# 3. Ranking de temperaturas (ordenado)
df_sorted = df.sort_values(by='temperatura')
axes[1, 0].barh(df_sorted['ciudad'], df_sorted['temperatura'])
axes[1, 0].set_title('Ranking de Temperaturas')

# 4. Heatmap manual (correlación)
corr = df[['temperatura','humedad','velocidad_viento','sensacion_termica']].corr()
im = axes[1, 1].imshow(corr)

axes[1, 1].set_xticks(range(len(corr.columns)))
axes[1, 1].set_yticks(range(len(corr.columns)))
axes[1, 1].set_xticklabels(corr.columns, rotation=45)
axes[1, 1].set_yticklabels(corr.columns)
axes[1, 1].set_title('Matriz de Correlación')

plt.tight_layout()
plt.savefig('data/analisis_2.png', dpi=300)
logger.info("✅ Imagen 2 guardada")
plt.show()