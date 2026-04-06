# Our World Connected

La tecnología de Cisco forma la columna vertebral de Internet, conectando al mundo como una comunidad global.

En este proyecto, explorarás el rápido crecimiento de Internet y evaluarás qué tan cerca estamos de un mundo completamente conectado.

---

## Usuarios de Internet en el mundo

El archivo 'world-internet-users.csv' proporciona el número de usuarios de Internet por año.  
Aquí, un usuario se define como alguien que ha accedido a Internet en los últimos tres meses.

Carga los datos y obsérvalos.

### Objetivos:

- Importar pandas y matplotlib
- Cargar los datos
- Mostrar el DataFrame

```python
import pandas as pd  
import matplotlib.pyplot as plt  
internet = pd.read_csv('world-internet-users.csv')  
internet
```

Resultado:

|     | year | internet_users |
| --- | ---- | -------------- |
| 0   | 1990 | 3000000        |
| 1   | 1991 | 4000000        |
| 2   | 1992 | 7000000        |
| ... | ...  | ...            |
| 32  | 2022 | 5300000000     |
| 33  | 2023 | 5400000000     |
| 34  | 2024 | 5450000000     |

Hay 35 filas, que representan los años de 1990 a 2024.

En 1990 había solo 3 millones de usuarios.

---

## ¿Cuándo se superaron los 100 millones?

Usamos `query()`:

### Objetivos:

- Filtrar donde internet_users > 100 millones
- Mostrar el primer resultado

```python
exceeds_100M = internet.query('internet_users > 100e6')  
exceeds_100M.head(1)
```

Resultado:

|     | year | internet_users |
| --- | ---- | -------------- |
| 7   | 1997 | 120000000      |

En 1997 se superaron los 100 millones de usuarios.

---

## Datos de población mundial

Archivo: 'historical-world-population.csv'

### Objetivos:

- Cargar datos
- Mostrar DataFrame

```python
population = pd.read_csv('historical-world-population.csv')  
population
```

Resultado:

|     | year   | internet_users |
| --- | ------ | -------------- |
| 0   | -10000 | 4501152        |
| 1   | -9000  | 5687125        |
| 2   | -8000  | 7314623        |
| ... | ...    | ...            |
| 122 | 2020   | 7887001284     |
| 123 | 2021   | 7954448405     |
| 124 | 2022   | 8021407170     |

Los datos llegan hasta el año 10,000 a.C.

---

## Unir los datos (merge)

Usamos un left merge por la columna `year`.

### Objetivos:

- Unir internet y population
- Usar left merge

```python
df = internet.merge(population, on='year', how='left')  
df
```

Resultado:

|     | year | internet_users | population |
| --- | ---- | -------------- | ---------- |
| 0   | 1990 | 3000000        | 5327803075 |
| 1   | 1991 | 4000000        | 5418735879 |
| 2   | 1992 | 7000000        | 5505989821 |
| ... | ...  | ...            | ...        |
| 32  | 2022 | 5300000000     | 8021407170 |
| 33  | 2023 | 5400000000     | NaN        |
| 34  | 2024 | 5450000000     | NaN        |

NaN significa “dato faltante”.

---

## Eliminar valores faltantes

```python
df = df.dropna()  
df
```

Resultado: 33 filas válidas.

|     | year | internet_users | population |
| --- | ---- | -------------- | ---------- |
| 0   | 1990 | 3000000        | 5327803075 |
| 1   | 1991 | 4000000        | 5418735879 |
| 2   | 1992 | 7000000        | 5505989821 |
| ... | ...  | ...            | ...        |
| 30  | 2020 | 4700000000     | 7887001284 |
| 31  | 2021 | 4901000000     | 7954448405 |
| 32  | 2022 | 5300000000     | 8021407170 |

---

## Porcentaje de población conectada

Calculamos el porcentaje:

### Objetivos:

- Calcular porcentaje
- Redondear a 2 decimales

```python
df['percent'] = df.eval('internet_users/population * 100')  
df['percent'] = df['percent'].round(2)  
df
```

Resultado:

|     | year | internet_users | population | percent |
| --- | ---- | -------------- | ---------- | ------- |
| 0   | 1990 | 3000000        | 5327803075 | 0,06    |
| 1   | 1991 | 4000000        | 5418735879 | 0,07    |
| 2   | 1992 | 7000000        | 5505989821 | 0,13    |
| ... | ...  | ...            | ...        | ...     |
| 30  | 2020 | 4700000000     | 7887001284 | 59.59   |
| 31  | 2021 | 4901000000     | 7954448405 | 61.61   |
| 32  | 2022 | 5300000000     | 8021407170 | 66.07   |

En 1990 menos del 0.1% usaba Internet  
En 2022 más del 65%

---

## ¿Cuándo se superó el 50%?

Graficamos:

### Objetivos:

- Graficar porcentaje
- Línea horizontal en 50%
- Etiquetas

```python
plt.plot(df['year'], df['percent'])  
plt.axhline(50, color='gray', linestyle='--')  
plt.xlabel('Year')  
plt.ylabel('Percent Connected')
```

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Our World Connected/ANEXOS/Pasted image 20260330140414.png]]

La línea azul cruza el 50% alrededor de 2020.

---

## Encontrar el año exacto

```python
over_half_connected = df.query('percent >= 50')  
over_half_connected.head(1)
```

Resultado:

|     | year | internet_users | population | percent |
| --- | ---- | -------------- | ---------- | ------- |
| 29  | 2019 | 4194000000     | 7811293714 | 53,69   |

El primer año en superar el 50% fue 2019.

---