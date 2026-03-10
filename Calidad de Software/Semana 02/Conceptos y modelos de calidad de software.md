# Unidad 1: Introducción a los Estándares de Calidad de Software

> _"No se puede controlar lo que no se puede medir."_

En esta unidad dejamos de ver la calidad como un concepto subjetivo y empezamos a medirla con **rigor de ingeniería**. Estos son los cimientos para construir software de nivel profesional.

---

## Tabla de Contenidos

1. [Conceptos Fundamentales de Calidad](#1-conceptos-fundamentales-de-calidad)
2. [El Modelo ISO/IEC 25010](#2-el-modelo-isoiec-25010)
3. [QA vs. QC — ¿Cuál es la diferencia?](#3-qa-vs-qc--cu%C3%A1l-es-la-diferencia)
4. [Caso de Estudio: FoodFast](#4-caso-de-estudio-foodfast)

---

## 1. Conceptos Fundamentales de Calidad

En ingeniería de sistemas, la calidad **no** significa que el software sea perfecto. Significa que **cumpla con los requisitos especificados y las expectativas del cliente**.

### Definición formal (IEEE 610)

> _"La calidad de software es el grado en que un sistema, componente o proceso cumple con los requerimientos especificados y las necesidades o expectativas del cliente o usuario final."_

Esta definición tiene dos dimensiones clave que siempre deben estar presentes:

- **Conformidad con los requisitos** — el software hace lo que se le pidió que hiciera
- **Satisfacción del usuario** — el software cumple las expectativas reales de quien lo usa

Ambas son necesarias. Un software técnicamente correcto pero que nadie puede usar no es de calidad; tampoco lo es un software agradable pero lleno de errores.

---

## 2. El Modelo ISO/IEC 25010

### ¿Qué es?

El estándar **ISO/IEC 25010** es parte de la familia **SQuaRE** _(Systems and Software Quality Requirements and Evaluation)_. Es el mapa que define **qué debemos evaluar** en un producto de software, organizando la calidad en **8 características principales**.

Aplicar este modelo desde la fase de diseño — no al final — reduce costos drásticamente.

### Las 8 Características de Calidad

|Característica|¿Qué evalúa?|Subcaracterísticas clave|
|---|---|---|
|**Adecuación Funcional**|Qué tan bien cumple el software sus tareas|Completitud, corrección, pertinencia|
|**Eficiencia de Desempeño**|Relación entre rendimiento y recursos usados|Tiempos de respuesta, uso de CPU/RAM|
|**Compatibilidad**|Capacidad de intercambiar información con otros sistemas|Coexistencia, interoperabilidad|
|**Usabilidad**|Facilidad de aprendizaje y uso para el usuario|Estética, protección ante errores, accesibilidad|
|**Fiabilidad**|Capacidad de mantener rendimiento bajo condiciones adversas|Madurez, disponibilidad, tolerancia a fallos|
|**Seguridad**|Protección de información y datos|Confidencialidad, integridad, no repudio|
|**Mantenibilidad**|Facilidad para ser modificado o corregido|Modularidad, reusabilidad, analizabilidad|
|**Portabilidad**|Facilidad para trasladarse de un entorno a otro|Adaptabilidad, facilidad de instalación|

### Visualización del modelo

```
                    ISO/IEC 25010
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
┌───▼───┐          ┌─────▼─────┐        ┌────▼────┐
│Funcio-│          │Eficiencia │        │Compati- │
│nalidad│          │Desempeño  │        │bilidad  │
└───────┘          └───────────┘        └─────────┘
    │                    │                    │
┌───▼───┐          ┌─────▼─────┐        ┌────▼────┐
│Usabi- │          │Fiabilidad │        │Seguri-  │
│lidad  │          │           │        │dad      │
└───────┘          └───────────┘        └─────────┘
    │                    │
┌───▼───┐          ┌─────▼─────┐
│Mante- │          │Portabili- │
│nibili-│          │dad        │
│dad    │          └───────────┘
└───────┘
```

> **Principio clave:** Un ingeniero de sistemas aplica este modelo desde el diseño, no al final del proyecto. Detectar un defecto de seguridad en diseño cuesta 10× menos que corregirlo en producción.

---

## 3. QA vs. QC — ¿Cuál es la diferencia?

Es común confundir estos términos, pero en el ciclo de vida del desarrollo (**SDLC**) tienen roles distintos y complementarios.

### Quality Assurance (QA) — Orientado al Proceso

El QA se enfoca en **prevenir** defectos asegurando que los procesos sean los adecuados. Es una actividad **proactiva** que ocurre durante todo el proceso de desarrollo.

- **Meta:** Que los defectos nunca ocurran
- **Responsabilidad:** Todo el equipo (líderes, arquitectos, desarrolladores)
- **Ejemplo práctico:** Implementar una política de _Code Review_ obligatoria antes de cualquier merge a rama principal

### Quality Control (QC) — Orientado al Producto

El QC se enfoca en **identificar y corregir** defectos en el software ya construido. Es una actividad **reactiva** que ocurre en hitos específicos o al final de una fase.

- **Meta:** Que los defectos no lleguen al usuario
- **Responsabilidad:** Equipo de Testing / Desarrolladores
- **Ejemplo práctico:** Ejecutar un set de pruebas automatizadas sobre el flujo de "Pago" antes de cada release

### Comparativa directa

|Característica|Quality Assurance (QA)|Quality Control (QC)|
|---|---|---|
|**Enfoque**|Proceso|Producto|
|**Tipo de actividad**|Proactiva|Reactiva|
|**Meta principal**|Prevención de defectos|Detección de defectos|
|**¿Cuándo ocurre?**|Durante todo el proceso|Al final o en hitos específicos|
|**Responsables**|Todo el equipo|Equipo de QA/Testing|

### ¿Cómo se complementan?

```
  INICIO DEL PROYECTO                        ENTREGA
        │                                       │
        ▼                                       ▼
  ┌─────────────────────────────────────────────────┐
  │               CICLO DE DESARROLLO               │
  │                                                 │
  │  QA ──────────────────────────────────────────► │
  │  (Proceso: revisiones, estándares, CI/CD)       │
  │                                                 │
  │            QC ──────────── QC ──── QC ─────── ► │
  │         (Testing en    (Pruebas  (Regresión    │
  │          integración)   hito)    pre-release)  │
  └─────────────────────────────────────────────────┘
```

> **Reflexión:** Un ingeniero de sistemas no solo "testea" (QC), sino que diseña sistemas fáciles de testear y mantener (QA). Ambas habilidades son esenciales para el ejercicio profesional.

---

## 4. Caso de Estudio: FoodFast

### El Escenario

La startup **FoodFast** lanzó su app de delivery con gran éxito inicial. Sin embargo, durante la **Semana de Ofertas**, el sistema colapsó presentando 4 síntomas críticos:

|#|Síntoma|Descripción|
|---|---|---|
|1|🐢 **Lentitud extrema**|15 segundos de carga con más de 5,000 usuarios simultáneos|
|2|🔓 **Fuga de datos**|Usuarios podían ver las direcciones de otros usuarios|
|3|💳 **Error no detectado**|Un parche rompió el botón de "Pagar"|
|4|📱 **Incompatibilidad**|La app se cerraba en versiones antiguas de Android|

---

### Tarea A — Mapeo ISO/IEC 25010

Identificar qué características de calidad fueron vulneradas por cada síntoma:

|Síntoma|Característica ISO 25010 Afectada|Justificación Técnica|
|---|---|---|
|Lentitud extrema (15s)|**Eficiencia de Desempeño**|El sistema no escala bajo carga alta (_Time Behavior_)|
|Visualización de datos ajenos|**Seguridad**|Se viola la confidencialidad de datos del usuario|
|Fallo en el botón de pago|**Adecuación Funcional / Fiabilidad**|El software no es maduro; falló una función crítica|
|App cierra en Android viejo|**Compatibilidad / Portabilidad**|Falta de adaptabilidad a diferentes entornos de ejecución|

---

### Tarea B — Estrategia QA + QC

Propuesta de acciones para evitar futuros colapsos, diferenciando entre prevención y detección:

#### Acciones de QA — Prevención (Proceso)

✅ **Implementar pipeline de Integración Continua (CI)** con pruebas automáticas obligatorias antes de cualquier despliegue a producción

✅ **Establecer protocolo de Code Review** con foco en seguridad, especialmente para módulos que acceden a datos de usuarios

#### Acciones de QC — Detección (Producto)

🎯 **Pruebas de Estrés** simulando 10,000 usuarios concurrentes para medir tiempos de respuesta y detectar cuellos de botella

🎯 **Suite de Pruebas de Regresión** ejecutada automáticamente cada vez que se modifica código en flujos críticos (pago, autenticación, datos del usuario)

---

### Lección del caso

FoodFast tenía los cuatro problemas porque **no aplicó ninguna de las ocho características del ISO/IEC 25010 desde el diseño**, y porque **confundió "lanzar rápido" con "tener calidad"**. El costo de corregir estos errores en producción fue órdenes de magnitud mayor al costo de haberlos prevenido.

> La calidad no se agrega al final — se construye desde el primer día.

---

_Material docente — José Llanos & Luis Vargas_ _Ingeniería de Sistemas · Curso de Calidad de Software_ _CORHUILA © 2025_