# Apache JMeter

---

### 🔹 ¿Qué es Apache JMeter?

Es una herramienta **open source** para realizar **pruebas de carga y rendimiento** en aplicaciones (principalmente web). Permite simular múltiples usuarios concurrentes para evaluar el comportamiento del sistema bajo estrés.

---

## ⚙️ Características principales

### Funcionalidades:

- Soporte para **HTTP/HTTPS, FTP, JDBC, SOAP**
- Simulación de usuarios concurrentes
- Pruebas distribuidas
- Uso de plugins

### Análisis:

- Gráficos en tiempo real
- Métricas clave:
    - Response Time
    - Throughput
    - Error Rate
    - Percentiles (90, 95)

### Ventajas:

- Gratis y de código abierto
- Multiplataforma
- Escalable (miles de usuarios)
- Interfaz gráfica + CLI

---

## 🧩 Componentes de JMeter

1. **Test Plan**  
    Contenedor principal (configuración general, variables, cookies, etc.)
2. **Thread Group**  
    Define:
    - Número de usuarios (hilos)
    - Ramp-up (tiempo de inicio)
    - Duración
    - Repeticiones
3. **HTTP Request (Sampler)**  
    Define peticiones:
    - Método (GET, POST…)
    - URL, puerto, parámetros
4. **Listeners (Receptores)**  
    Visualizan resultados:
    - View Results Tree
    - Aggregate Report
    - Graph Results
    - Summary Report

---

## 📊 Métricas importantes

- **Response Time**: tiempo de respuesta (menor es mejor)
- **Throughput**: solicitudes por segundo (mayor es mejor)
- **Error Rate**: porcentaje de fallos (menor es mejor)
- **Percentiles (90/95)**: experiencia real de usuarios

---

## 🛠️ Instalación

### Requisitos:

- Java JDK 8+
- JAVA_HOME configurado
- ~2 GB RAM

### Pasos:

1. Verificar Java (`java -version`)
2. Descargar JMeter
3. Descomprimir y ejecutar (`jmeter.bat` o `jmeter.sh`)
4. (Opcional) Configurar PATH

---

## 🧪 Aplicación de prueba

Se usa una API REST en **Spring Boot** con endpoints como:

- `/health`
- `/items`
- `/items/{id}`
- `/items/report` (lento, ideal para pruebas)

Permite simular escenarios reales de carga.

---

## 🚀 Ejemplo práctico

### Configuración:

- 100 usuarios
- Ramp-up: 10 segundos
- Duración: 5 minutos
- Loop: 5

### Pasos:

1. Crear Thread Group
2. Añadir HTTP Request
3. Agregar Listeners
4. Ejecutar (GUI o CLI)

### CLI:

```
jmeter -n -t test.jmx -l resultados.jtl -e -o reporte/
```

---

## 📈 Análisis de resultados

Evaluar:

- Tiempo promedio aceptable
- Percentil 95 bajo
- Error Rate ≈ 0%
- Throughput adecuado

---

## 💻 Procesamiento con Java

Se puede leer el archivo `.jtl` y calcular:

- Tiempo mínimo, máximo, promedio
- Percentiles (90, 95)
- Tasa de error

---

## ✅ Mejores prácticas

### Planificación:

- Definir objetivos
- Identificar escenarios críticos
- Establecer KPIs

### Entorno:

- No usar misma máquina (JMeter + app)
- Limpiar caché
- Aislar base de datos

### Diseño:

- Modularidad
- Uso de variables
- Documentación

### Optimización:

- Desactivar listeners en CLI
- Pruebas distribuidas
- Ajustar memoria JVM (`-Xmx4g`)

---

## 📊 Reportes

Generar HTML:

```
jmeter -g resultados.jtl -o reporte/
```

---

## 🔄 CI/CD

Integrar JMeter en pipelines para automatizar pruebas y validar rendimiento continuamente.

---

## 🎯 Conclusión

Con JMeter puedes:

- Simular carga real
- Detectar cuellos de botella
- Medir rendimiento con métricas clave
- Automatizar pruebas

Es una herramienta esencial para garantizar la **calidad y escalabilidad de aplicaciones**.