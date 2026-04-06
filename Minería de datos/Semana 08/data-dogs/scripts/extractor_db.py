#!/usr/bin/env python3
import os
import time
import requests
from datetime import datetime
from dotenv import load_dotenv
import logging
from sqlalchemy.exc import IntegrityError

from scripts.database import SessionLocal
from scripts.models import RazaPerro, MetricasETL

load_dotenv()
DOG_API_BASE_URL = os.getenv("DOG_API_BASE_URL", "https://dogapi.dog/api/v2")

os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("logs/etl.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class DogAPIExtractorDB:
    def __init__(self):
        self.base_url = DOG_API_BASE_URL
        self.db = SessionLocal()
        self.registros_extraidos = 0
        self.registros_guardados = 0
        self.registros_fallidos = 0

    def categoria_peso(self, peso):
        if peso is None:
            return None
        if peso < 10:
            return "Muy pequeño"
        elif peso < 20:
            return "Pequeño"
        elif peso < 30:
            return "Mediano"
        elif peso < 45:
            return "Grande"
        else:
            return "Gigante"

    def extraer_todas_las_razas(self):
        datos = []
        page = 1

        while True:
            logger.info(f"📥 Extrayendo página {page}")
            response = requests.get(
                f"{self.base_url}/breeds",
                params={"page[number]": page},
                timeout=10
            )
            response.raise_for_status()

            json_data = response.json()
            page_data = json_data.get("data", [])

            if not page_data:
                break

            datos.extend(page_data)
            page += 1

        logger.info(f"📦 Total razas obtenidas: {len(datos)}")
        return datos

    def procesar_raza(self, breed):
        attr = breed.get("attributes", {}) or {}
        male = attr.get("male_weight", {}) or {}
        female = attr.get("female_weight", {}) or {}
        life = attr.get("life", {}) or {}

        peso_m = male.get("max")
        peso_f = female.get("max")
        vida_min = life.get("min")
        vida_max = life.get("max")

        # Filtrar registros incompletos
        if not all([peso_m, peso_f, vida_min, vida_max]):
            return None

        peso_prom = (peso_m + peso_f) / 2
        vida_prom = (vida_min + vida_max) / 2
        ahora = datetime.utcnow()

        return {
            "raza": attr.get("name"),
            "vida_min": vida_min,
            "vida_max": vida_max,
            "vida_promedio": vida_prom,
            "peso_macho_max": peso_m,
            "peso_hembra_max": peso_f,
            "peso_promedio": peso_prom,
            "categoria_peso": self.categoria_peso(peso_prom),
            "diferencia_sexual_peso": peso_m - peso_f,
            "hipoalergenico": attr.get("hypoallergenic"),
            "fecha_extraccion": ahora,
            "fecha_creacion": ahora,
        }

    def upsert_raza(self, data):
        try:
            obj = self.db.query(RazaPerro).filter_by(raza=data["raza"]).first()

            if obj is None:
                obj = RazaPerro(**data)
                self.db.add(obj)
            else:
                # No sobreescribir fecha_creacion si ya existe
                fecha_creacion_original = obj.fecha_creacion
                for k, v in data.items():
                    if k != "fecha_creacion":
                        setattr(obj, k, v)
                obj.fecha_creacion = fecha_creacion_original

            self.db.commit()
            self.registros_guardados += 1
            return True

        except IntegrityError:
            self.db.rollback()
            self.registros_fallidos += 1
            logger.error(f"❌ IntegrityError guardando {data.get('raza')}")
            return False
        except Exception as e:
            self.db.rollback()
            self.registros_fallidos += 1
            logger.error(f"❌ Error guardando {data.get('raza')}: {e}")
            return False

    def guardar_metricas_etl(self, tiempo_total, estado, mensaje=None):
        try:
            metrica = MetricasETL(
                fecha_ejecucion=datetime.utcnow(),
                registros_extraidos=self.registros_extraidos,
                registros_guardados=self.registros_guardados,
                registros_fallidos=self.registros_fallidos,
                tiempo_ejecucion_segundos=tiempo_total,
                estado=estado,
                mensaje=mensaje,
            )
            self.db.add(metrica)
            self.db.commit()
            logger.info("📊 Métricas ETL guardadas correctamente")
        except Exception as e:
            self.db.rollback()
            logger.error(f"❌ No se pudieron guardar las métricas ETL: {e}")

    def ejecutar(self):
        inicio = time.time()
        estado = "SUCCESS"
        mensaje = "Ejecución completada correctamente"

        try:
            razas = self.extraer_todas_las_razas()

            for r in razas:
                fila = self.procesar_raza(r)
                if fila:
                    self.registros_extraidos += 1
                    self.upsert_raza(fila)

            if self.registros_guardados == 0 and self.registros_fallidos > 0:
                estado = "FAILED"
                mensaje = "No se guardó ningún registro"
            elif self.registros_fallidos > 0:
                estado = "PARTIAL"
                mensaje = "Ejecución completada con algunos errores"

            logger.info("✅ ETL terminado")
            logger.info(f"Extraídos: {self.registros_extraidos}")
            logger.info(f"Guardados: {self.registros_guardados}")
            logger.info(f"Fallidos: {self.registros_fallidos}")

        except Exception as e:
            estado = "FAILED"
            mensaje = f"Error general en la ejecución: {str(e)}"
            logger.error(f"❌ {mensaje}")

        finally:
            tiempo_total = round(time.time() - inicio, 2)
            self.guardar_metricas_etl(tiempo_total, estado, mensaje)
            self.db.close()


if __name__ == "__main__":
    DogAPIExtractorDB().ejecutar()