# Métricas de Calidad de Software

> _"Lo que se mide se puede mejorar. Lo que se mejora genera valor real."_

Las métricas de calidad no son simples números — son la brújula que guía la excelencia en ingeniería de software. Aprender a medirlas, interpretarlas y actuar sobre ellas es una habilidad esencial para cualquier ingeniero moderno.

Este documento cubre las **tres métricas fundamentales** de calidad en la industria:

---

## Tabla de Contenidos

1. [Defect Density](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#1-defect-density)
2. [Cobertura de Código](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#2-cobertura-de-c%C3%B3digo-code-coverage)
3. [MTTR — Mean Time To Recover](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#3-mttr--mean-time-to-recover)
4. [Cómo Interpretar las Métricas](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#4-c%C3%B3mo-interpretar-las-m%C3%A9tricas)
5. [Mejores Prácticas](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#5-mejores-pr%C3%A1cticas)
6. [Herramientas del Ecosistema](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#6-herramientas-del-ecosistema)
7. [Conclusión](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#7-conclusi%C3%B3n)

---

## 1. Defect Density

### ¿Qué es?

La **Defect Density (DD)** mide la cantidad de defectos encontrados por cada **1,000 líneas de código** (KLOC) o por cada unidad funcional. Es uno de los indicadores más directos de la confiabilidad del código.

### Fórmula

```
DD = (Número de Defectos / KLOC) × 1000
```

**Ejemplo práctico:**

> Un módulo de **10,000 líneas** con **35 defectos** tiene: `DD = (35 / 10,000) × 1000 = 3.5 defectos/KLOC` → rango **aceptable**.

### Rangos de Referencia

|Rango|Clasificación|
|---|---|
|0 – 2 defectos/KLOC|✅ Excelente|
|2 – 5 defectos/KLOC|⚠️ Aceptable|
|> 5 defectos/KLOC|❌ Crítico|

### ¿Por qué importa?

- Mide la **confiabilidad** del código de forma objetiva
- Permite **comparar versiones** de un mismo proyecto a lo largo del tiempo
- Facilita el **benchmarking** entre equipos o módulos
- Sirve de base para **estimaciones de riesgo** en entregas

---

## 2. Cobertura de Código (Code Coverage)

### ¿Qué es?

La **Cobertura de Código** mide el porcentaje del código fuente que es **ejecutado por los tests automatizados**. Cuanto mayor es la cobertura, mayor es la confianza de que el software se comportará correctamente.

### Fórmula

```
CC = (Líneas de código ejecutadas / Total de líneas) × 100%
```

### Tipos de Cobertura

|Tipo|Descripción|
|---|---|
|**Line Coverage**|% de líneas individuales ejecutadas|
|**Branch Coverage**|% de bifurcaciones (`if`/`else`) cubiertas|
|**Path Coverage**|% de caminos posibles dentro del flujo|

### Rangos de Referencia

|Rango|Clasificación|
|---|---|
|> 80%|✅ Excelente|
|60% – 80%|⚠️ Aceptable|
|< 60%|❌ Crítico|

### ¿Por qué importa?

- **Previene defectos** en el diseño antes de llegar a producción
- **Mejora la confianza** al hacer refactoring
- **Reduce regresiones** al introducir nuevas funcionalidades
- Facilita el **mantenimiento a largo plazo** del sistema

### ¿Por qué NO apuntar al 100%?

Una cobertura del 100% puede parecer el objetivo ideal, pero en la práctica:

- El esfuerzo del **último 15–20%** crece exponencialmente
- Código trivial como _getters/setters_ requiere menos pruebas
- Es **imposible** en sistemas reales con dependencias externas
- Es preferible un **85% con tests significativos** que un 100% con tests triviales

> **Meta recomendada: 75–85% de cobertura**, con incrementos graduales del 5–10% por trimestre.

---

## 3. MTTR — Mean Time To Recover

### ¿Qué es?

El **MTTR** mide el **tiempo promedio** que tarda un sistema en recuperarse de un fallo o incidente en producción. Es el indicador central de la disponibilidad operacional de un sistema.

### Fórmula

```
MTTR = (Suma de tiempos de recuperación) / (Número de incidentes)
```

### Rangos de Referencia

|Rango|Clasificación|
|---|---|
|< 15 minutos|✅ Excelente|
|15 – 60 minutos|⚠️ Aceptable|
|> 60 minutos|❌ Crítico|

### ¿Por qué importa?

- Mide directamente la **disponibilidad** del sistema
- Tiene **impacto directo en el negocio** (cada minuto caído tiene costo)
- Evalúa la **efectividad del monitoreo** y los procesos de respuesta
- Guía la **estrategia de DevOps y SRE** del equipo

### Factores que reducen el MTTR

|Factor|Impacto|
|---|---|
|Monitoreo en tiempo real|Detecta problemas en 2–5 min|
|Alertas inteligentes|Minimiza tiempo de detección|
|Runbooks y procedimientos|Acelera diagnóstico y solución|
|Automatización de rollback|Recuperación en minutos vs. horas|
|Equipo capacitado 24/7|Respuesta rápida a cualquier hora|
|Infrastructure as Code|Reconstrucción rápida de sistemas|

---

## 4. Cómo Interpretar las Métricas

### Defect Density alta → señales de alerta

Un DD elevado generalmente indica uno o más de estos problemas:

- Código **complejo** sin suficientes pruebas unitarias
- Falta de **code reviews** efectivos
- **Presión de tiempo** que sacrifica la calidad
- Necesidad de **refactoring** o deuda técnica acumulada
- Falta de **capacitación** en el equipo

### Cobertura baja vs. alta

**Cobertura alta (> 80%)** indica que la mayoría del código está siendo probado:

- Menor riesgo de bugs en producción
- Mayor seguridad al refactorizar
- Mejor documentación implícita del comportamiento esperado

**Cobertura baja (< 60%)** indica que mucho código NO está siendo probado:

- Alto riesgo de defectos ocultos
- Peligro real al introducir cambios
- Deuda técnica acumulada que crece con el tiempo

### MTTR bajo → equipo operacionalmente maduro

Un MTTR bajo no ocurre por accidente. Refleja que el equipo ha invertido en:

- Procesos de **detección temprana**
- **Automatización** de respuesta y rollback
- Cultura de **preparación ante fallos**

---

## 5. Mejores Prácticas

### Para reducir Defect Density

**1. Testing Exhaustivo**

- Pruebas unitarias con metodología TDD (Test-Driven Development)
- Testing de integración entre componentes
- Pruebas de aceptación automatizadas (BDD/E2E)

**2. Code Reviews sistemáticos**

- Pull Requests con revisor asignado obligatorio
- Ciclos de feedback rápidos (< 24 horas)
- Checklist de calidad como parte del proceso

**3. Análisis Estático de Código**

- Integrar **SonarQube** en el pipeline de CI/CD
- Linters automáticos por lenguaje
- Verificación de vulnerabilidades de seguridad

---

### Para mejorar Code Coverage

**Incremento gradual y sostenible:**

```
1. Establecer línea base actual
2. Aumentar 5–10% por trimestre
3. Automatizar reporte en CI/CD
4. Bloquear Pull Requests por debajo del umbral definido
```

**Herramientas por lenguaje:**

|Lenguaje|Herramientas|
|---|---|
|Java / Kotlin|JaCoCo, Cobertura|
|Python|pytest-cov, Coverage.py|
|JavaScript|Istanbul, NYC|
|C# / .NET|OpenCover, Coverlet|

---

### Para reducir MTTR

El proceso de recuperación se divide en cuatro fases clave:

|Fase|Acción|Impacto|
|---|---|---|
|**Detection**|Monitoreo 24/7 con dashboards en tiempo real|Reduce inicio a 2–5 minutos|
|**Diagnosis**|Logs centralizados + trazado distribuido (Datadog)|Reduce análisis en 70%|
|**Resolution**|Rollbacks automatizados + runbooks ejecutables|Recuperación en minutos|
|**Validation**|Chequeos automáticos post-solución|Confirmación en segundos|

---

## 6. Herramientas del Ecosistema

### SonarQube — Análisis de Código

La herramienta estándar de la industria para calidad de código:

- Mide **defect density** automáticamente
- Calcula y reporta **code coverage**
- Detecta **security hotspots**
- Integración nativa con Jenkins, GitLab CI, GitHub Actions

### Datadog / New Relic — Monitoreo APM

Plataformas de Application Performance Monitoring orientadas al MTTR:

- Monitoreo en **tiempo real**
- **Alertas inteligentes** con umbrales configurables
- Análisis forense de incidentes
- Integración con PagerDuty para on-call

### JaCoCo / Coverlet — Cobertura por Lenguaje

Herramientas especializadas para reportes de coverage:

- JaCoCo para **Java / Kotlin**
- Coverlet para **.NET / C#**
- Generan reportes HTML detallados
- Integración directa con SonarQube

### GitHub / GitLab Actions — CI/CD

Automatización de calidad en el pipeline de entrega:

- Análisis automático por cada commit
- Reportes de métricas en cada Pull Request
- **Bloqueo de merge** si DD supera el umbral
- Quality gates configurables por proyecto

---

## 7. Conclusión

Las tres métricas fundamentales representan pilares distintos pero complementarios de la calidad:

|Métrica|Meta|Requiere|
|---|---|---|
|**Defect Density**|< 3 defectos/KLOC|Testing riguroso, code reviews, análisis estático|
|**Code Coverage**|75–85%|Tests automáticos, CI/CD, disciplina de equipo|
|**MTTR**|< 15 minutos|Monitoreo, automatización, runbooks, equipo preparado|

Estas métricas no son fines en sí mismos — son **señales de comportamiento del equipo**. Un equipo que las mide y actúa sobre ellas sistematicamente construye software más confiable, más mantenible y más valioso.

> _"Una métrica sin acción es solo un número. Una métrica con acción es el inicio del cambio."_

El camino hacia la excelencia en calidad es incremental. Cada mejora, por pequeña que sea, reduce el riesgo, aumenta la confianza y eleva el estándar profesional del equipo. **Empieza hoy.**

---

_Material docente — José Llanos & Luis Vargas_ _Ingeniería de Sistemas · Curso de Calidad de Software_ _CORHUILA © 2026 — Semana 4: Métricas de Calidad de Software_