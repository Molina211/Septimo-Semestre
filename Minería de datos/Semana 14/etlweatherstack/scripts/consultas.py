#!/usr/bin/env python3
import sys
sys.path.insert(0, '.')

from scripts.database import SessionLocal
from scripts.models import Ciudad, RegistroClima, MetricasETL
from sqlalchemy import func
import pandas as pd

db = SessionLocal()

def temperatura_promedio_por_ciudad():
    """Temperatura promedio de cada ciudad"""
    registros = db.query(
        Ciudad.nombre,
        func.avg(RegistroClima.temperatura).label('temp_promedio')
    ).join(RegistroClima).group_by(Ciudad.nombre).all()
    
    df = pd.DataFrame(registros, columns=['Ciudad', 'Temperatura Promedio'])
    print("\n📊 TEMPERATURA PROMEDIO POR CIUDAD:")
    print(df.to_string(index=False))

def ciudad_mas_humeda():
    """Identifica ciudad con mayor humedad"""
    registro = db.query(
        Ciudad.nombre,
        RegistroClima.humedad,
        RegistroClima.fecha_extraccion
    ).join(Ciudad).order_by(
        RegistroClima.humedad.desc()
    ).first()
    
    if registro:
        print(f"\n💧 CIUDAD MÁS HÚMEDA: {registro.nombre} con {registro.humedad}%")

def velocidad_viento_max():
    """Velocidad máxima de viento registrada"""
    registro = db.query(
        Ciudad.nombre,
        RegistroClima.velocidad_viento
    ).join(Ciudad).order_by(
        RegistroClima.velocidad_viento.desc()
    ).first()
    
    if registro:
        print(f"\n💨 VIENTO MÁS FUERTE: {registro.nombre} con {registro.velocidad_viento} km/h")

def metricas_etl():
    """Muestra métricas de ejecuciones"""
    metricas = db.query(MetricasETL).order_by(
        MetricasETL.fecha_ejecucion.desc()
    ).limit(5).all()
    
    print("\n📈 ÚLTIMAS 5 EJECUCIONES DEL ETL:")
    for m in metricas:
        print(f"  - {m.fecha_ejecucion}: {m.estado} ({m.registros_guardados} registros en {m.tiempo_ejecucion_segundos:.2f}s)")

if __name__ == "__main__":
    try:
        print("\n" + "="*50)
        print("ANÁLISIS DE DATOS - POSTGRESQL")
        print("="*50)
        
        temperatura_promedio_por_ciudad()
        ciudad_mas_humeda()
        velocidad_viento_max()
        metricas_etl()
        
        print("\n" + "="*50 + "\n")
        
    finally:
        db.close()