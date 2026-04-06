#!/usr/bin/env python3

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Index
from scripts.database import Base


class RazaPerro(Base):
    """
    Modelo para almacenar información de razas de perros
    """
    __tablename__ = "razas_perros"

    id = Column(Integer, primary_key=True, autoincrement=True)

    raza = Column(String(200), unique=True, nullable=False, index=True)

    vida_min = Column(Integer, nullable=False)
    vida_max = Column(Integer, nullable=False)
    vida_promedio = Column(Float, nullable=False)

    peso_macho_max = Column(Float, nullable=False)
    peso_hembra_max = Column(Float, nullable=False)
    peso_promedio = Column(Float, nullable=False)

    categoria_peso = Column(String(50), nullable=True)
    diferencia_sexual_peso = Column(Float, nullable=True)

    hipoalergenico = Column(Boolean, nullable=True)

    fecha_extraccion = Column(DateTime, default=datetime.utcnow, index=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_raza_fecha", "raza", "fecha_extraccion"),
    )

    def __repr__(self):
        return f"<RazaPerro(raza='{self.raza}', peso_promedio={self.peso_promedio})>"


class MetricasETL(Base):
    """
    Modelo para registrar métricas de cada ejecución del ETL
    """
    __tablename__ = "metricas_etl"

    id = Column(Integer, primary_key=True, autoincrement=True)

    fecha_ejecucion = Column(DateTime, default=datetime.utcnow, index=True)

    registros_extraidos = Column(Integer, nullable=False)
    registros_guardados = Column(Integer, nullable=False)
    registros_fallidos = Column(Integer, default=0)

    tiempo_ejecucion_segundos = Column(Float, nullable=False)

    estado = Column(String(50), nullable=False)  # SUCCESS, PARTIAL, FAILED
    mensaje = Column(String(500), nullable=True)

    def __repr__(self):
        return f"<MetricasETL(estado='{self.estado}', registros_guardados={self.registros_guardados})>"