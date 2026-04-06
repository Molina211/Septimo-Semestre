#!/usr/bin/env python3
import sys
sys.path.insert(0, ".")

from scripts.database import SessionLocal
from scripts.models import RazaPerro
from sqlalchemy import func

db = SessionLocal()

def total_razas():
    total = db.query(func.count(RazaPerro.id)).scalar() or 0
    print(f"\n📦 Total razas en BD: {total}")
    return total

def promedio_vida():
    row = db.query(func.avg(RazaPerro.vida_promedio).label("vida_promedio_global")).one()
    if row.vida_promedio_global is None:
        print("🧬 Vida promedio global: N/A (no hay datos aún)")
    else:
        print(f"🧬 Vida promedio global: {row.vida_promedio_global:.2f} años")

def top_10_mas_pesadas():
    rows = (
        db.query(RazaPerro.raza, RazaPerro.peso_promedio)
        .order_by(RazaPerro.peso_promedio.desc())
        .limit(10)
        .all()
    )
    print("\n🏋️ Top 10 razas más pesadas (peso_promedio):")
    if not rows:
        print("  N/A (no hay datos aún)")
        return
    for r, p in rows:
        print(f"  - {r}: {p:.2f}")

def top_10_mas_longevas():
    rows = (
        db.query(RazaPerro.raza, RazaPerro.vida_promedio)
        .order_by(RazaPerro.vida_promedio.desc())
        .limit(10)
        .all()
    )
    print("\n⏳ Top 10 razas más longevas (vida_promedio):")
    if not rows:
        print("  N/A (no hay datos aún)")
        return
    for r, v in rows:
        print(f"  - {r}: {v:.2f} años")

def conteo_hipoalergenicas():
    total = db.query(func.count(RazaPerro.id)).scalar() or 0
    if total == 0:
        print("\n🌿 Hipoalergénicas: N/A (no hay datos aún)")
        return

    true_count = db.query(func.count(RazaPerro.id)).filter(RazaPerro.hipoalergenico.is_(True)).scalar() or 0
    false_count = db.query(func.count(RazaPerro.id)).filter(RazaPerro.hipoalergenico.is_(False)).scalar() or 0
    null_count = db.query(func.count(RazaPerro.id)).filter(RazaPerro.hipoalergenico.is_(None)).scalar() or 0

    print("\n🌿 Hipoalergénicas (conteo):")
    print(f"  - True:  {true_count}")
    print(f"  - False: {false_count}")
    print(f"  - NULL:  {null_count}")

if __name__ == "__main__":
    try:
        print("\n" + "="*50)
        print("ANÁLISIS DE DATOS - DATA_DOGS (PostgreSQL)")
        print("="*50)

        total_razas()
        promedio_vida()
        top_10_mas_pesadas()
        top_10_mas_longevas()
        conteo_hipoalergenicas()

        print("\n" + "="*50 + "\n")
    finally:
        db.close()