# Estándares de Calidad de Software

> _"La calidad no es un accidente; es el resultado de una intención inteligente, un esfuerzo sincero y una ejecución hábil."_

En la ingeniería de software moderna, los estándares internacionales proporcionan el marco necesario para garantizar que los productos sean **seguros, fiables y eficientes**. Este documento explora los tres pilares que todo ingeniero debe dominar:

|Estándar|Enfoque|
|---|---|
|**ISO 9001**|Gestión general de la calidad|
|**CMMI**|Madurez de los procesos de desarrollo|
|**ISO/IEC 29119**|Normativa específica para pruebas de software|

---

## Tabla de Contenidos

1. [ISO 9001 — Gestión de la Calidad](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#1-iso-9001--gesti%C3%B3n-de-la-calidad)
2. [CMMI — Madurez de Procesos](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#2-cmmi--capability-maturity-model-integration)
3. [ISO/IEC 29119 — Pruebas de Software](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#3-isoiec-29119--pruebas-de-software)
4. [Comparativa de los Tres Estándares](https://claude.ai/chat/17b5c300-589f-4f10-a5f6-0af0d313eece#4-comparativa-de-los-tres-est%C3%A1ndares)

---

## 1. ISO 9001 — Gestión de la Calidad

### ¿Qué es?

La **ISO 9001** es el estándar internacional más reconocido para los **Sistemas de Gestión de la Calidad (SGC)**. Aunque es genérica y aplicable a cualquier industria, en el desarrollo de software establece las bases para la satisfacción del cliente y la mejora continua de los procesos.

### El Ciclo PHVA — El corazón de la ISO 9001

El núcleo operativo de la norma es el **Ciclo de Deming (PHVA)**, un enfoque iterativo que permite a las organizaciones ajustar sus procesos de manera continua:

```
        ┌─────────────────────────────────────────┐
        │                                         │
   ┌────▼────┐                           ┌────────┴────┐
   │PLANIFICAR│                           │    ACTUAR   │
   │         │                           │             │
   │Definir  │                           │Corregir y   │
   │objetivos│                           │mejorar el   │
   │y procesos│                          │proceso      │
   └────┬────┘                           └────────▲────┘
        │                                         │
        │         Ciclo de Mejora                 │
        │           Continua                      │
   ┌────▼────┐                           ┌────────┴────┐
   │  HACER  │                           │  VERIFICAR  │
   │         │                           │             │
   │Ejecutar │                           │Medir y      │
   │lo       │───────────────────────────►comparar     │
   │planificado                          │resultados   │
   └─────────┘                           └─────────────┘
```

|Fase|Acción principal|
|---|---|
|**Planificar**|Definir objetivos, riesgos y procesos necesarios|
|**Hacer**|Ejecutar lo planificado|
|**Verificar**|Medir resultados y compararlos con lo esperado|
|**Actuar**|Corregir desviaciones y aplicar mejoras|

### Principios Clave

**Enfoque al cliente** Comprender las necesidades actuales y futuras del cliente es el punto de partida. La satisfacción del cliente es el criterio de éxito más importante.

**Liderazgo** La dirección debe crear un ambiente donde el personal esté involucrado y comprometido con los objetivos de calidad.

**Enfoque basado en procesos** Gestionar las actividades como procesos interrelacionados produce resultados más coherentes y predecibles.

**Mejora continua** La mejora del desempeño global de la organización debe ser un objetivo permanente, no un evento ocasional.

---

## 2. CMMI — Capability Maturity Model Integration

### ¿Qué es?

El **CMMI** es un modelo de mejora de procesos que ayuda a las organizaciones a optimizar su desarrollo de software y mantenimiento. A diferencia de la ISO 9001 — que _certifica_ un sistema de calidad — el CMMI _evalúa el nivel de madurez_ de la ingeniería de la organización.

### Los 5 Niveles de Madurez

Una organización en un nivel alto tiene procesos **predecibles y optimizados**. Una de nivel bajo opera de forma **reactiva**, "apagando incendios" constantemente.

```
        ▲
Nivel 5 │  ██████████████████████████  EN OPTIMIZACIÓN
        │         Mejora continua cuantitativa
Nivel 4 │  ████████████████████████    GESTIONADO CUANTITATIVAMENTE
        │         Control estadístico de subprocesos
Nivel 3 │  ██████████████████████      DEFINIDO
        │         Estándares a nivel organizacional
Nivel 2 │  ████████████████████        GESTIONADO
        │         Planificación y medición de proyectos
Nivel 1 │  ██████████████████          INICIAL
        │         Caótico y dependiente del heroísmo individual
        └─────────────────────────────────────────────────────►
                              Madurez
```

|Nivel|Nombre|Descripción|
|---|---|---|
|**Nivel 1**|Inicial|Procesos impredecibles, poco controlados y reactivos. El éxito depende del heroísmo individual.|
|**Nivel 2**|Gestionado|Se gestionan requisitos, procesos y productos. Los proyectos se planifican y se miden.|
|**Nivel 3**|Definido|Los procesos están bien caracterizados y entendidos. Existen estándares a nivel de organización.|
|**Nivel 4**|Gestionado Cuantitativamente|Se controlan subprocesos usando técnicas estadísticas y cuantitativas.|
|**Nivel 5**|En Optimización|Mejora continua basada en comprensión cuantitativa de las causas de variación.|

### ¿Cómo progresa una organización?

El avance entre niveles no es automático — requiere inversión deliberada en procesos, cultura y herramientas. Cada nivel construye sobre el anterior:

- Sin **Nivel 2** (procesos gestionados), no es posible estandarizar (Nivel 3)
- Sin **Nivel 3** (estándares claros), no hay qué medir estadísticamente (Nivel 4)
- Sin **Nivel 4** (control cuantitativo), la optimización no tiene base sólida (Nivel 5)

> La mayoría de las organizaciones de software del mundo operan entre los **Niveles 1 y 2**. Alcanzar el Nivel 3 ya representa una ventaja competitiva significativa.

---

## 3. ISO/IEC 29119 — Pruebas de Software

### ¿Qué es?

La **ISO/IEC 29119** es la norma internacional definitiva para las **pruebas de software**. Reemplazó a estándares anteriores como la IEEE 829 con el objetivo de unificar vocabulario, procesos, documentación y técnicas de prueba en un único marco coherente.

Esta norma no solo define _cómo probar_, sino cómo **gestionar las pruebas** a nivel organizacional, de proyecto y de ejecución dinámica.

### Las 4 Partes Principales

```
ISO/IEC 29119
│
├── Parte 1 — Conceptos y Definiciones
│         Vocabulario común y fundamentos teóricos
│
├── Parte 2 — Procesos de Prueba
│         Cómo organizar y ejecutar el proceso de pruebas
│
├── Parte 3 — Documentación de Prueba
│         Plantillas para Plan de Pruebas, Casos, Reportes
│
└── Parte 4 — Técnicas de Prueba
          Métodos específicos: caja negra, caja blanca, etc.
```

|Parte|Contenido|Utilidad práctica|
|---|---|---|
|**Parte 1**|Conceptos y definiciones|Lenguaje común entre equipos|
|**Parte 2**|Procesos de prueba|Marco de trabajo para gestionar pruebas|
|**Parte 3**|Documentación|Artefactos estandarizados|
|**Parte 4**|Técnicas de prueba|Métodos de diseño de casos de prueba|

### Ventajas de Implementación

**Estandarización de documentos** Todos los artefactos clave tienen formato definido: Plan de Pruebas, Casos de Prueba, Reportes de Ejecución y Reportes de Defectos.

**Cobertura completa del ciclo de vida** Desde pruebas unitarias hasta pruebas de aceptación del usuario, la norma cubre cada fase del desarrollo.

**Flexibilidad metodológica** Se adapta tanto a metodologías **ágiles** (Scrum, Kanban) como a enfoques **tradicionales** (cascada, V-Model), sin imponer una sobre la otra.

---

## 4. Comparativa de los Tres Estándares

|Característica|ISO 9001|CMMI|ISO/IEC 29119|
|---|---|---|---|
|**Alcance**|General (toda industria)|Desarrollo de software|Pruebas de software|
|**Tipo**|Certificación|Modelo de madurez|Norma técnica|
|**Enfoque**|Sistema de gestión|Procesos de ingeniería|Procesos de prueba|
|**Resultado**|Certificado ISO|Nivel de madurez (1–5)|Marco de pruebas|
|**Compatibilidad**|Compatible con CMMI e ISO 29119|Complementa ISO 9001|Aplica dentro de CMMI|

### ¿Cómo se relacionan?

Los tres estándares no son excluyentes — son **complementarios**:

- La **ISO 9001** establece la cultura y el sistema de gestión de calidad de la organización
- El **CMMI** evalúa y guía la madurez de los procesos de ingeniería dentro de esa cultura
- La **ISO/IEC 29119** operacionaliza la calidad en el área específica de las pruebas

> Una organización madura implementa los tres de manera integrada: la ISO 9001 como marco general, CMMI como guía de evolución, y la ISO 29119 como estándar técnico de pruebas.

---

_Material educativo — Ingeniería de Sistemas_ _Corporación Universitaria del Huila — CORHUILA_ _© 2026 · Calidad de Software_