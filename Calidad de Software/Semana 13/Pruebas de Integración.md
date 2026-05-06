# Pruebas de Integración

---

## 🔹 ¿Qué son las Pruebas de Integración?

Son pruebas que verifican que **varios componentes del sistema funcionan correctamente juntos**.  
A diferencia de las pruebas unitarias (que prueban partes aisladas), aquí se validan **interacciones reales**:

- Servicios
- Bases de datos
- APIs
- Módulos del sistema

👉 Objetivo: asegurar que el flujo completo funciona correctamente.

---

## ⚙️ Características principales

### Alcance:

- Múltiples componentes
- Flujos completos
- Uso de BD real o de prueba
- Integración con servicios externos

### Tiempo de ejecución:

- Más lentas que las unitarias
- Pueden tardar segundos o minutos
- Requieren más recursos

### Visibilidad:

- Detectan errores reales
- Problemas entre módulos
- Fallos en datos compartidos

---

## 🔺 Pirámide de Pruebas

- Muchas **unitarias** (rápidas)
- Algunas **de integración** (equilibrio)
- Pocas **E2E** (lentas y costosas)

👉 Es la distribución ideal en proyectos profesionales.

---

## ⚖️ Unitarias vs Integración

|Aspecto|Unitarias|Integración|
|---|---|---|
|Alcance|Clase/método|Sistema combinado|
|Dependencias|Simuladas (mocks)|Reales|
|Base de datos|Mock o memoria|Real o de prueba|
|Velocidad|Muy rápida|Más lenta|
|Objetivo|Funciona el código|Funcionan juntos|

👉 Ejemplo:

- Unitaria: calcular descuento
- Integración: flujo completo de compra

---

## 🧩 Estrategias de Integración

### ❌ Big Bang

- Todo junto
- Difícil detectar errores

### 🔽 Top-Down

- Desde capas altas hacia abajo
- Usa stubs
- Detecta errores de interfaz

### 🔼 Bottom-Up

- Desde base (BD) hacia arriba
- Usa drivers
- Ideal para arquitectura por capas

### 🔄 CI/CD (Mejor práctica)

- Se ejecutan automáticamente en cada commit

---

## 🛠️ Configuración del entorno

### Herramientas principales:

- **JUnit 5** → framework de pruebas
- **Spring Boot Test** → integración con Spring
- **Testcontainers** → BD en Docker
- **Rest Assured** → pruebas de APIs

### Dependencias clave:

- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa` (OBLIGATORIO)
- `spring-boot-starter-test`
- `H2 database`

👉 H2 se usa como base de datos en memoria para pruebas rápidas.

---

## 🧪 Ejemplo práctico: Sistema de Pedidos

### 📁 Arquitectura:

- **Modelos**:
    - `Producto`
    - `Pedido`
- **Servicios**:
    - `PedidoService`
    - `InventarioService`
- **Repositorios**:
    - `ProductoRepository`
    - `PedidoRepository`

---

## 🔄 Flujo del sistema

Cuando se crea un pedido:

1. Validar stock
2. Obtener precio
3. Crear pedido
4. Guardar en BD
5. Actualizar inventario

👉 Aquí es donde la prueba de integración es clave.

---

## 🧪 Pruebas de Integración (casos)

### ✅ Caso 1: Crear pedido correctamente

Valida que:

- Se crea el pedido
- El estado sea "CREADO"
- El total sea correcto
- El stock se reduzca

### ❌ Caso 2: Pedido sin stock

Valida que:

- Lance excepción
- No permita el pedido

---

## ▶️ Ejecución de pruebas

### Desde IntelliJ:

- Run Test

### Desde Maven:

```
mvn test -Dtest=PedidoIntegrationTest
```

### Resultado esperado:

- Tests: 2
- Fallos: 0
- Estado: SUCCESS

---

## 🐞 Problemas comunes

### ❌ Repository no encontrado

➡️ Revisar paquetes

### ❌ H2 no funciona

➡️ Verificar dependencia

### ❌ Producto no encontrado

➡️ Revisar persistencia en BD

### ❌ Spring no inicia

➡️ Falta clase con `@SpringBootApplication`

---

## 📊 Validación de resultados

Se comprueba:

- Flujo completo correcto
- Persistencia en BD
- Cambios en inventario
- Manejo de errores

---

## ✅ Mejores prácticas

### ✔️ Hacer:

- Usar datos realistas
- Aislar pruebas (`@Transactional`)
- Probar flujos completos
- Automatizar en CI/CD
- Usar pocos mocks

### ❌ Evitar:

- Pruebas lentas (>5 min)
- Dependencia entre pruebas
- Usar BD de producción
- Ignorar errores
- Tests demasiado complejos

---

## 🧱 Estructura ideal de pruebas

Patrón AAA:

- **Arrange** → Preparar datos
- **Act** → Ejecutar acción
- **Assert** → Verificar resultados

---

## ⚙️ Configuración recomendada

- BD: H2 en memoria
- Transacciones: rollback automático
- Contexto: `@SpringBootTest`
- Datos: fixtures o builders

---

## 🎯 Conclusión

Las pruebas de integración:

- Detectan errores reales entre componentes
- Validan flujos completos
- Son clave en sistemas reales
- Complementan las pruebas unitarias

👉 Son la **garantía de que el sistema funciona en conjunto**, no solo por partes.