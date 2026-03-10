# Calidad de Software: Conceptos, Evolución e Historia

> _"In God we trust, all others must bring data." — W. Edwards Deming_

La calidad de software no es un lujo — es una **responsabilidad profesional**. Este documento recorre su evolución desde los años 70 hasta hoy, y presenta a los grandes referentes que dieron forma a la disciplina que practicamos.

---

## Tabla de Contenidos

1. [Conceptos Fundamentales](#1-conceptos-fundamentales)
2. [Evolución Histórica](#2-evoluci%C3%B3n-hist%C3%B3rica)
3. [Grandes Referentes](#3-grandes-referentes)
4. [Estándares y Modelos Clave](#4-est%C3%A1ndares-y-modelos-clave)
5. [Conclusiones y Tendencias Futuras](#5-conclusiones-y-tendencias-futuras)

---

## 1. Conceptos Fundamentales

### ¿Qué es la calidad de software?

La calidad de software es un concepto que ha evolucionado significativamente desde la década de 1970. No es simplemente "software que funciona", sino un conjunto de características que garantiza que el producto **cumple con las expectativas del usuario y los estándares de la industria**.

> **Definición académica:** _"La calidad de software es el grado en que un sistema, componente o proceso cumple con los requisitos especificados, las necesidades y expectativas del cliente, y está libre de defectos."_

### Las 4 Dimensiones Clave

|Dimensión|Pregunta central|¿Qué implica?|
|---|---|---|
|**Conformidad**|¿El software hace lo que fue especificado?|Cumplimiento de requisitos, funcionalidad completa, documentación adecuada|
|**Confiabilidad**|¿Puedo confiar en que siempre funcionará?|Pocos defectos, disponibilidad constante, recuperación ante fallos|
|**Mantenibilidad**|¿Es fácil modificarlo o actualizarlo?|Código limpio, documentación clara, bajo costo de cambios|
|**Eficiencia**|¿Usa los recursos de forma óptima?|Tiempo de respuesta rápido, uso eficiente de memoria, escalabilidad|

### El costo de la mala calidad

> 💡 Estudios de la industria demuestran que el costo de corregir un defecto **en producción** es aproximadamente **100 veces más costoso** que arreglarlo durante el desarrollo.

```
Costo relativo de corrección según fase:

  Diseño        │█░░░░░░░░░░░  ×1
  Desarrollo    │███░░░░░░░░░  ×10
  Testing       │█████░░░░░░░  ×25
  Producción    │████████████  ×100
```

Este dato solo justifica invertir en calidad desde el primer día.

---

## 2. Evolución Histórica

La calidad de software pasó de ser un concepto vago a una **disciplina con métricas precisas, estándares internacionales y metodologías probadas**. Aquí el recorrido completo:

```
1968 ────────────────────────────────────────────────────── Hoy
  │        │        │        │        │        │        │
  │      70-80    1987     1991     2001     2005   2010+
  │        │        │        │        │        │        │
Crisis   Era QA   ISO     CMM    Manif.  SQuaRE  DevOps
Software          9000           Ágil   25000    CI/CD
```

### 1968 — La Crisis del Software

El término **"Software Engineering"** es acuñado en la conferencia de Garmisch. Se reconoce por primera vez que desarrollar software requiere disciplina y metodología como cualquier otra rama de la ingeniería. Antes de este hito, los proyectos se desarrollaban de forma ad hoc, sin procesos definidos.

### 1970–1980 — Era del Control de Calidad

Se introducen las primeras prácticas formales de **Quality Assurance (QA)**. La industria empieza a usar métricas básicas: número de defectos, cobertura de código, tiempos de entrega. Nace la idea de que la calidad puede y debe _medirse_.

### 1987 — Estándar ISO 9000

Se publica el primer estándar internacional **ISO 9000**. Posteriormente, la ISO 9001 se adapta específicamente para procesos de desarrollo de software, dando a las organizaciones un marco certificable de gestión de calidad.

### 1991 — Modelo CMM

El **SEI (Software Engineering Institute)** publica el CMM _(Capability Maturity Model)_, un marco que define cinco niveles de madurez en el desarrollo de software: desde procesos caóticos (Nivel 1) hasta organizaciones completamente optimizadas (Nivel 5).

### 2001 — Manifiesto Ágil

El **Manifiesto Ágil** revoluciona la forma de pensar sobre calidad. En lugar de verificarla al final, la calidad pasa a ser **parte integral de cada iteración**. Los principios ágiles integran testing, feedback y mejora continua en el ciclo de desarrollo.

### 2005 — ISO/IEC 25000 (SQuaRE)

Se publica la serie **SQuaRE** _(Software product Quality Requirements and Evaluation)_. Reemplaza a la ISO 9126 con un modelo más completo y actualizado de 8 características de calidad, aún vigente hoy como ISO/IEC 25010.

### 2010–Presente — DevOps y Calidad Continua

Emergen las prácticas de **Integración Continua (CI)** y **Entrega Continua (CD)**. La calidad ya no se mide en hitos: se monitorea en **tiempo real** durante toda la vida del software, con herramientas automatizadas integradas al pipeline de despliegue.

---

## 3. Grandes Referentes

Estas son las personas que construyeron los cimientos sobre los que trabajamos hoy.

---

### W. Edwards Deming (1900–1993)

_Control de Calidad · Mejora Continua_

El padre de la calidad moderna. Aunque comenzó su trabajo en manufactura, sus principios se aplican directamente al desarrollo de software.

- **Ciclo PDCA** (Plan-Do-Check-Act) — base de toda mejora continua
- **14 Principios de Calidad** — filosofía de gestión orientada a procesos
- Enfoque en **sistemas y procesos**, no en culpar a individuos

> _"Si no puedes medir algo, no puedes mejorarlo."_

---

### Joseph M. Juran (1904–2008)

_Gestión de Calidad · Mejora Organizacional_

Contemporáneo de Deming, Juran aportó una visión más orientada a la gestión empresarial de la calidad.

- **Trilogía de Juran** — Planificación, Control y Mejora como tres procesos inseparables
- **Principio de Pareto** aplicado a calidad: el 80% de los defectos proviene del 20% de las causas
- La calidad como **responsabilidad de toda la empresa**, no de un departamento

> _"La calidad no ocurre por accidente; ocurre por intención."_

---

### Barry Boehm (1935–)

_Ingeniería de Software · Modelos de Proceso_

Boehm conectó la ingeniería de software con la economía del desarrollo, poniendo números al costo de la calidad.

- **Modelo en Espiral** de desarrollo — iterativo con gestión de riesgos
- **COCOMO** _(Constructive Cost Model)_ — estimación de costos de software
- Análisis cuantitativo de costo-beneficio en decisiones de calidad

> _"La prevención de defectos es mejor que la cura."_

---

### Frederick Brooks (1931–)

_Gestión de Proyectos · Arquitectura de Software_

Su libro **"The Mythical Man-Month"** sigue siendo uno de los textos más influyentes de la ingeniería de software, décadas después de su publicación.

- Demostró que agregar personas a un proyecto tardío lo retrasa más
- Importancia crítica de la **arquitectura de software** como base de la calidad
- Errores sistémicos en gestión de proyectos y cómo evitarlos

> _"La documentación clara es tan importante como el código."_

---

### Watts Humphrey (1927–2010)

_Procesos de Software · CMM_

Conocido como el **"padre del CMM"**, Humphrey transformó la forma en que las organizaciones entienden y mejoran sus procesos de desarrollo.

- **CMM** _(Capability Maturity Model)_ — el modelo de madurez más influyente de la historia del software
- **PSP** _(Personal Software Process)_ — mejora de calidad a nivel individual del desarrollador
- Mejora de procesos basada en métricas objetivas

> _"La calidad de un producto es reflejo del proceso usado para crearlo."_

---

### Capers Jones (1941–)

_Métricas de Software · Productividad_

Jones dedicó su carrera a recolectar y analizar datos reales de miles de proyectos de software para revelar verdades objetivas sobre calidad y productividad.

- Análisis masivo de **defectos en software** a lo largo de décadas
- **Benchmarking** de calidad y productividad entre industrias
- Estimación objetiva del costo real de los defectos

> _"Los datos revelan la verdad detrás de la calidad."_

---

### Ken Schwaber (1952–) y Jeff Sutherland (1945–)

_Metodologías Ágiles · Scrum_

Los co-creadores de **Scrum** redefinieron la relación entre velocidad y calidad, demostrando que no son opuestos.

- **Framework Scrum** — calidad integrada en cada sprint, no al final
- **Retrospectivas** como mecanismo formal de mejora continua
- Principio central: la calidad es **parte de cada tarea**, no una fase separada

> _Schwaber: "La calidad es parte de cada tarea, no una fase separada."_ _Sutherland: "Hacer más con menos sin comprometer la calidad."_

---

## 4. Estándares y Modelos Clave

|Estándar / Modelo|Año|Organización|Descripción|
|---|---|---|---|
|**ISO 9001**|1987|ISO|Estándar de gestión de calidad aplicable a procesos de software|
|**Six Sigma**|1986|Motorola|Metodología de mejora basada en datos estadísticos|
|**CMM / CMMI**|1991 / 2002|SEI (Carnegie Mellon)|Modelo de madurez de capacidad para procesos de desarrollo|
|**Manifiesto Ágil**|2001|Comunidad Ágil|Principios para desarrollo iterativo con calidad integrada|
|**ISO/IEC 25000 SQuaRE**|2005|ISO/IEC|Serie completa de estándares para evaluación de calidad|
|**ISO/IEC 25010**|2011|ISO/IEC|Modelo de 8 características de calidad del producto|

---

## 5. Conclusiones y Tendencias Futuras

### Lecciones que perduran

**La calidad es un proceso, no un destino** Como afirmaba Deming, la mejora continua _(Kaizen)_ es fundamental. La calidad no se alcanza — se mantiene y se mejora constantemente a través de ciclos PDCA.

**La medición es esencial** Sin métricas, la calidad es subjetiva. Las herramientas modernas de CI/CD permiten medir calidad en tiempo real, haciendo objetivas decisiones que antes dependían del criterio individual.

**La prevención supera a la corrección** Invertir en buenas prácticas de desarrollo — code reviews, testing automatizado, documentación — reduce exponencialmente el costo de defectos. El ratio 1:100 entre desarrollo y producción lo confirma.

**Toda la organización es responsable** La calidad no pertenece a un equipo de QA. Desarrolladores, arquitectos, gestores y clientes deben colaborar activamente. Es una cultura, no un departamento.

### Tendencias que están redefiniendo la disciplina

|Tendencia|Descripción|
|---|---|
|🤖 **IA y Machine Learning**|Detección automática de defectos y predicción de fallos mediante análisis de patrones en el código|
|☁️ **Cloud-Native Quality**|Calidad en arquitecturas serverless, microservicios y sistemas distribuidos con nueva complejidad|
|🔐 **Security by Design**|Integración de seguridad desde el inicio del ciclo de desarrollo _(Shift-Left Security)_|
|📊 **Observabilidad**|Monitoreo en tiempo real de sistemas en producción con trazabilidad completa de transacciones|

---

> La excelencia en calidad no es accidental: es el resultado de **disciplina, medición, mejora continua** y un compromiso inquebrantable con la profesión.

---

_Material docente — José Llanos & Luis Vargas_ _Ingeniería de Sistemas · Curso de Calidad de Software_ _CORHUILA © 2025 — Semana 16_