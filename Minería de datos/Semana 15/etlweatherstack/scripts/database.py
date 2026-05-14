#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, declarative_base
import logging

load_dotenv()

logger = logging.getLogger(__name__)

def _get_db_config() -> dict:
    """
    Lee credenciales en este orden:
    1) Streamlit secrets (Streamlit Cloud)
    2) Variables de entorno / .env (local)
    """
    # Primero: variables de entorno / .env (local). Si estan completas,
    # no importamos streamlit para evitar warnings cuando se ejecuta via CLI.
    env_cfg = {
        "host": os.getenv("DB_HOST", ""),
        "port": os.getenv("DB_PORT", ""),
        "user": os.getenv("DB_USER", ""),
        "password": os.getenv("DB_PASSWORD", ""),
        "dbname": os.getenv("DB_NAME", ""),
        "sslmode": os.getenv("DB_SSLMODE", ""),
    }
    if all([env_cfg["host"], env_cfg["port"], env_cfg["user"], env_cfg["password"], env_cfg["dbname"]]):
        return env_cfg

    # Intento 1: st.secrets (Streamlit Cloud). Solo intentamos si ya estamos
    # dentro de un proceso Streamlit o si no hay cfg local completa.
    try:
        st = sys.modules.get("streamlit")
        if st is None:
            import streamlit as st  # type: ignore

        host = st.secrets.get("DB_HOST", "")
        if host and host != "localhost":
            return {
                "host": host,
                "port": str(st.secrets.get("DB_PORT", "5432")),
                "user": st.secrets.get("DB_USER", "postgres"),
                "password": st.secrets.get("DB_PASSWORD", ""),
                "dbname": st.secrets.get("DB_NAME", "postgres"),
                "sslmode": st.secrets.get("DB_SSLMODE", ""),
            }
    except Exception:
        pass  # st no disponible o secrets no configurados

    return env_cfg


db_config = _get_db_config()
DB_HOST = db_config["host"]
DB_PORT = db_config["port"]
DB_USER = db_config["user"]
DB_PASSWORD = db_config["password"]
DB_NAME = db_config["dbname"]

if not all([DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME]):
    raise ValueError(
        "Faltan variables de conexión. Define DB_HOST, DB_PORT, DB_USER, "
        "DB_PASSWORD, DB_NAME en .env (local) o en Streamlit Secrets (producción)."
    )

# En servicios cloud (p.ej. Supabase) suele ser obligatorio SSL.
db_sslmode = db_config.get("sslmode") or ""
if not db_sslmode and DB_HOST and "supabase.com" in DB_HOST:
    db_sslmode = "require"

DATABASE_URL = URL.create(
    "postgresql+psycopg2",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME,
)

# Motor SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"sslmode": db_sslmode} if db_sslmode else {},
)

# Base para modelos ORM
Base = declarative_base()

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Metadata para inspeccionar la BD
metadata = MetaData()

def reflect_metadata() -> MetaData:
    """Refleja el esquema actual de la BD bajo demanda (evita conectar al importar el módulo)."""
    metadata.clear()
    metadata.reflect(bind=engine)
    return metadata

def get_db():
    """Obtiene una sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_connection():
    """Prueba la conexión a la base de datos"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            logger.info("✅ Conexión a PostgreSQL exitosa")
            return True
    except Exception as e:
        logger.error(f"❌ Error conectando a PostgreSQL: {str(e)}")
        return False

def create_all_tables():
    """Crea todas las tablas definidas en los modelos"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Tablas creadas exitosamente")
    except Exception as e:
        logger.error(f"❌ Error creando tablas: {str(e)}")
