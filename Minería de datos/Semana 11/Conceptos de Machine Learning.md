
# Conceptos de Machine Learning

---

## ¿Qué es Machine Learning ahí?

Se divide en 2 conceptos:

- **Regresión**
- **Clasificación**

Son los dos grandes tipos de problemas:

### Regresión

- Predice valores numéricos
- Ejemplo: temperatura, precio de casa

### Clasificación

- Predice categorías
- Ejemplo: spam/no spam, aprobado/reprobado

---

## EDA (Exploratory Data Analysis)

> “Análisis Descriptivo Exploratorio”

*Explorar, entender, limpiar y descubrir patrones en los datos antes de aplicar modelos de Machine Learning*

Es la fase donde entiendes los datos antes de modelar.

### ¿Para qué sirve el EDA?

EDA responde cosas como:

- ¿Qué contienen mis datos?
- ¿Hay errores?
- ¿Qué variables son importantes?
- ¿Hay relaciones entre variables?
- ¿Los datos sirven para modelar?

> **EDA evita que construyas modelos malos con datos malos**

### ¿Qué haces en EDA?

1. **Gráficos**
    - Histogramas
    - Boxplots
    - Scatter plots
2. **Estadística descriptiva**
    - Media
    - Mediana
    - Varianza
    - Desviación estándar
3. **Detectar**
    - Valores atípicos (outliers)
    - Distribuciones
    - Relaciones entre variables

## Fases del EDA (flujo completo)

1. *Comprensión inicial*

- Ver columnas (features)
- Tipos de datos (numérico, categórico)
- Cantidad de datos

Ejemplo:

- Edad → numérico
- Género → categórico

2. *Limpieza de datos*

*Problemas comunes:*

- Valores nulos (NaN)
- Datos duplicados
- Errores (ej: edad = 200)

Entonces:

- Eliminar o rellenar datos
- Corregir formatos

3. *Análisis univariado (1 variable)*

Analizas cada variable por separado

Para numéricas:

- Media
- Mediana
- Desviación estándar
- Histogramas

Para categóricas:

- Frecuencias
- Conteos

Ejemplo:

- ¿Cuál es la edad promedio?
- ¿Cuál categoría aparece más?

4. *Análisis bivariado (2 variables)*

Aquí entra lo que es:

- Correlación
- Relación entre X y Y

Ejemplo:

- Temperatura vs ventas
- Edad vs salario

5. *Análisis multivariado (más de 2 variables)*

- Relaciones complejas
- Interacciones

Ejemplo:

- Temperatura + humedad → ventas

---

## Técnicas clave en EDA

1. *Estadística descriptiva*

Incluye:

- Media
- Varianza
- Desviación estándar
- Percentiles

Sirve para resumir datos

2. *Visualización*

Muy importante en EDA

Tipos:

- Histogramas → distribución
- Boxplot → outliers
- Scatter → relaciones
- Heatmap → correlación

3. *Detección de outliers*

Valores raros o extremos

Ejemplo:

- Edad = 150

Problema:

- Distorsionan modelos

4. *Correlación*

- Ver qué variables están relacionadas
- Usar coeficiente (-1 a 1)

4. *Distribución de datos*

- Normal (campana)
- Sesgada (skewed)

---

## Problemas que detecta el EDA

EDA te ayuda a encontrar:

*Datos sucios

- Nulos
- Incorrectos

*Outliers

- Valores extremos

*Variables irrelevantes

- No aportan nada

*Multicolinealidad

- Variables muy correlacionadas entre sí

---
## ¿Qué decisiones salen del EDA?

Después de EDA decides:

- Qué variables usar (X)
- Qué eliminar
- Qué transformar (normalizar, escalar)
- Qué modelo usar

---

## Pregunta de investigación

### Es clave porque:

Define todo el análisis.

Ejemplo:

- ¿Qué variables afectan las ventas?
- ¿El clima influye en el consumo de helados?

Sin esto, el análisis no tiene dirección.

---

## Variables: X y Y

### X = Variables independientes

- También llamadas features
- Ejemplo:
    - Temperatura
    - Humedad
    - Viento

### Y = Variable dependiente (predictiva)

- Lo que quieres predecir
- Ejemplo:
    - Ventas
    - Lluvia (sí/no)

Ejemplo 2:

- X: temp, viento, humedad
- Y: precipitación

## ¿Las variables X SIEMPRE tienen correlación con Y?

No, y eso es justamente lo que se busca descubrir.

### Relación correcta:

- **X (variables independientes)** → posibles explicaciones
- **Y (variable dependiente)** → lo que quieres predecir

Pero:

> **No todas las X sirven**

### Entonces, ¿Qué haces?

En EDA analizas:

- Correlación de cada X con Y
- Te quedas con las que sí tienen relación

### ¿Qué significa lo de “1 a muchos”?

Eso que viste es correcto conceptualmente:

Una Y puede depender de muchas X

Ejemplo:

$Ventas=f(temperatura,humedad,precio,promociones)$

Es una relación:

> **1 variable objetivo (Y) → muchas variables explicativas (X)**

---
	
## Correlación vs Causalidad

### Correlación

- Dos variables se mueven juntas

Ejemplo:

- Hace calor → aumentan ventas de helado

### Causalidad

- Una variable causa la otra

Ojo:

> Correlación ≠ causalidad

Ejemplo clásico:

- Helados ↑ y ahogamientos ↑
- ❌ No significa que uno cause el otro
- ✔ Ambos dependen del calor

---

## Coeficiente de correlación (-1 a 1)

Es un número que mide:

> **qué tan fuerte y en qué dirección se relacionan dos variables**

Se representa normalmente como **r** (correlación de Pearson).

### Rango del coeficiente

Siempre está entre:

$−1≤r≤1$

Esto es clave:

|Valor de r|Significado|
|---|---|
|**1**|Relación positiva perfecta|
|**0**|No hay relación|
|**-1**|Relación negativa perfecta|

### ¿Qué significa que r = 1?

Esto es lo más importante que preguntas:

> **r = 1 significa que las dos variables tienen una relación lineal PERFECTA positiva**

*¿Qué quiere decir eso?*

- Cuando una variable sube → la otra también sube
- Siempre en la misma proporción
- Todos los puntos caen en una línea recta
- Además, no es realista, ya que indica que el modelo es perfecto, siendo algo que no es posible.

#### Ejemplo:

| X   | Y   |
| --- | --- |
| 1   | 2   |
| 2   | 4   |
| 3   | 6   |
| 4   | 8   |

Aquí:

- Y = 2X
- Relación perfecta
- r = 1

### ¿Qué significa r = -1?

- Relación perfecta negativa

Ejemplo:

- X sube → Y baja

|X|Y|
|---|---|
|1|10|
|2|8|
|3|6|

Línea recta descendente

### ¿Qué significa r = 0?

- No hay relación lineal

👉 Ejemplo:

- Lanzar un dado vs temperatura  
    (no tienen nada que ver)

## Interpretación práctica

|r|Interpretación|
|---|---|
|0.0 – 0.2|Muy débil|
|0.2 – 0.4|Débil|
|0.4 – 0.6|Moderada|
|0.6 – 0.8|Fuerte|
|0.8 – 1.0|Muy fuerte|

---

## ¿Qué se busca con la correlación?

En Machine Learning se usa para:

1. *Seleccionar variables (features)*

- Saber cuáles afectan a Y

Ejemplo:

- Temp vs ventas → r = 0.8 → útil
- Viento vs ventas → r = 0.1 → inútil

2. *Entender relaciones*

- Descubrir patrones ocultos

3. *Reducir variables*

- Eliminar redundantes

👉 Ejemplo:

- Altura en cm y altura en metros → r ≈ 1  
    → una sobra

---

## Normalidad (Distribución normal)

La normalidad se refiere a cuando los datos siguen una:

> **distribución normal (o distribución gaussiana)**

Es la famosa curva en forma de campana.

### Forma de la distribución normal

![https://images.openai.com/static-rsc-4/HwJ8--Iv9ovWwKKjTWFJnN-HCEL_IEj4mOuxO-7rV5-gPX4Vg-P5FucZzbUweeW53BLtp-c4v3wCKUylp3_gXFqT_KH2G44nBTkCNyz9NHxYWSqN99MmXC1iDPbg-cfZtNl230NSQb7ROnnSi_BmfEln0tWALMOM_peA8v825TBUCkX56kt219eNLX1G6dJP?purpose=fullsize](https://images.openai.com/static-rsc-4/hD4fpvyF-OVandVnkuf9kbBtR0VTXQz23oFQfwK1vzvjztvhcXjqpvzukakqSFHd36wr2XfDTJ3RlToGbzV8uMLZJZtdahYQ_h-ta_eieAE2uo-KneyDMKOtw8AY7faGVoP9YXrCapZKiDx8uJgsHdtRzp8pxQgKrQ4CWuc87gY?purpose=inline)

![https://images.openai.com/static-rsc-4/ZYjacSQOKlsZgLa55CURk8c5V5_7e9TxRkXn-2YwGoXAYMaWpDV1L8ywOm8764aAeq_gTNW_o2DKjF_V04KN81L-6DbAMfM6KS5jIk8bCzXlFrJfujNGwCqsOCd-3EAniFwslFw4T_J8UH5WnaCX8nvnO88Sm7BqUGJsn8pppu7ehNDOAu2aXhQhdpVexUix?purpose=fullsize](https://images.openai.com/static-rsc-4/FZTDmmlNPw202HBLOoyYTwF-9bzAjrE-n3VeZqkX5BmlsvLvUFQfmiDg6qnDqq4No2TguyHCVPs_vGKTSxCNzSGIH3MZJgiykOoRcRmjE87M7QQrh4JU8sYNuSLS0StDnD9ci9NJWx6fBiVJz9RRwI7H_bSvV2nawmR2ZCd3IL8?purpose=inline)

#### Características:

- Simétrica
- Pico en el centro (media)
- Disminuye hacia los extremos
- Forma de campana

### Elementos clave

### Media (μ)

- Centro de la distribución

### Desviación estándar (σ)

- Qué tan dispersos están los datos

En una normal:

- Media = Mediana = Moda

## Regla empírica (la del tablero)

Esto es lo que viste:

|Rango|Porcentaje|
|---|---|
|±1σ|68%|
|±2σ|95%|
|±3σ|99.7%|

Es decir:

- 95% de los datos están cerca del centro
- Solo 2.5% a cada lado (extremos)

### ¿Qué significa que los datos sean “normales”?

Significa que:

- La mayoría de valores están cerca del promedio
- Pocos valores extremos
- Distribución equilibrada

## ¿Para qué sirve la normalidad?

1. *Base de muchos modelos*

Muchos algoritmos asumen normalidad:

- Regresión lineal
- Tests estadísticos (t-test, ANOVA)

2. *Detectar outliers*

- Valores fuera de ±2σ o ±3σ → sospechosos

3. *Probabilidades*

Puedes calcular probabilidades fácilmente

Ejemplo:

- ¿Qué probabilidad hay de que algo esté por encima de cierto valor?

4. *Estandarización (Z-score)*

Transformar datos para compararlos

## Z-score

Sirve para saber qué tan lejos está un dato de la media

$Z=X−μ/σ$

### Interpretación:

- Z = 0 → en la media
- Z = 1 → 1 desviación arriba
- Z = -2 → muy bajo

---
## ¿Qué pasa si NO hay normalidad?

Muy importante en la práctica

Los datos pueden ser:

### Sesgados (skewed)

*Sesgo positivo (derecha)*

- Cola larga hacia la derecha
- Ejemplo: ingresos

*Sesgo negativo (izquierda)*

- Cola hacia la izquierda

*Multimodales*

- Varias “campanas”

*Problema:*

- Algunos modelos fallan o pierden precisión

---

## ¿Qué haces si no hay normalidad?

En EDA puedes:

### ✔ Transformar datos

- Logaritmo
- Raíz cuadrada

### ✔ Eliminar outliers

### ✔ Usar modelos robustos

- Árboles (no requieren normalidad)

---

## ¿Cómo saber si hay normalidad?

- **Métodos:**

1. *Visuales*

- Histograma
- Curva de densidad

1. *Estadísticos*

- Test de Shapiro-Wilk
- Kolmogorov-Smirnov

---

## Media, Varianza y Desviación estándar

### Media (μ)

- Es el promedio
- Indica el valor típico
- Problema: se afecta por valores extremos (outliers)

Te dice:  
**“Dónde están los datos”**

### Varianza (σ²)

- Mide qué tanto se alejan los datos de la media
- Está en unidades al cuadrado (menos intuitiva)

Te dice:  
**“Qué tan dispersos están los datos”**

### Desviación estándar (σ)

- Raíz de la varianza
- Mide la dispersión en unidades reales

Te dice:  
**“Qué tan confiable es la media”**

### Interpretación:

- Desviación pequeña → datos agrupados
- Desviación grande → datos dispersos

---

