# A Plant-Based Coffee Shop

El café es un fenómeno global. En todo el mundo, miles de nuevas cafeterías abren cada año, y las cafeterías especializadas son cada vez más populares.

En este proyecto analizarás un conjunto de datos de una encuesta a aproximadamente 1000 amantes del café para identificar las opciones de lácteos más populares. Con base en tus hallazgos, recomendarás qué alternativas vegetales deberían ofrecerse en una nueva cafetería especializada que planea servir solo bebidas a base de plantas.

---

## Cargando los datos

El archivo **`coffee-survey-results.csv`** contiene información sobre las preferencias de café de las personas, incluyendo qué tipo de lácteo prefieren. Carga los datos y revísalos.

### Objetivos de la actividad:

- Importar pandas.
- Cargar los datos de la encuesta.
- Mostrar el DataFrame.

```python
import pandas as pd  
survey = pd.read_csv('coffee-survey-results.csv')  
survey
```

|      | SubmissionID | What is your age range? | How many cups of coffee do you consume per day? | Do you add any dairy or dairy alternative to your coffee? | What kind of dairy? (Whole milk) | What kind of dairy? (Skim milk) | What kind of dairy? (Half and half) | What kind of dairy? (Coffee creamer) | What kind of dairy? (Flavored creamer) | What kind of dairy? (Oat milk) | What kind of dairy? (Almond milk) | What kind of dairy? (Soy milk) | Do you add any sugar or sweetener to your coffee? | What kind of sugar or sweetener? (Granulated Sugar) | What kind of sugar or sweetener? (Artificial Sweetener) | What kind of sugar or sweetener? (Honey) | What kind of sugar or sweetener? (Maple Syrup) | What kind of sugar or sweetener? (Stevia) | What kind of sugar or sweetener? (Agave Nectar) | What kind of sugar or sweetener? (Brown Sugar) | What kind of sugar or sweetener? (Raw Sugar) | How do you brew your coffee? (Pour over) | How do you brew your coffee? (French press) | How do you brew your coffee? (Espresso) | How do you brew your coffee? (Coffee brewing machine) | How do you brew your coffee? (Pod/capsule machine) | How do you brew your coffee? (Instant coffee) | How do you brew your coffee? (Bean-to-cup machine) | How do you brew your coffee? (Cold brew) | How do you brew your coffee? (Coffee extract) |
| ---- | ------------ | ----------------------- | ----------------------------------------------- | --------------------------------------------------------- | -------------------------------- | ------------------------------- | ----------------------------------- | ------------------------------------ | -------------------------------------- | ------------------------------ | --------------------------------- | ------------------------------ | ------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------- | ----------------------------------------- | ----------------------------------------------- | ---------------------------------------------- | -------------------------------------------- | ---------------------------------------- | ------------------------------------------- | --------------------------------------- | ----------------------------------------------------- | -------------------------------------------------- | --------------------------------------------- | -------------------------------------------------- | ---------------------------------------- | --------------------------------------------- |
| 0    | VZbv6N       | 35-44                   | < 1                                             | 1                                                         | 1                                | 0                               | 1                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              | 1                                                 | 0                                                   | 1                                                       | 0                                        | 0                                              | 0                                         | 0                                               | 1                                              | 1                                            | 0                                        | 1                                           | 0                                       | 0                                                     | 1                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 1    | jBGZBQ       | 25-34                   | < 1                                             | 0                                                         | NaN                              | NaN                             | NaN                                 | NaN                                  | NaN                                    | NaN                            | NaN                               | NaN                            | 1                                                 | 1                                                   | 0                                                       | 0                                        | 0                                              | 0                                         | 0                                               | 1                                              | 1                                            | 1                                        | 1                                           | 0                                       | 0                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 2    | 7d9809       | 18-24                   | 1                                               | 1                                                         | 1                                | 0                               | 1                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              | 1                                                 | 0                                                   | 0                                                       | 1                                        | 0                                              | 0                                         | 0                                               | 0                                              | 0                                            | 0                                        | 1                                           | 0                                       | 1                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 3    | bl62ee       | 45-54                   | 1                                               | 1                                                         | 0                                | 0                               | 1                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              | 1                                                 | 0                                                   | 0                                                       | 0                                        | 0                                              | 0                                         | 0                                               | 0                                              | 1                                            | 0                                        | 0                                           | 0                                       | 0                                                     | 0                                                  | 1                                             | 0                                                  | 0                                        | 0                                             |
| 4    | BGbJ9Q       | 25-34                   | 2                                               | 1                                                         | 1                                | 0                               | 1                                   | 0                                    | 0                                      | 1                              | 1                                 | 0                              | 0                                                 | NaN                                                 | NaN                                                     | NaN                                      | NaN                                            | NaN                                       | NaN                                             | NaN                                            | NaN                                          | 0                                        | 0                                           | 0                                       | 1                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| ...  | ...          | ...                     | ...                                             | ...                                                       | ...                              | ...                             | ...                                 | ...                                  | ...                                    | ...                            | ...                               | ...                            | ...                                               | ...                                                 | ...                                                     | ...                                      | ...                                            | ...                                       | ...                                             | ...                                            | ...                                          | ...                                      | ...                                         | ...                                     | ...                                                   | ...                                                | ...                                           | ...                                                | ...                                      | ...                                           |
| 1165 | ZdR7Dy       | 18-24                   | 2                                               | 1                                                         | 0                                | 0                               | 0                                   | 0                                    | 0                                      | 1                              | 0                                 | 0                              | 0                                                 | NaN                                                 | NaN                                                     | NaN                                      | NaN                                            | NaN                                       | NaN                                             | NaN                                            | NaN                                          | 1                                        | 1                                           | 1                                       | 0                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 1166 | LdMr0l       | 35-44                   | 2                                               | 1                                                         | 1                                | 0                               | 0                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              | 0                                                 | NaN                                                 | NaN                                                     | NaN                                      | NaN                                            | NaN                                       | NaN                                             | NaN                                            | NaN                                          | 0                                        | 0                                           | 1                                       | 1                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 1167 | ylqaYX       | 18-24                   | < 1                                             | 0                                                         | NaN                              | NaN                             | NaN                                 | NaN                                  | NaN                                    | NaN                            | NaN                               | NaN                            | 1                                                 | 1                                                   | 0                                                       | 0                                        | 0                                              | 0                                         | 0                                               | 0                                              | 0                                            | 0                                        | 1                                           | 0                                       | 0                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 1168 | KMBEyk       | 25-34                   | 3                                               | 1                                                         | 1                                | 0                               | 0                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              | 0                                                 | NaN                                                 | NaN                                                     | NaN                                      | NaN                                            | NaN                                       | NaN                                             | NaN                                            | NaN                                          | 1                                        | 0                                           | 0                                       | 1                                                     | 0                                                  | 0                                             | 0                                                  | 0                                        | 0                                             |
| 1169 | g5ggRM       | 18-24                   | 1                                               | 1                                                         | 0                                | 0                               | 0                                   | 1                                    | 1                                      | 1                              | 0                                 | 0                              | 0                                                 | NaN                                                 | NaN                                                     | NaN                                      | NaN                                            | NaN                                       | NaN                                             | NaN                                            | NaN                                          | 0                                        | 0                                           | 1                                       | 0                                                     | 1                                                  | 1                                             | 0                                                  | 0                                        | 0                                             |

¡Esos nombres de columnas son bastante largos!

Este dataset tiene 30 columnas que parecen ser preguntas completas.

---

## Reduciendo las columnas

Veamos los nombres de las columnas para identificar cuáles necesitamos.

### Objetivo:

Mostrar todos los nombres de columnas.

```python
survey.columns
```

|     |                                                           |
| --- | --------------------------------------------------------- |
| 0   | SubmissionID                                              |
| 1   | What is your age range?                                   |
| 2   | How many cups of coffee do you consume per day?           |
| 3   | Do you add any dairy or dairy alternative to your coffee? |
| 4   | What kind of dairy? (Whole milk)                          |
| 5   | What kind of dairy? (Skim milk)                           |
| 6   | What kind of dairy? (Half and half)                       |
| 7   | What kind of dairy? (Coffee creamer)                      |
| 8   | What kind of dairy? (Flavored creamer)                    |
| 9   | What kind of dairy? (Oat milk)                            |
| 10  | What kind of dairy? (Almond milk)                         |
| 11  | What kind of dairy? (Soy milk)                            |
| 12  | Do you add any sugar or sweetener to your coffee?         |
| 13  | What kind of sugar or sweetener? (Granulated Sugar)       |
| 14  | What kind of sugar or sweetener? (Artificial Sweetener)   |
| 15  | What kind of sugar or sweetener? (Honey)                  |
| 16  | What kind of sugar or sweetener? (Maple Syrup)            |
| 17  | What kind of sugar or sweetener? (Stevia)                 |
| 18  | What kind of sugar or sweetener? (Agave Nectar)           |
| 19  | What kind of sugar or sweetener? (Brown Sugar)            |
| 20  | What kind of sugar or sweetener? (Raw Sugar)              |
| 21  | How do you brew your coffee? (Pour over)                  |
| 22  | How do you brew your coffee? (French press)               |
| 23  | How do you brew your coffee? (Espresso)                   |
| 24  | How do you brew your coffee? (Coffee brewing machine)     |
| 25  | How do you brew your coffee? (Pod/capsule machine)        |
| 26  | How do you brew your coffee? (Instant coffee)             |
| 27  | How do you brew your coffee? (Bean-to-cup machine)        |
| 28  | How do you brew your coffee? (Cold brew)                  |
| 29  | How do you brew your coffee? (Coffee extract)             |

Las columnas 4–11 corresponden a las preferencias de lácteos.

---

## Seleccionando columnas necesarias

### Objetivos:

- Seleccionar las columnas relevantes.
- Guardarlas en un DataFrame llamado `dairy`.
- Mostrar el resultado.

```python
needed_columns = [  
    "What kind of dairy? (Whole milk)",  
    "What kind of dairy? (Skim milk)",  
    "What kind of dairy? (Half and half)",  
    "What kind of dairy? (Coffee creamer)",  
    "What kind of dairy? (Flavored creamer)",  
    "What kind of dairy? (Oat milk)",  
    "What kind of dairy? (Almond milk)",  
    "What kind of dairy? (Soy milk)"  
]  
  
dairy = survey[needed_columns]  
dairy
```

| ID   | What kind of dairy? (Whole milk) | What kind of dairy? (Skim milk) | What kind of dairy? (Half and half) | What kind of dairy? (Coffee creamer) | What kind of dairy? (Flavored creamer) | What kind of dairy? (Oat milk) | What kind of dairy? (Almond milk) | What kind of dairy? (Soy milk) |
| ---- | -------------------------------- | ------------------------------- | ----------------------------------- | ------------------------------------ | -------------------------------------- | ------------------------------ | --------------------------------- | ------------------------------ |
| 0    | 1                                | 0                               | 1                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              |
| 1    | NaN                              | NaN                             | NaN                                 | NaN                                  | NaN                                    | NaN                            | NaN                               | NaN                            |
| 2    | 1                                | 0                               | 1                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              |
| 3    | 0                                | 0                               | 1                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              |
| 4    | 1                                | 0                               | 1                                   | 0                                    | 0                                      | 1                              | 1                                 | 0                              |
| ...  | ...                              | ...                             | ...                                 | ...                                  | ...                                    | ...                            | ...                               | ...                            |
| 1165 | 0                                | 0                               | 0                                   | 0                                    | 0                                      | 1                              | 0                                 | 0                              |
| 1166 | 1                                | 0                               | 0                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              |
| 1167 | NaN                              | NaN                             | NaN                                 | NaN                                  | NaN                                    | NaN                            | NaN                               | NaN                            |
| 1168 | 1                                | 0                               | 0                                   | 0                                    | 0                                      | 0                              | 0                                 | 0                              |
| 1169 | 0                                | 0                               | 0                                   | 1                                    | 1                                      | 1                              | 0                                 | 0                              |

---

## Renombrando columnas

Podemos simplificar los nombres usando `rename()`.

### Objetivos:

- Renombrar columnas.
- Mostrar el resultado.

```python
dairy = dairy.rename(columns=name_map)  
dairy
```

Ahora las columnas son mucho más fáciles de manejar:

|ID|whole_milk|skim_milk|half_and_half|coffee_creamer|flavored_creamer|oat_milk|almond_milk|soy_milk|
|---|---|---|---|---|---|---|---|---|
|0|1|0|1|0|0|0|0|0|
|1|NaN|NaN|NaN|NaN|NaN|NaN|NaN|NaN|
|2|1|0|1|0|0|0|0|0|
|3|0|0|1|0|0|0|0|0|
|4|1|0|1|0|0|1|1|0|
|...|...|...|...|...|...|...|...|...|
|1165|0|0|0|0|0|1|0|0|
|1166|1|0|0|0|0|0|0|0|
|1167|NaN|NaN|NaN|NaN|NaN|NaN|NaN|NaN|
|1168|1|0|0|0|0|0|0|0|
|1169|0|0|0|1|1|1|0|0|

- Whole milk
- Skim milk
- Half and half
- Coffee creamer
- Flavored creamer
- Oat milk
- Almond milk
- Soy milk

---

## Entendiendo los datos

Cada fila representa una persona:

- **1** → Sí consume ese tipo de lácteo
- **0** → No lo consume
- **NaN** → No respondió

---

## Analizando valores faltantes

### Objetivos:

- Identificar valores NaN.
- Contarlos por columna.

```python
dairy.isna().sum()
```

Todas las columnas tienen la misma cantidad de NaN porque:

|                  |     |
| ---------------- | --- |
| Whole milk       | 647 |
| Skim milk        | 647 |
| Half and half    | 647 |
| Coffee creamer   | 647 |
| Flavored creamer | 647 |
| Oat milk         | 647 |
| Almond milk      | 647 |
| Soy milk         | 647 |

Si alguien respondió que no usa lácteos, no respondió las siguientes preguntas.

---

## Limpiando los datos

Eliminamos filas con valores faltantes:

```python
dairy = dairy.dropna()  
dairy
```

Ahora quedan 523 filas válidas.

| ID   | Whole milk | Skim milk | Half and half | Coffee creamer | Flavored creamer | Oat milk | Almond milk | Soy milk |
| ---- | ---------- | --------- | ------------- | -------------- | ---------------- | -------- | ----------- | -------- |
| 0    | 1          | 0         | 1             | 0              | 0                | 0        | 0           | 0        |
| 2    | 1          | 0         | 1             | 0              | 0                | 0        | 0           | 0        |
| 3    | 0          | 0         | 1             | 0              | 0                | 0        | 0           | 0        |
| 4    | 1          | 0         | 1             | 0              | 0                | 1        | 1           | 0        |
| 5    | 0          | 0         | 1             | 1              | 1                | 1        | 1           | 0        |
| ...  | ...        | ...       | ...           | ...            | ...              | ...      | ...         | ...      |
| 1164 | 0          | 0         | 0             | 1              | 0                | 0        | 0           | 0        |
| 1165 | 0          | 0         | 0             | 0              | 0                | 1        | 0           | 0        |
| 1166 | 1          | 0         | 0             | 0              | 0                | 0        | 0           | 0        |
| 1168 | 1          | 0         | 0             | 0              | 0                | 0        | 0           | 0        |
| 1169 | 0          | 0         | 0             | 1              | 1                | 1        | 0           | 0        |

---

## Preferencias de lácteos

Queremos saber qué porcentaje de personas usa cada tipo.

### Objetivos:

- Calcular porcentajes.
- Mostrar resultados.

```python
dairy_preferences = dairy.mean() * 100  
dairy_preferences
```

Resultados:

|                  |         |
| ---------------- | ------- |
| Whole milk       | 56.214% |
| Skim milk        | 7.075%  |
| Half and half    | 23.327% |
| Coffee creamer   | 6.692%  |
| Flavored creamer | 9.369%  |
| Oat milk         | 38.815% |
| Almond milk      | 10.325% |
| Soy milk         | 5.736%  |

- Whole milk → 56.21%
- Skim milk → 7.07%
- Half and half → 23.33%
- Coffee creamer → 6.69%
- Flavored creamer → 9.37%
- Oat milk → 38.82%
- Almond milk → 10.33%
- Soy milk → 5.74%

Los porcentajes suman más de 100% porque una persona puede elegir varias opciones.

---

## Visualización

Primero ordenamos los datos:

```python
dairy_preferences = dairy_preferences.sort_values()  
dairy_preferences
```

|                  |         |
| ---------------- | ------- |
| Soy milk         | 5.736%  |
| Coffee creamer   | 6.692%  |
| Skim milk        | 7.075%  |
| Flavored creamer | 9.369%  |
| Almond milk      | 10.325% |
| Half and half    | 23.327% |
| Oat milk         | 38.815% |
| Whole milk       | 56.214% |

---

## **Gráfico de barras horizontal**

### **Objetivos:**

- Importar matplotlib.
- Crear gráfico.
- Etiquetar eje X.

```python
import matplotlib.pyplot as plt  
plt.barh(dairy_preferences.index, dairy_preferences)  
plt.xlabel("Percent")
```

![[Minería de datos/Curso de Minería de Datos/Data Cleaning/A Plant-Based Coffee Shop/ANEXOS/Pasted image 20260331173703.png]]

---

## Conclusión

La alternativa vegetal más popular es:

**Leche de avena (Oat milk)**

---