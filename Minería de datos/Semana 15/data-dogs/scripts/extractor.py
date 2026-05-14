#!/usr/bin/env python3
import os
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
import logging

# ======================
# Cargar variables
# ======================
load_dotenv()
DOG_API_BASE_URL = os.getenv("DOG_API_BASE_URL", "https://dogapi.dog/api/v2")

# ======================
# Logging
# ======================
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/etl.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ======================
# Extractor (CSV/JSON)
# ======================
class DogAPIExtractor:

    def __init__(self):
        self.base_url = DOG_API_BASE_URL

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

        logger.info(f"📦 Total razas reales obtenidas: {len(datos)}")
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

        # Validación dura (datos incompletos fuera)
        if not all([peso_m, peso_f, vida_min, vida_max]):
            return None

        peso_prom = (peso_m + peso_f) / 2
        vida_prom = (vida_min + vida_max) / 2

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
            "fecha_extraccion": datetime.utcnow().isoformat()
        }

    def ejecutar(self):
        razas = self.extraer_todas_las_razas()

        procesadas = []
        for r in razas:
            fila = self.procesar_raza(r)
            if fila:
                procesadas.append(fila)

        logger.info(f"🧹 Razas válidas tras limpieza: {len(procesadas)}")
        return procesadas


if __name__ == "__main__":
    extractor = DogAPIExtractor()
    datos = extractor.ejecutar()

    df = pd.DataFrame(datos)

    os.makedirs("data", exist_ok=True)

    df.to_csv("data/dogs_normalized.csv", index=False)
    logger.info("📁 Datos guardados en data/dogs_normalized.csv")

    df.to_json("data/dogs_normalized.json", orient="records", indent=2, force_ascii=False)
    logger.info("📁 Datos guardados en data/dogs_normalized.json")

    logger.info("✅ Dataset normalizado generado correctamente")
    print(df.head())