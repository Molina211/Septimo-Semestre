#!/usr/bin/env python3
"""
transformador.py - Fase Transform del pipeline ETL
Limpia, normaliza y enriquece los datos extraídos del clima.
"""

import pandas as pd
import json
import os
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/etl.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class WeatherstackTransformador:
    def __init__(self, input_csv='data/clima.csv'):
        self.input_csv = input_csv
        self.df = None

    def cargar_datos(self):
        """Carga los datos desde el CSV generado por el extractor"""
        if not os.path.exists(self.input_csv):
            raise FileNotFoundError(
                f"Archivo {self.input_csv} no encontrado. "
                "Ejecuta primero scripts/extractor.py"
            )
        self.df = pd.read_csv(self.input_csv)
        logger.info(f"📂 Datos cargados: {len(self.df)} registros desde {self.input_csv}")
        return self

    def limpiar_datos(self):
        """Elimina duplicados exactos y maneja valores nulos"""
        filas_antes = len(self.df)
        # Solo elimina filas completamente iguales (preserva series de tiempo)
        self.df.drop_duplicates(inplace=True)
        self.df.fillna({
            'region': 'N/A',
            'latitud': 0.0,
            'longitud': 0.0,
            'indice_uv': 0,
            'descripcion': 'Sin descripción'
        }, inplace=True)
        filas_despues = len(self.df)
        logger.info(
            f"🧹 Limpieza: {filas_antes - filas_despues} duplicados eliminados, "
            f"{filas_despues} registros restantes"
        )
        return self

    def normalizar_tipos(self):
        """Convierte columnas a los tipos correctos"""
        cols_numericas = [
            'temperatura', 'sensacion_termica', 'humedad',
            'velocidad_viento', 'presion', 'visibilidad', 'indice_uv'
        ]
        for col in cols_numericas:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce')

        if 'hora_local' in self.df.columns:
            self.df['hora_local'] = pd.to_datetime(
                self.df['hora_local'], errors='coerce'
            )

        logger.info("🔧 Tipos de datos normalizados")
        return self

    def enriquecer_datos(self):
        """Agrega columnas calculadas para análisis"""
        # Clasificación de temperatura
        def clasificar_temp(t):
            if t < 10:
                return 'Frío'
            elif t < 20:
                return 'Templado'
            elif t < 30:
                return 'Cálido'
            else:
                return 'Caluroso'

        self.df['categoria_temperatura'] = self.df['temperatura'].apply(clasificar_temp)

        # Diferencial de percepción térmica
        self.df['diferencial_termico'] = (
            self.df['temperatura'] - self.df['sensacion_termica']
        ).round(1)

        # Clasificación de viento
        def clasificar_viento(v):
            if v < 1:
                return 'Calma'
            elif v < 20:
                return 'Brisa ligera'
            elif v < 40:
                return 'Viento moderado'
            else:
                return 'Viento fuerte'

        self.df['categoria_viento'] = self.df['velocidad_viento'].apply(clasificar_viento)

        # Fecha de procesamiento
        self.df['fecha_procesamiento'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        logger.info("✨ Datos enriquecidos con columnas calculadas")
        return self

    def guardar_datos(self, output_csv='data/clima_transformado.csv'):
        """Guarda el DataFrame transformado"""
        os.makedirs('data', exist_ok=True)
        self.df.to_csv(output_csv, index=False)
        logger.info(f"💾 Datos transformados guardados en {output_csv}")

        # También exportar a Excel
        output_xlsx = output_csv.replace('.csv', '.xlsx')
        self.df.to_excel(output_xlsx, index=False, sheet_name='Clima')
        logger.info(f"💾 Datos exportados a Excel en {output_xlsx}")

        return self.df

    def mostrar_resumen(self):
        """Muestra estadísticas descriptivas del dataset"""
        print("\n" + "=" * 60)
        print("ESTADÍSTICAS DEL DATASET TRANSFORMADO")
        print("=" * 60)
        cols = ['temperatura', 'sensacion_termica', 'humedad', 'velocidad_viento']
        print(self.df[cols].describe().round(2).to_string())
        print("\nCategorías de temperatura:")
        print(self.df['categoria_temperatura'].value_counts().to_string())
        print("=" * 60)


if __name__ == "__main__":
    try:
        transformador = WeatherstackTransformador()
        df = (transformador
              .cargar_datos()
              .limpiar_datos()
              .normalizar_tipos()
              .enriquecer_datos()
              .guardar_datos())
        transformador.mostrar_resumen()

    except FileNotFoundError as e:
        logger.error(str(e))
    except Exception as e:
        logger.error(f"Error fatal en transformación: {str(e)}")
        raise