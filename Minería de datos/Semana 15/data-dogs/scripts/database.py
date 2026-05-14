#!/usr/bin/env python3
import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()
logger = logging.getLogger(__name__)

Base = declarative_base()


def _get_db_config():
    # =========================
    # Intento 1: Streamlit Cloud (st.secrets)
    # =========================
    try:
        import streamlit as st
        host = st.secrets.get("DB_HOST", "")
        if host and host != "localhost":
            return {
                "host": host,
                "port": st.secrets.get("DB_PORT", "5432"),
                "user": st.secrets.get("DB_USER", "postgres"),
                "password": st.secrets.get("DB_PASSWORD", ""),
                "dbname": st.secrets.get("DB_NAME", "postgres"),
            }
    except Exception:
        pass  # Streamlit no disponible (modo local)

    # =========================
    # Intento 2: .env / entorno local
    # =========================
    host = os.getenv("DB_HOST", "localhost")
    return {
        "host": host,
        "port": os.getenv("DB_PORT", "5432"),
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", ""),
        "dbname": os.getenv("DB_NAME", "data_dogs"),
    }


# =========================
# CONFIG FINAL
# =========================
db_config = _get_db_config()

DB_HOST = db_config["host"]
DB_PORT = db_config["port"]
DB_USER = db_config["user"]
DB_PASSWORD = db_config["password"]
DB_NAME = db_config["dbname"]

if not DB_PASSWORD:
    raise ValueError("DB_PASSWORD no está definido ni en st.secrets ni en .env")

# 👉 Con SSL para Supabase (IMPORTANTE)
DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"
)

engine = create_engine(DATABASE_URL, echo=False, future=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("✅ Conexión a PostgreSQL exitosa")
        return True
    except Exception as e:
        logger.error(f"❌ Error conectando a PostgreSQL: {e}")
        return False