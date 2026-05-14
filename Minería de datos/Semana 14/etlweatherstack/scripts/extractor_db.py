#!/usr/bin/env python3
import os
import sys
from pathlib import Path
import requests
import json
import pandas as pd
from datetime import datetime
import time
from dotenv import load_dotenv
import logging
from sqlalchemy.exc import IntegrityError

# Permite ejecutar este archivo directamente: `python scripts/extractor_db.py`
repo_root = Path(__file__).resolve().parent.parent
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

from scripts.database import SessionLocal
from scripts.models import Ciudad, RegistroClima, MetricasETL

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/etl.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class WeatherstackETL:
    def __init__(self):
        self.api_key = os.getenv('API_KEY')
        self.base_url = os.getenv('WEATHERSTACK_BASE_URL')
        # Acepta CIUDADES separadas por coma o punto y coma.
        ciudades_raw = os.getenv('CIUDADES', '').replace(';', ',')
        self.ciudades = [c.strip() for c in ciudades_raw.split(',') if c.strip()]
        self.delay = int(os.getenv('DELAY', 1))
        # 0 => reintentos infinitos (hasta que responda bien)
        self.max_attempts = int(os.getenv('MAX_ATTEMPTS', 0))
        self.db = SessionLocal()
        self.tiempo_inicio = time.time()
        self.registros_extraidos = 0
        self.registros_guardados = 0
        self.registros_fallidos = 0

        if not self.api_key:
            raise ValueError("API_KEY no configurada en .env")

    def extraer_clima(self, ciudad_nombre):
        """Extrae datos de clima para una ciudad específica"""
        url = f"{self.base_url}/current"
        params = {
            'access_key': self.api_key,
            'query': ciudad_nombre.strip()
        }

        attempt = 0
        while True:
            attempt += 1

            # Retardo antes de cada request (incluida la primera)
            logger.info(f"⏳ Esperando {self.delay} segundos antes de la petición ({ciudad_nombre})...")
            time.sleep(self.delay)

            try:
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                if 'error' in data:
                    raise RuntimeError(data['error'].get('info', 'Error desconocido en API'))

                self.registros_extraidos += 1
                logger.info(f"✅ Datos extraídos para {ciudad_nombre} (intento {attempt})")
                return data

            except Exception as exc:
                logger.error(f"❌ Error extrayendo datos para {ciudad_nombre} (intento {attempt}): {exc}")
                if self.max_attempts and attempt >= self.max_attempts:
                    logger.warning(f"🛑 Alcanzado límite de {self.max_attempts} intentos para {ciudad_nombre}")
                    self.registros_fallidos += 1
                    return None

    def procesar_respuesta(self, response_data):
        """Transforma respuesta JSON a diccionario"""
        try:
            current = response_data.get('current', {})
            location = response_data.get('location', {})

            return {
                'ciudad': location.get('name'),
                'pais': location.get('country'),
                'latitud': location.get('lat'),
                'longitud': location.get('lon'),
                'temperatura': current.get('temperature'),
                'sensacion_termica': current.get('feelslike'),
                'humedad': current.get('humidity'),
                'velocidad_viento': current.get('wind_speed'),
                'descripcion': current.get('weather_descriptions', ['N/A'])[0],
                'codigo_tiempo': current.get('weather_code')
            }
        except Exception as e:
            logger.error(f"Error procesando respuesta: {str(e)}")
            return None

    def guardar_en_bd(self, datos_procesados):
        """Guarda los datos en PostgreSQL"""
        try:
            # Busca o crea la ciudad
            ciudad = self.db.query(Ciudad).filter_by(
                nombre=datos_procesados['ciudad']
            ).first()

            if not ciudad:
                ciudad = Ciudad(
                    nombre=datos_procesados['ciudad'],
                    pais=datos_procesados['pais'],
                    latitud=datos_procesados['latitud'],
                    longitud=datos_procesados['longitud']
                )
                self.db.add(ciudad)
                self.db.flush()  # Flush para obtener el ID

            # Crea nuevo registro de clima
            registro = RegistroClima(
                ciudad_id=ciudad.id,
                temperatura=datos_procesados['temperatura'],
                sensacion_termica=datos_procesados['sensacion_termica'],
                humedad=datos_procesados['humedad'],
                velocidad_viento=datos_procesados['velocidad_viento'],
                descripcion=datos_procesados['descripcion'],
                codigo_tiempo=datos_procesados['codigo_tiempo']
            )

            self.db.add(registro)
            self.db.commit()
            self.registros_guardados += 1

            logger.info(f"📊 Registro guardado para {datos_procesados['ciudad']}")
            return True

        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"Error de integridad: {str(e)}")
            self.registros_fallidos += 1
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error guardando en BD: {str(e)}")
            self.registros_fallidos += 1
            return False

    def guardar_metricas(self, estado):
        """Guarda métricas de la ejecución"""
        try:
            tiempo_ejecucion = time.time() - self.tiempo_inicio
            metricas = MetricasETL(
                registros_extraidos=self.registros_extraidos,
                registros_guardados=self.registros_guardados,
                registros_fallidos=self.registros_fallidos,
                tiempo_ejecucion_segundos=tiempo_ejecucion,
                estado=estado,
                mensaje=f"Extraídos: {self.registros_extraidos}, Guardados: {self.registros_guardados}, Fallidos: {self.registros_fallidos}"
            )
            self.db.add(metricas)
            self.db.commit()
            logger.info(f"📈 Métricas guardadas: {metricas.mensaje}")
        except Exception as e:
            logger.error(f"Error guardando métricas: {str(e)}")

    def ejecutar(self):
        """Ejecuta el pipeline completo"""
        try:
            logger.info(f"Iniciando ETL para {len(self.ciudades)} ciudades...")

            for ciudad in self.ciudades:
                response = self.extraer_clima(ciudad)
                if response:
                    datos = self.procesar_respuesta(response)
                    if datos:
                        self.guardar_en_bd(datos)

            # Determina estado
            estado = "SUCCESS" if self.registros_fallidos == 0 else "PARTIAL"
            self.guardar_metricas(estado)

            return estado == "SUCCESS"

        except Exception as e:
            logger.error(f"Error en ETL: {str(e)}")
            self.guardar_metricas("FAILED")
            return False

        finally:
            self.db.close()

    def mostrar_resumen(self):
        """Muestra resumen de datos en BD"""
        try:
            ciudades = self.db.query(Ciudad).count()
            registros = self.db.query(RegistroClima).count()

            print("\n" + "="*50)
            print("RESUMEN ETL - DADOS EN POSTGRESQL")
            print("="*50)
            print(f"Total Ciudades: {ciudades}")
            print(f"Total Registros de Clima: {registros}")
            print(f"Registros Extraídos: {self.registros_extraidos}")
            print(f"Registros Guardados: {self.registros_guardados}")
            print(f"Registros Fallidos: {self.registros_fallidos}")
            print("="*50 + "\n")

        except Exception as e:
            logger.error(f"Error mostrando resumen: {str(e)}")

if __name__ == "__main__":
    etl = WeatherstackETL()
    exito = etl.ejecutar()
    etl.mostrar_resumen()
    
    exit(0 if exito else 1)
