# ¿Qué es y por qué es importante la analítica de datos?

La analítica de datos consiste en analizar información para apoyar la toma de decisiones, permitiendo comprender el pasado, optimizar el presente y anticipar el futuro, además de identificar oportunidades, mejorar la eficiencia y lograr ventajas competitivas.

---

## Tipos de Analítica de Datos

- **Analítica descriptiva**: Analiza datos históricos para resumir qué ocurrió, usando estadísticas, reportes y visualizaciones.
- **Analítica diagnóstica**: Profundiza en los datos para entender por qué ocurrió un evento, identificando causas, relaciones y anomalías.
- **Analítica exploratoria**: Examina los datos sin hipótesis previa con el fin de descubrir patrones, tendencias o comportamientos inesperados.
- **Analítica predictiva**: Utiliza modelos estadísticos y de machine learning para predecir qué podría ocurrir en el futuro.
- **Analítica prescriptiva**: Va un paso más allá de la predicción y recomienda acciones óptimas para alcanzar un objetivo o tomar mejores decisiones.
- **Analítica causal**: Analiza relaciones de causa–efecto entre variables para determinar qué factores influyen directamente en un resultado.

---

## ¿Qué es Minería de Datos?

La minería de datos es el proceso de analizar grandes volúmenes de información para descubrir patrones, tendencias y relaciones ocultas. Utiliza técnicas estadísticas, matemáticas e inteligencia artificial para extraer conocimiento útil, transformando datos en bruto en información accionable que apoya la toma de decisiones estratégicas.

---

## ¿Qué es Inteligencia Artificial?

La inteligencia artificial (IA) es la capacidad de las máquinas para imitar la inteligencia humana, permitiéndoles aprender, razonar, resolver problemas y tomar decisiones. Gracias a la IA, los sistemas pueden realizar tareas como reconocimiento de voz, visión por computadora y traducción de idiomas, que normalmente requieren habilidades humanas.

---

## ¿Qué es Machine Learning?

El Machine Learning es una rama de la inteligencia artificial que permite a las máquinas aprender a partir de los datos sin ser programadas explícitamente. Mediante algoritmos, identifica patrones y mejora su desempeño con la experiencia, siendo aplicado en sistemas de recomendación, detección de spam, reconocimiento facial y vehículos autónomos.

---

## Diferencias entre Minería de Datos y Machine Learning

La Minería de Datos consiste en analizar datos que ya existen para encontrar patrones o información importante. Su objetivo principal es entender los datos y sacar conclusiones.

El Machine Learning se enfoca en enseñar a una máquina a aprender con los datos, para que pueda hacer predicciones o tomar decisiones automáticamente y mejorar con el tiempo.

**Ejemplo:**  
Una tienda analiza sus ventas pasadas y descubre que los fines de semana se vende más cierto producto (minería de datos).  
Luego, usa esos datos para crear un sistema que prediga qué productos se venderán más la próxima semana y ajuste el inventario automáticamente (machine learning).

---

## Big Data

El Big Data hace referencia al manejo y análisis de grandes volúmenes de datos que se generan de forma continua y en distintos formatos, los cuales no pueden ser procesados eficientemente con herramientas tradicionales. Su objetivo es extraer información útil que apoye la toma de decisiones y genere valor para las organizaciones.

Se describe mediante las 5 V’s:

- **Volumen**: Enorme cantidad de datos generados por sistemas, usuarios, sensores y aplicaciones.
- **Velocidad**: Los datos se producen y deben procesarse en tiempo real o casi real.
- **Variedad**: Los datos pueden ser estructurados, semiestructurados o no estructurados (texto, imágenes, videos, etc.).
- **Veracidad**: Importancia de que los datos sean confiables y de buena calidad.
- **Valor**: Capacidad de transformar los datos en información útil para el negocio y la toma de decisiones.

---

## Fuentes de datos

- **Data Warehouse 🏢**  
    Es una bodega central de datos organizados y limpios, lista para hacer consultas y análisis.  
    **Ejemplo:** Una empresa guarda todas sus ventas, clientes y facturas históricas para generar reportes mensuales.
    
- **Data Lake 🌊**  
    Es un gran lago donde se guardan todos los datos tal como llegan, sin ordenarlos previamente (texto, imágenes, videos, registros).  
    **Ejemplo:** Una red social almacena publicaciones, fotos, videos y comentarios sin procesar.
    
- **Lakehouse 🏡**  
    Combina la flexibilidad del Data Lake con la organización y análisis del Data Warehouse.  
    **Ejemplo:** Una empresa guarda datos crudos de sensores y luego los analiza directamente para hacer predicciones.
    
- **Data Mart 🏪**  
    Es una parte pequeña del Data Warehouse, enfocada en un área específica del negocio.  
    **Ejemplo:** El área de ventas usa solo los datos de clientes y ventas para analizar su desempeño.

### 1. Fuentes de Datos
Origen de la información generada por los sistemas y usuarios.

- Logs del sistema
- Archivos
- Sensores IoT
- Aplicaciones empresariales

### 2. Data Lake
Repositorio central donde se almacenan **todos los datos en su formato original**.

**Características:**
- Datos estructurados, semiestructurados y no estructurados
- Alta escalabilidad
- Ideal para Big Data, IA y Machine Learning

**Ejemplo:**  
Registros de sensores, imágenes, videos y archivos sin procesar.

### 3. Data Warehouse
Sistema que almacena **datos limpios, estructurados y procesados** para análisis.

**Características:**
- Datos históricos
- Optimizado para consultas
- Soporta reportes y dashboards

**Ejemplo:**  
Historial de ventas consolidadas de toda la empresa.

### 4. Data Mart
Subconjunto del Data Warehouse enfocado en un **área específica del negocio**.

**Características:**
- Datos específicos y listos para usar
- Acceso rápido para equipos departamentales

**Ejemplo:**  
Data Mart de ventas con métricas comerciales.

### 5. Flujo de Datos
Movimiento de la información a través de la arquitectura.

---

## Diferencias entre ETL, ELT y ETL Reverse

- **ETL (Extraer → Transformar → Cargar)**  
    Primero se sacan los datos, se limpian y transforman, y al final se guardan en el destino.  
    Se usa cuando los datos deben llegar ya organizados.  
    **Ejemplo:** Limpiar datos de ventas antes de guardarlos en un Data Warehouse.
    
- **ELT (Extraer → Cargar → Transformar)**  
    Primero se cargan los datos tal como vienen, y luego se transforman dentro del sistema destino.  
    Es común en Big Data y la nube, porque soportan mucho procesamiento.  
    **Ejemplo:** Subir datos crudos a un Data Lake y transformarlos después para análisis.
    
- **ETL Reverse**  
    Toma datos ya procesados del Data Warehouse y los envía de vuelta a sistemas operativos.  
    Sirve para compartir información útil con otras aplicaciones.  
    **Ejemplo:** Enviar datos de clientes segmentados a un CRM para campañas de marketing.
