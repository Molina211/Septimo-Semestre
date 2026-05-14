#!/usr/bin/env python3
import os
import requests
import json
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import logging
import time

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/etl.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class WeatherstackExtractor:
    def __init__(self):
        self.api_key = os.getenv('API_KEY')
        self.base_url = os.getenv('WEATHERSTACK_BASE_URL')
        self.ciudades = os.getenv('CIUDADES').split(';')  # 🔥 CAMBIO AQUÍ
        self.delay = int(os.getenv('DELAY', 1))
        self.max_attempts = int(os.getenv('MAX_ATTEMPTS', 0))

        if not self.api_key:
            raise ValueError("API_KEY no configurada en .env")
    
    def extraer_clima(self, ciudad):
        """Extrae datos de clima para una ciudad específica"""
        url = f"{self.base_url}/current"
        params = {
            'access_key': self.api_key,
            'query': ciudad.strip()
        }

        attempt = 0
        while True:
            attempt += 1
            try:
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                if 'error' in data:
                    raise RuntimeError(data['error']['info'])

                logger.info(f"✅ Datos extraídos para [{ciudad}] (intento {attempt})")
                return data

            except Exception as exc:
                logger.error(f"❌ Error en API para [{ciudad}] (intento {attempt}): {exc}")

                if self.max_attempts and attempt >= self.max_attempts:
                    logger.warning(f"🛑 Alcanzado límite de {self.max_attempts} intentos para [{ciudad}]")
                    return None

                logger.info(f"⏳ Reintentando [{ciudad}] en {self.delay} segundos…")
                time.sleep(self.delay)
    
    def procesar_respuesta(self, response_data):
        """Procesa la respuesta JSON a formato estructurado"""
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
                'fecha_extraccion': datetime.now().isoformat(),
                'codigo_tiempo': current.get('weather_code')
            }
        except Exception as e:
            logger.error(f"Error procesando respuesta: {str(e)}")
            return None
    
    def ejecutar_extraccion(self):
        """Ejecuta la extracción para todas las ciudades"""
        datos_extraidos = []
        
        logger.info(f"Iniciando extracción para {len(self.ciudades)} ciudades...")
        
        for ciudad in self.ciudades:
            ciudad = ciudad.strip()

            if not ciudad:
                continue

            logger.info(f"⏳ Esperando {self.delay} segundos antes de la petición...")
            time.sleep(self.delay)

            response = self.extraer_clima(ciudad)
            if response:
                datos_procesados = self.procesar_respuesta(response)
                if datos_procesados:
                    datos_extraidos.append(datos_procesados)
        
        return datos_extraidos

if __name__ == "__main__":
    try:
        extractor = WeatherstackExtractor()
        datos = extractor.ejecutar_extraccion()
        
        # Crear carpeta si no existe
        os.makedirs('data', exist_ok=True)
        
        # Guardar como JSON
        with open('data/clima_raw.json', 'w') as f:
            json.dump(datos, f, indent=2)
        logger.info(f"📁 Datos guardados en data/clima_raw.json")
        
        # Guardar como CSV
        df = pd.DataFrame(datos)
        df.to_csv('data/clima.csv', index=False)
        logger.info(f"📁 Datos guardados en data/clima.csv")
        
        print("\n" + "="*50)
        print("RESUMEN DE EXTRACCIÓN")
        print("="*50)
        print(df.to_string())
        print("="*50)
        
    except Exception as e:
        logger.error(f"Error en extracción: {str(e)}")
