# Fundamentos y Técnicas de Testing

---

Domina el arte del testing en software. Aprende a estructurar estrategias efectivas de pruebas, entiende los cuatro niveles fundamentales (unitarias, integración, sistema, aceptación) y descubre los tipos de pruebas que garantizan la calidad total de tu aplicación.

> **El testing no es solo encontrar errores, es construir confianza en el software.**

---

## 1. Fundamentos del Testing en Software

El testing es la práctica sistemática de ejecutar un programa o componente con la intención de encontrar defectos y verificar que funcione según sus especificaciones.  
Es uno de los pilares fundamentales de la ingeniería de software moderna.

### Principio fundamental del Testing

> **"No podemos probar la ausencia de errores, solo su presencia. Pero podemos maximizar la confianza mediante una estrategia bien planificada de pruebas."**

### ¿Por Qué es Importante el Testing?

#### Detecta Defectos Temprano
Un defecto encontrado en desarrollo cuesta 10x menos que en producción.

- Menor costo de corrección  
- Impacto limitado a desarrollo  
- Recuperación rápida  

#### Garantiza Funcionalidad
Verifica que el software hace lo que se espera.

- Cumplimiento de requisitos  
- Comportamiento esperado  
- Caso de uso satisfecho  

#### Facilita Mantenimiento
Las pruebas son una red de seguridad para cambios futuros.

- Refactoring confiado  
- Detección de regresiones  
- Documentación ejecutable  

#### Reduce Costos
Previene problemas costosos en producción.

- Menos incidentes en vivo  
- MTTR reducido  
- Reputación protegida  

### Principios Clave del Testing Efectivo

| Principio                     | Descripción                                                   | Aplicación                                              |
|------------------------------|--------------------------------------------------------------|--------------------------------------------------------|
| Exhaustividad Imposible      | No se puede probar todos los casos posibles                  | Enfocarse en casos críticos y de alto riesgo           |
| Dependencia del Contexto     | La estrategia varía por tipo de software                     | Ajustar testing para web, mobile, embebido, etc.       |
| Mentalidad Crítica           | Los testers deben buscar fallos, no validar éxito            | Adoptar mindset de *destructive testing*               |
| Early Testing                | Empezar pruebas lo antes posible                             | Testing desde análisis de requisitos                   |
| Clustering de Defectos       | Los defectos tienden a agruparse                             | Investigar más donde hay más fallos                    |
| Paradoja del Pesticida       | Los mismos casos dejan de encontrar nuevos defectos          | Variar casos de prueba regularmente                    |

---

## 2. Niveles de Pruebas: De lo Simple a lo Complejo  
  
El testing se estructura en cuatro niveles progresivos, cada uno con objetivos, alcance y técnicas específicas. Esta organización permite una cobertura completa y eficiente.  
  
### Estructura de Niveles  
  
- ACEPTACIÓN (UAT): E2E, Business Acceptance    
- SISTEMA: End-to-End, Integrated    
- INTEGRACIÓN: Module Integration    
- UNITARIAS: Single Method/Function    
  
### Nivel 1: Pruebas Unitarias (Unit Testing)  
  
#### Definición  
Pruebas que validan el comportamiento correcto de componentes individuales (métodos, funciones, clases) en aislamiento.  
  
Una prueba unitaria es la mínima unidad de prueba que puede existir. Prueba un componente sin dependencias externas.  
  
#### Características Clave  
  
- Rápidas: Milisegundos de ejecución    
- Aisladas: Sin dependencias (BD, API, archivos)    
- Deterministas: Mismo resultado siempre    
- Granulares: Prueban una funcionalidad específica    
- Automatizables: Pueden ejecutarse sin intervención    
  
#### Ejemplo en Java  
  
```java  
@Test  
public void testCalcularPrecioConDescuento() {  
    Producto producto = new Producto("Libro", 100);  
    double precioFinal = producto.aplicarDescuento(20);  
    assertEquals(80.0, precioFinal, 0.01);  
}
```
#### Herramientas Comunes

- Java: JUnit, TestNG, Mockito
- Python: pytest, unittest, mock
- JavaScript: Jest, Mocha, Jasmine
- C#/.NET: NUnit, xUnit, Moq

#### Objetivos

- Detectar defectos lógicos
- Documentar comportamiento
- Facilitar refactoring

### Nivel 2: Pruebas de Integración (Integration Testing)

#### Definición

Pruebas que validan cómo múltiples unidades trabajan juntas correctamente cuando se integran.

Las pruebas de integración verifican que los componentes individuales funcionan correctamente cuando se combinan, validando interfaces entre módulos.

#### Características Clave

- Moderadamente rápidas: Segundos
- Parcialmente aisladas: Pueden usar BD de prueba
- Enfoque en interfaces: Comunicación entre módulos
- Casos de flujo: Escenarios realistas
- Uso de stubs/mocks: Para servicios externos

#### Ejemplo en Java

```java
@Test  
public void testGuardarYRecuperarUsuario() {  
    Usuario usuario = new Usuario("juan@test.com");  
    usuarioRepository.guardar(usuario);  
  
    Usuario recuperado = usuarioRepository.encontrar("juan@test.com");  
    assertEquals("juan@test.com", recuperado.getEmail());  
}
```
#### Tipos de Integración

- Big Bang: Integrar todo de una vez (no recomendado)
- Bottom-Up: Integración desde componentes base hacia arriba
- Top-Down: Integración desde niveles superiores hacia abajo
- Sandwich: Combinación de bottom-up y top-down

#### Objetivos

- Validar comunicación entre módulos
- Detectar problemas de interfaz
- Verificar flujo de datos

### Nivel 3: Pruebas de Sistema (System Testing)

#### Definición

Pruebas que validan el sistema completo e integrado contra requisitos funcionales y no funcionales especificados.

El testing de sistema verifica que todo el software cumple con las especificaciones y funciona como se espera en un ambiente similar al de producción.

#### Características Clave

- End-to-End: Flujo completo del usuario
- Ambiente real: Cercano a producción
- Requisitos completos: Funcionales y no funcionales
- Pruebas paralelas: Validación de múltiples aspectos
- Más lentas: Minutos a horas

#### Dimensiones de Testing de Sistema

|Dimensión|Validación|
|---|---|
|Funcionalidad|¿El sistema hace lo que debe hacer?|
|Rendimiento|¿Responde en tiempo aceptable?|
|Seguridad|¿Está protegido contra amenazas?|
|Confiabilidad|¿Se recupera de fallos?|
|Usabilidad|¿Es fácil de usar?|
|Compatibilidad|¿Funciona en diferentes plataformas?|

#### Objetivos

- Validar requisitos completamente
- Encontrar defectos integrados
- Evaluar aspectos no funcionales

### Nivel 4: Pruebas de Aceptación (Acceptance Testing)

#### Definición

Pruebas realizadas por el cliente o usuario final para determinar si el sistema es aceptable y cumple con sus necesidades de negocio.

El testing de aceptación es la etapa final antes de producción. Verifica que el software satisface los criterios del cliente y entrega valor de negocio.

#### Características Clave

- Basado en requisitos del negocio
- Participación del cliente o usuarios finales
- Uso de datos reales o similares a producción
- Escenarios realistas
- Condición para liberar a producción

#### Tipos de Aceptación

- UAT (User Acceptance Testing): Ejecutado por usuarios finales
- Business Acceptance: Validación por stakeholders del negocio
- Operational Acceptance: Validación por el equipo de operaciones
- Contract Acceptance: Verificación del cumplimiento contractual

#### Ejemplo de Criterio

Given: Un usuario con rol "Cliente" está logueado  
When: El usuario navega a "Mis Pedidos"  
Then: Debe ver todos sus pedidos previos con estado actual  
And: Puede filtrar por fecha

#### Objetivos

- Validar valor de negocio
- Garantizar satisfacción del cliente
- Autorizar lanzamiento a producción

---

## 3. Tipos de Pruebas (Orthogonal a Niveles)  
  
Diferente a los niveles de pruebas, los tipos se refieren a qué aspecto del software se está probando. Un sistema puede tener múltiples tipos en cada nivel.  
  
### Pruebas Funcionales  
  
#### Descripción  
Responden a la pregunta: ¿El software hace lo que debe hacer?  
  
#### Enfoque  
  
- Validar casos de uso  
- Verificar salidas esperadas  
- Basadas en especificaciones  
- Testing de entrada/salida (Input/Output)  
  
### Pruebas No Funcionales  
  
#### Descripción  
Responden a la pregunta: ¿Qué tan bien funciona el software?  
  
#### Enfoque  
  
- Rendimiento (Performance)  
- Seguridad  
- Escalabilidad  
- Usabilidad  
  
### Pruebas de Regresión  
  
#### Descripción  
Responden a la pregunta: ¿Los cambios nuevos rompieron algo existente?  
  
#### Enfoque  
  
- Re-ejecutar pruebas después de cambios  
- Asegurar que no existan regresiones  
- Automatización crítica  
- Ejecutadas en cada release  
  
### Pruebas de Smoke / Sanidad  
  
#### Descripción  
Responden a la pregunta: ¿Funciona lo básico del sistema?  
  
#### Enfoque  
  
- Pruebas rápidas iniciales  
- Detectan problemas evidentes  
- Actúan como filtro antes de pruebas más profundas  
- Ejecución corta (5 a 10 minutos)  
  
### Otros Tipos Importantes de Pruebas  
  
| Tipo de Prueba | Objetivo | Cuándo Usarla |  
|--------------------------|----------------------------------------------|----------------------------------------|  
| Rendimiento / Load | Evaluar comportamiento bajo carga | Antes de producción, temporadas pico |  
| Seguridad / Penetration | Detectar vulnerabilidades | Regularmente, tras cambios críticos |  
| Usabilidad | Evaluar facilidad de uso | Antes de lanzamiento, con usuarios |  
| Compatibilidad | Verificar funcionamiento en múltiples entornos | Releases web y mobile |  
| Localización | Adaptación a idiomas y culturas | Lanzamientos internacionales |  
| Exploratorio | Descubrir defectos no previstos | Complemento del testing automatizado |  

### Testing de Rendimiento: Métricas Clave  
  
#### Latencia  
  
Tiempo que tarda el sistema en responder a una solicitud individual.  
  
- API Response: < 500 ms  
- Página Web: < 3 s  
- Transacción en BD: < 100 ms  
  
#### Throughput  
  
Cantidad de operaciones procesadas en un periodo de tiempo.  
  
- Requests por segundo  
- Transacciones por minuto  
- Usuarios concurrentes  
  
#### Recursos  
  
Uso de recursos del sistema durante la ejecución.  
  
- CPU menor al 80%  
- Uso eficiente de memoria  
- Operaciones de entrada/salida optimizadas  
  
---

## 4. Mejores Prácticas en Testing  
  
### Construcción de una Estrategia de Testing Efectiva  
  
#### La Pirámide de Testing Ideal  
  
- 70-80% Pruebas Unitarias (rápidas, aisladas)  
- 15-20% Pruebas de Integración (medianas)  
- 5-10% Pruebas de Sistema (lentas, end-to-end)  
- Menos pruebas manuales (principalmente exploratorias)  
  
**Evitar:** la pirámide invertida con exceso de pruebas E2E (lenta y frágil).  
  
### Mejores Prácticas Fundamentales  
  
#### 1. Test Driven Development (TDD)  
  
Ciclo: Red → Green → Refactor  
  
- Escribir el test primero  
- Ejecutar y verificar que falle (Red)  
- Implementar el código mínimo para que pase (Green)  
- Mejorar y optimizar el código (Refactor)  
  
#### 2. Buscar Cobertura Significativa  
  
No se trata de cantidad, sino de calidad.  
  
- 75-85% de cobertura de código  
- 100% en componentes críticos  
- Cobertura de casos límite (edge cases)  
- Validación de caminos de error  
  
#### 3. Naming Descriptivo  
  
El nombre del test debe explicar su propósito.  
  
- Ejemplo correcto: `testCalcularPrecioConDescuento()`  
- Ejemplo incorrecto: `test1()`, `testFoo()`  
  
El nombre del test actúa como documentación viva.  
  
#### 4. Datos de Prueba Realistas  
  
Usar datos que representen escenarios reales.  
  
- Basados en datos de producción (anonimizados)  
- Incluir casos límite y de frontera  
- Considerar valores nulos y especiales  
- Evitar datos irreales o simplificados  
  
### Prácticas de Automatización  
  
#### Automatización Efectiva de Pruebas  
  
Características de una buena automatización:  
  
- Determinista: mismo resultado siempre (sin tests inestables)  
- Independiente: el orden de ejecución no afecta resultados  
- Rápida: suite completa menor a 10 minutos  
- Mantenible: fácil de actualizar ante cambios  
- Confiable: sin falsos positivos  
- Reportable: resultados claros y entendibles  
  
#### ¿Qué NO automatizar?  
  
- Interfaces visuales altamente cambiantes  
- Reportes con formatos variables  
- Datos altamente dinámicos  
- Validaciones de una sola vez  
  
### Anti-patrones a Evitar  
  
#### Pruebas Frágiles (Flaky Tests)  
  
- Fallan de forma intermitente  
- Dependencia de tiempos o condiciones externas  
  
**Causa:** falta de sincronización  
**Solución:** uso de esperas explícitas y mocks  
  
#### Falta de Aislamiento  
  
- Tests dependientes entre sí  
- Orden de ejecución afecta resultados  
  
**Causa:** estado compartido  
**Solución:** setup y teardown adecuados  
  
#### Assertions Múltiples  
  
- Un test valida demasiadas cosas  
- Difícil identificar la causa del fallo  
  
**Causa:** mala práctica de diseño  
**Solución:** aplicar el principio AAA (Arrange, Act, Assert) con una validación clara por test  
  
#### Pruebas Lentas  
  
- No se ejecutan frecuentemente  
- Feedback tardío  
  
**Causa:** uso de bases de datos reales o APIs externas  
**Solución:** uso de mocks y test doubles  

---

## 5. Herramientas y Ecosistema de Testing  
  
### Frameworks por Lenguaje  
  
#### Java / Kotlin (JVM Languages)  
  
- JUnit 5: Framework principal  
- TestNG: Parametrización avanzada  
- Mockito: Mocking de objetos  
- AssertJ: Assertions fluentes  
- Cucumber: BDD con Gherkin  
  
#### Python  
  
- pytest: Framework más popular  
- unittest: Librería estándar  
- mock: Mocking integrado  
- hypothesis: Property-based testing  
- selenium: Automatización web  
  
#### JavaScript / TypeScript (Web / Node.js)  
  
- Jest: Framework todo en uno  
- Mocha: Test runner flexible  
- Jasmine: Estilo BDD  
- Playwright: Automatización de navegadores  
- Vitest: Testing nativo con Vite  
  
#### C# / .NET  
  
- xUnit: Moderno y recomendado  
- NUnit: Clásico  
- Moq: Framework de mocking  
- FluentAssertions: API fluida para validaciones  
- SpecFlow: BDD tipo Cucumber  
  
### Herramientas de Propósito Específico  
  
#### Code Coverage  
  
- JaCoCo: Estándar para Java  
- Coverlet: Para .NET  
- pytest-cov: Para Python  
- Istanbul / NYC: Para JavaScript  
  
#### Load / Performance Testing  
  
- Apache JMeter: Testing de carga  
- Gatling: Basado en Scala  
- k6: Moderno, basado en JavaScript  
- Locust: Basado en Python  
  
#### Web Automation  
  
- Selenium: Clásico, multi-lenguaje  
- Playwright: Moderno y rápido  
- Cypress: E2E en JavaScript  
- Puppeteer: Automatización con Chrome  
  
#### BDD / Gherkin  
  
- Cucumber: Estándar de la industria  
- SpecFlow: Para .NET  
- Behave: Implementación en Python  
- CodeceptJS: Para JavaScript  
  
### Integración en CI/CD  
  
#### Pipeline de Testing Automatizado  
  
Flujo recomendado en cada commit:  
  
Pruebas Unitarias (30-60 s)  
→  
Integración (1-2 min)  
→  
Smoke Tests (2-3 min)  
→  
Análisis de Código (SonarQube)  
→  
Merge permitido  

### Pruebas más lentas (post-merge o programadas)  
  
- Sistema / E2E: 10-30 minutos  
- Load testing: 30-60 minutos  
- Security scanning: 10-20 minutos  
- Performance benchmarks: ejecución nocturna  
  
---  
  
## Conclusiones: Testing como Disciplina Profesional  
  
### Niveles de Testing  
  
Unitarias → Integración → Sistema → Aceptación  
  
Cada nivel tiene objetivos y técnicas específicas. Todos son necesarios.  
  
### Tipos de Testing  
  
Funcionales, no funcionales, regresión, seguridad, rendimiento, entre otros.  
  
Son ortogonales a los niveles: se aplican en cada uno.  
  
### Pirámide de Testing  
  
- 70-80% pruebas unitarias  
- 15-20% pruebas de integración  
- 5-10% pruebas de sistema  
  
Una estrategia equilibrada garantiza calidad y velocidad.  
  
## Reflexión Final para Ingenieros de Calidad  
  
El testing no es un paso al final del desarrollo. Es una disciplina integrada que debe formar parte de la cultura de todo equipo de ingeniería.  
  
### Principios clave  
  
- Las pruebas documentan el comportamiento esperado  
- Son una red de seguridad para el refactoring  
- Permiten cambios con confianza  
- Generan confianza en la calidad  
- Son una inversión, no un costo  
  
---  
  
> "El testing es la expresión más clara de profesionalismo en ingeniería de software. Donde no hay testing, hay miedo a cambiar código. Donde hay testing, hay confianza y velocidad."  
  
---  
  
## Cierre  
  
Construye con confianza.  
Prueba todo.  
Entrega con certeza.