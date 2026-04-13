# Guía Paso a Paso de Pruebas Unitarias

---

## Requisitos Funcionales - La Base de Todo

Antes de escribir una sola línea de código, hay que saber QUÉ debe hacer el software.

**Requisitos de la calculadora:**

- Sumar, restar, multiplicar, dividir
    
- La división debe devolver double (no perder decimales)
    
- No se puede dividir por cero → lanzar excepción
    

**Regla de oro:** Si no está en los requisitos, no se prueba. Si está en los requisitos, no se omite.

---

## Plan de Pruebas - Traducir Requisitos a Casos

Cada requisito se convierte en uno o más casos de prueba concretos.

**Casos que no pueden faltar:**

- Caso normal (el camino feliz)
    
- Casos borde: números negativos, cero
    
- Caso de error: división por cero

**Ejemplo:**  
Para el requisito "suma" necesitas:

- suma(5,3) → 8 (normal)
    
- suma(-5,-3) → -8 (negativos)
    
- suma(5,0) → 5 (borde con cero)

**Regla:** Un requisito sin casos de prueba = requisito no verificable.

---

## Configurar JUnit 5 con Maven

**Preparar el entorno para poder ejecutar pruebas automáticamente.

**Estructura que hay que recordar:**

```java
src/main/java/com/example/Calculadora.java   ← código
src/test/java/com/example/CalculadoraTest.java ← pruebas
```

**Dependencias necesarias en pom.xml:**

- junit-jupiter (para poder escribir @Test)
    
- maven-surefire-plugin (para ejecutar pruebas)
    
- jacoco-maven-plugin (para medir cobertura)

**Comandos básicos:**

Ejecutar todas las pruebas 

```java
mvn test 
```

Ejecutar pruebas + generar reporte de cobertura 

```java
mvn clean test jacoco:report 
```

Ejecutar una clase específica de pruebas 

```java
mvn test -Dtest=CalculadoraTest 
```

Ejecutar un método específico 

```java
mvn test -Dtest=CalculadoraTest#testSumarDosNumerosPositivos
```

---

## Implementar la Clase

Escribir el código mínimo que cumple los requisitos.

**La implementación de dividir es la más interesante:**

```java
public double dividir(int a, int b) {
    if (b == 0) {
        throw new IllegalArgumentException("El divisor no puede ser cero");
    }
    return (double) a / b;
}
```

**Detalles importantes:**

- Cast a double para que la división no trunque
    
- Excepción con mensaje claro
    
- Nada más, nada menos

---

## Escribir Pruebas Unitarias

Cada prueba valida un comportamiento específico.

**Patrón AAA (memorizar):**

- **Arrange** → preparar datos (ej: a=5, b=3)
    
- **Act** → ejecutar método (calc.sumar(a,b))
    
- **Assert** → verificar resultado (assertEquals)

**Anotaciones clave:**

- `@Test` → marca un método como prueba
    
- `assertEquals(valorEsperado, valorReal)`
    
- `assertThrows(Excepcion.class, () -> metodo())`

**Buenas prácticas en nombres:**

- `testSumarNumerosNegativos` (dice QUÉ prueba)
    
- No `testSuma1` (no dice nada)

---

## Evaluación y Cobertura

Las pruebas no sirven si no sabemos qué tan bien cubren el código.

**Métricas que importan:**

- **Line Coverage:** % de líneas ejecutadas
    
- **Branch Coverage:** % de ramas (if/else) ejecutadas

**JaCoCo genera un HTML** en `target/site/jacoco/index.html` - hay que revisarlo.

**Resultado ideal:**

- 100% line coverage
    
- 100% branch coverage (importante para el if de división por cero)

**Checklist de calidad:**

- Pruebas rápidas (< 100ms)
    
- Independientes (orden no importa)
    
- Nombres descriptivos
    
- Casos borde cubiertos
    
- Excepciones probadas

---

## Resumen del Ciclo TDD

```text
Requisitos → Plan de Pruebas → Configuración → Código → Pruebas → Evaluación
     ↑                                                              ↓
     └────────────────── (repetir hasta que todo pase) ────────────┘
```

**Fórmula mental:** 1 requisito = 1+ casos de prueba = 1+ métodos @Test