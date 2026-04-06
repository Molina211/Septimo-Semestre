# Core Pandas Moves

Los siguientes tres métodos son fundamentales en el trabajo con DataFrames en este curso:

- **df.eval():** realiza cálculos
- **df.query():** encuentra filas
- **df.groupby():** agrupa filas

Primero veremos cada uno por separado y luego los combinaremos.

---
## DataFrame.eval()

El método `eval()` realiza cálculos. Es una forma eficiente de crear nuevas columnas usando fórmulas.

Considera este conjunto de triángulos rectángulos.

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200921.png]]

El primer triángulo tiene base 15 y altura 18.

Ejecuta el siguiente código:

```python
import pandas as pd  
df = pd.read_csv('right-triangles.csv')  
df
```

Resultado:

|     | color  | base | height |
| --- | ------ | ---- | ------ |
| 0   | red    | 15   | 18     |
| 1   | green  | 30   | 10     |
| 2   | yellow | 8    | 5      |
| 3   | orange | 12   | 12     |
| 4   | blue   | 22   | 13     |

Este DataFrame tiene 3 columnas: color, base y height.

La fórmula del área de un triángulo es:

`Área = 1/2 × base × altura`

### Objetivos:

- Evaluar la fórmula
- Crear la columna "area"

```python
df['area'] = df.eval('0.5 * base * height')  
df
```

Resultado:

|     | color  | base | height | area |
| --- | ------ | ---- | ------ | ---- |
| 0   | red    | 15   | 18     | 135  |
| 1   | green  | 30   | 10     | 150  |
| 2   | yellow | 8    | 5      | 20   |
| 3   | orange | 12   | 12     | 72   |
| 4   | blue   | 22   | 13     | 143  |

El triángulo con mayor área es el verde.

---

## DataFrame.query()

El método `query()` permite filtrar filas según una condición.

Ejecuta:

```python
months = pd.read_csv('days-per-month.csv')  
months
```

Resultado:

|     | month     | days | leap_days |
| --- | --------- | ---- | --------- |
| 0   | Jenuary   | 31   | 0         |
| 1   | February  | 28   | 1         |
| 2   | March     | 31   | 0         |
| 3   | April     | 30   | 0         |
| 4   | May       | 31   | 0         |
| ... | ...       | ...  | ...       |
| 7   | August    | 31   | 0         |
| 8   | September | 30   | 0         |
| 9   | October   | 31   | 0         |
| 10  | November  | 30   | 0         |
| 11  | December  | 31   | 0         |

Este dataset muestra los días de cada mes.

---

### Ejemplo: meses con más de 30 días

```python
months.query('days > 30')
```

Resultado:

|     | month    | days | leap_days |
| --- | -------- | ---- | --------- |
| 0   | Jenuary  | 31   | 0         |
| 2   | March    | 31   | 0         |
| 4   | May      | 31   | 0         |
| 6   | July     | 31   | 0         |
| 7   | August   | 31   | 0         |
| 9   | October  | 31   | 0         |
| 11  | December | 31   | 0         |

Hay 7 meses con más de 30 días.

---

### Mes con menos días

```python
months.query('days == days.min()')
```

Resultado:


|     | month    | days | leap_days |
| --- | -------- | ---- | --------- |
| 1   | February | 28   | 1         |

---

## DataFrame.groupby()

El método `groupby()` agrupa filas que comparten un valor.

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329202014.png]]

Luego permite hacer cálculos como:

- `min()`
- `max()`
- `mean()`
- `sum()`

---

### Ejemplo con frutas

```python
df = pd.read_csv('fruit-weights.csv')  
df
```

Resultado:

|     | fruit      | weight |
| --- | ---------- | ------ |
| 0   | strawberry | 10     |
| 1   | banana     | 118    |
| 2   | pineapple  | 800    |
| 3   | strawberry | 11     |
| 4   | strawberry | 12     |
| 5   | pineapple  | 900    |
| 6   | banana     | 124    |
| 7   | strawberry | 13     |
| 8   | strawberry | 11     |
| 9   | banana     | 131    |

---

### Agrupar por tipo de fruta

```python
groups = df.groupby('fruit')  
groups
```

Resultado:

| fruit      | weight |         |
| ---------- | ------ | ------- |
| banana     | ...    | 3 filas |
| pineapple  | ...    | 2 filas |
| strawberry | ...    | 5 filas |

---

### Calcular promedio por grupo

```python
groups['weight'].mean()
```

Resultado:

|            |         |
| ---------- | ------- |
| banana     | 124,333 |
| pineapple  | 850     |
| strawberry | 11,4    |

Esto devuelve una Series.

---

### Convertir a DataFrame

```python
groups = df.groupby('fruit')
series = groups['weight'].mean()  
series.reset_index()
```

Resultado:

|     | fruit      | weight  |
| --- | ---------- | ------- |
| 0   | banana     | 124,333 |
| 1   | pineapple  | 850     |
| 2   | strawberry | 11,4    |

---

### Forma corta (una sola línea)

```python
df.groupby('fruit')['weight'].mean().reset_index()
```

Resultado:

|     | fruit      | weight  |
| --- | ---------- | ------- |
| 0   | banana     | 124,333 |
| 1   | pineapple  | 850     |
| 2   | strawberry | 11,4    |

---
