#!/usr/bin/env python3
"""
demo_data.py - Genera 1000 registros de clima simulados con variación horaria.
Simula lecturas cada ~30 minutos durante ~8 días para las ciudades configuradas.

Además, si hay conexión a PostgreSQL/Supabase, inserta los registros en la tabla
`registros_clima` (y crea ciudades si faltan).
"""

import json
import pandas as pd
import numpy as np
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
import time
from dotenv import load_dotenv

random = np.random.default_rng(seed=42)

# Permite ejecutar este archivo directamente: `python scripts/demo_data.py`
repo_root = Path(__file__).resolve().parent.parent
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

# Cargar variables de entorno desde .env (CIUDADES y credenciales de BD)
load_dotenv()

CITY_PRESETS = {
    "Bogota": {"pais": "Colombia", "region": "Bogota D.C.", "latitud": 4.600, "longitud": -74.083, "temp_base": 14, "humedad_base": 80, "viento_base": 15, "presion_base": 750},
    "Medellin": {"pais": "Colombia", "region": "Antioquia", "latitud": 6.291, "longitud": -75.536, "temp_base": 22, "humedad_base": 68, "viento_base": 10, "presion_base": 890},
    "Cali": {"pais": "Colombia", "region": "Valle del Cauca", "latitud": 3.437, "longitud": -76.523, "temp_base": 28, "humedad_base": 72, "viento_base": 12, "presion_base": 880},
    "Barranquilla": {"pais": "Colombia", "region": "Atlantico", "latitud": 10.968, "longitud": -74.781, "temp_base": 33, "humedad_base": 79, "viento_base": 22, "presion_base": 1011},
    "Cartagena": {"pais": "Colombia", "region": "Bolivar", "latitud": 10.400, "longitud": -75.514, "temp_base": 31, "humedad_base": 84, "viento_base": 18, "presion_base": 1012},
    "Manizales": {"pais": "Colombia", "region": "Caldas", "latitud": 5.070, "longitud": -75.521, "temp_base": 18, "humedad_base": 75, "viento_base": 10, "presion_base": 800},
    "Bucaramanga": {"pais": "Colombia", "region": "Santander", "latitud": 7.130, "longitud": -73.126, "temp_base": 24, "humedad_base": 70, "viento_base": 10, "presion_base": 860},
    "Neiva": {"pais": "Colombia", "region": "Huila", "latitud": 2.931, "longitud": -75.330, "temp_base": 30, "humedad_base": 65, "viento_base": 12, "presion_base": 900},
    "Santa Marta": {"pais": "Colombia", "region": "Magdalena", "latitud": 11.247, "longitud": -74.202, "temp_base": 31, "humedad_base": 78, "viento_base": 18, "presion_base": 1010},
    "Cundinamarca": {"pais": "Colombia", "region": "Cundinamarca", "latitud": 4.617, "longitud": -74.100, "temp_base": 16, "humedad_base": 78, "viento_base": 12, "presion_base": 780},
    "Villavicencio": {"pais": "Colombia", "region": "Meta", "latitud": 4.153, "longitud": -73.635, "temp_base": 28, "humedad_base": 75, "viento_base": 10, "presion_base": 880},
}

DESCRIPCIONES = [
    "Sunny", "Partly cloudy", "Overcast", "Light rain",
    "Moderate rain", "Clear", "Foggy", "Thunderstorm",
]

DIRECCIONES = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

CODIGOS_TIEMPO = [113, 116, 119, 122, 176, 263, 296, 308, 389]


def _parse_ciudades_env() -> list[str]:
    raw = os.getenv("CIUDADES", "")
    raw = raw.replace(";", ",")
    return [c.strip() for c in raw.split(",") if c.strip()]


def _get_city_config(nombre: str) -> dict:
    preset = CITY_PRESETS.get(nombre)
    if preset:
        return {"ciudad": nombre, **preset}
    # Fallback generico para cualquier ciudad no listada
    return {
        "ciudad": nombre,
        "pais": "Colombia",
        "region": "N/A",
        "latitud": float(round(random.uniform(-5, 15), 3)),
        "longitud": float(round(random.uniform(-80, -65), 3)),
        "temp_base": int(random.integers(16, 32)),
        "humedad_base": int(random.integers(55, 85)),
        "viento_base": int(random.integers(5, 20)),
        "presion_base": int(random.integers(740, 1020)),
    }


def generar_registros(n_total: int = 1000, ciudades: list[dict] | None = None) -> list:
    registros = []
    ciudades = ciudades or []
    if not ciudades:
        nombres = _parse_ciudades_env() or ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"]
        ciudades = [_get_city_config(n) for n in nombres]

    registros_por_ciudad = max(1, n_total // len(ciudades))
    # Intervalo: cada 30 minutos, arrancando 8 días atrás
    inicio = datetime.now() - timedelta(days=registros_por_ciudad * 30 / 1440)

    for ciudad in ciudades:
        for i in range(registros_por_ciudad):
            hora = inicio + timedelta(minutes=i * 30)
            # Ciclo diurno: más calor al mediodía, más frío en la madrugada
            ciclo = np.sin((hora.hour - 6) * np.pi / 12)
            temp = round(ciudad["temp_base"] + ciclo * 4 + random.normal(0, 1.5), 1)
            humedad = int(np.clip(ciudad["humedad_base"] - ciclo * 8 + random.normal(0, 3), 30, 100))
            viento = round(max(0, ciudad["viento_base"] + random.normal(0, 3)), 1)
            presion = int(ciudad["presion_base"] + random.normal(0, 2))
            sensacion = round(temp - random.uniform(0, 3), 1)
            visibilidad = int(np.clip(random.normal(12, 3), 2, 20))
            uv = int(np.clip(ciclo * 8 + random.normal(0, 1), 0, 11))

            registros.append({
                "ciudad":           ciudad["ciudad"],
                "pais":             ciudad["pais"],
                "region":           ciudad["region"],
                "latitud":          float(ciudad["latitud"]),
                "longitud":         float(ciudad["longitud"]),
                "temperatura":      temp,
                "sensacion_termica": sensacion,
                "humedad":          humedad,
                "velocidad_viento": viento,
                "direccion_viento": random.choice(DIRECCIONES),
                "presion":          presion,
                "visibilidad":      visibilidad,
                "indice_uv":        uv,
                "descripcion":      random.choice(DESCRIPCIONES),
                "codigo_tiempo":    int(random.choice(CODIGOS_TIEMPO)),
                "hora_local":       hora.strftime("%Y-%m-%d %H:%M"),
                "timestamp":        hora.isoformat(),
            })

    # Si n_total no es divisible exacto, completamos con los últimos registros
    while len(registros) < n_total:
        registros.append(registros[-1].copy())

    return registros[:n_total]

def subir_a_supabase(datos: list[dict]) -> tuple[int, int]:
    """
    Inserta datos demo en Supabase/PostgreSQL:
    - Crea ciudades si no existen (por nombre)
    - Inserta registros_clima en bulk
    Retorna (ciudades_creadas, registros_insertados).
    """
    from scripts.database import SessionLocal
    from scripts.models import Ciudad, RegistroClima, MetricasETL

    t0 = time.time()
    db = SessionLocal()
    ciudades_creadas = 0
    registros_insertados = 0
    try:
        # Cache de ciudades existentes por nombre
        existentes = {c.nombre: c for c in db.query(Ciudad).all()}

        # Asegurar ciudades
        for row in datos:
            nombre = row["ciudad"]
            if nombre in existentes:
                continue
            ciudad = Ciudad(
                nombre=nombre,
                pais=row.get("pais", "Colombia"),
                latitud=float(row.get("latitud", 0.0)),
                longitud=float(row.get("longitud", 0.0)),
            )
            db.add(ciudad)
            db.flush()
            existentes[nombre] = ciudad
            ciudades_creadas += 1

        # Preparar registros de clima
        objetos: list[RegistroClima] = []
        for row in datos:
            ciudad = existentes[row["ciudad"]]
            fecha_extraccion = datetime.fromisoformat(row["timestamp"])
            objetos.append(
                RegistroClima(
                    ciudad_id=ciudad.id,
                    temperatura=float(row["temperatura"]),
                    sensacion_termica=float(row["sensacion_termica"]),
                    humedad=float(row["humedad"]),
                    velocidad_viento=float(row["velocidad_viento"]),
                    descripcion=str(row["descripcion"]),
                    codigo_tiempo=int(row.get("codigo_tiempo", 0)),
                    fecha_extraccion=fecha_extraccion,
                )
            )

        # Bulk insert por chunks
        chunk_size = 500
        for i in range(0, len(objetos), chunk_size):
            chunk = objetos[i:i + chunk_size]
            db.bulk_save_objects(chunk)
            db.commit()
            registros_insertados += len(chunk)

        # Métrica ETL
        tiempo = time.time() - t0
        metricas = MetricasETL(
            registros_extraidos=len(datos),
            registros_guardados=registros_insertados,
            registros_fallidos=len(datos) - registros_insertados,
            tiempo_ejecucion_segundos=tiempo,
            estado="SUCCESS" if registros_insertados == len(datos) else "PARTIAL",
            mensaje=f"DEMO bulk insert: {registros_insertados}/{len(datos)}",
        )
        db.add(metricas)
        db.commit()

        return ciudades_creadas, registros_insertados
    finally:
        db.close()


def generar_datos_demo(n: int = 1000):
    os.makedirs('data', exist_ok=True)
    datos = generar_registros(n)

    with open('data/clima_raw.json', 'w', encoding='utf-8') as f:
        json.dump(datos, f, indent=2, ensure_ascii=False)
    print(f"✅ data/clima_raw.json  — {len(datos)} registros")

    df = pd.DataFrame(datos)
    df.to_csv('data/clima.csv', index=False)
    print(f"✅ data/clima.csv       — {len(df)} filas x {len(df.columns)} columnas")

    print("\n📊 Resumen por ciudad:")
    resumen = df.groupby('ciudad').agg(
        registros=('temperatura', 'count'),
        temp_media=('temperatura', 'mean'),
        temp_min=('temperatura', 'min'),
        temp_max=('temperatura', 'max'),
        humedad_media=('humedad', 'mean'),
    ).round(1)
    print(resumen.to_string())
    print(f"\n⚠️  Datos de DEMO (simulados). Total: {len(df)} registros.")

    # Subir a Supabase si hay conexión disponible
    try:
        ciudades_creadas, registros_insertados = subir_a_supabase(datos)
        print(f"\n🗄️  Supabase: ciudades nuevas={ciudades_creadas} | registros insertados={registros_insertados}")
    except Exception as exc:
        print(f"\n⚠️  No se pudo subir a Supabase: {exc}")


if __name__ == "__main__":
    generar_datos_demo(1000)
