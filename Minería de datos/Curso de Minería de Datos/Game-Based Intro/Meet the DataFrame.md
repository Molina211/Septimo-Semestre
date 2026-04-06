# Meet the DataFrame

Aprendimos a usar librerías de Python lanzando un cohete

Ahora exploraremos la popular librería de ciencia de datos llamada Pandas.

---

## La librería Pandas

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329184216.png]]

La librería Pandas contiene varios objetos de Python. Aquí tienes descripciones breves de los que usaremos:

- **DataFrame:** Estructura de datos en 2 dimensiones (filas y columnas).
- **Series:** Estructura de datos en 1 dimensión.
- **read_csv():** Función para cargar archivos CSV como dataframes.
- **y más…** Pandas tiene muchas más funcionalidades.

El DataFrame es el protagonista principal. Es la estructura más utilizada en el mundo de la ciencia de datos en Python.

---

## Crear un DataFrame

Apliquemos lo aprendido para importar Pandas y crear un DataFrame.  
Nota: el alias estándar de Pandas es pd.

### Objetivos:

- Importar pandas
- Crear un DataFrame

```python
import pandas as pd  
pd.DataFrame()
```

Resultado:

Empty DataFrame
0 Rows × 0 Columns

¡Ya tenemos nuestro primer DataFrame!  
Pero está vacío… 😅

---

## Agregar datos al DataFrame

Supongamos que tenemos estos datos:

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329190608.png]]

- Colores: azul, rojo, amarillo, verde
- Radios: 2, 4, 3, 5

Vamos a agregarlos como columnas:

### Objetivos:

- Crear columna "color"
- Crear columna "radius"

```python
df = pd.DataFrame()  
df['color'] = ['blue','red','yellow','green']  
df['radius'] = [2,4,3,5]  
df
```

Resultado:

|     | color  | radius |
| --- | ------ | ------ |
| 0   | blue   | 2      |
| 1   | red    | 4      |
| 2   | yellow | 3      |
| 3   | green  | 5      |

¡Perfecto! Ahora tenemos 4 filas y 2 columnas.

---

## Cálculos en columnas

Podemos crear nuevas columnas fácilmente.

Ejemplo: calcular el diámetro = radio × 2

### Objetivos:

- Crear columna "diameter"

```python
df['diameter'] = df['radius'] * 2  
df
```

Resultado:

|     | color  | diameter |
| --- | ------ | -------- |
| 0   | blue   | 4        |
| 1   | red    | 8        |
| 2   | yellow | 6        |
| 3   | green  | 10       |

Esto muestra el poder de los DataFrames

---
## Cálculos resumen en columnas

Pandas permite hacer cálculos rápidos:

- **Radio más pequeño:**

```python
df['radius'].min()
```

Resultado: `2`

- **Suma de diámetros:**

```python
df['diameter'].sum()
```

Resultado: `28`

- **Promedio de radios:**

```python
df['radius'].mean()
```

Resultado: `3.5`

---

## Columnas como Series

Para acceder a una columna usamos:

```python
df['nombre_columna']
```

Ejemplo:

```python
df['color']
```

Resultado:

|     |        |
| --- | ------ |
| 0   | blue   |
| 1   | red    |
| 2   | yellow |
| 3   | green  |


Esto devuelve una Series, es decir, una estructura de datos en 1 dimensión.

---

## Filas como Series

También podemos acceder a filas usando:

```python
df.iloc[indice]
```

- `iloc` significa posición entera
- Empieza en 0
- Se pueden usar índices negativos

Ejemplo:

```python
df.iloc[0] # primera fila
df.iloc[1] # segunda fila
df.iloc[-1] # última fila
```

---

## Otras partes del DataFrame

Un DataFrame también tiene:

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329194326.png]]

- **df.index** → etiquetas de filas
- **df.columns** → nombres de columnas
- **df.shape** → tamaño (filas, columnas)

Ejemplo:

```python
df.shape
```

Resultado:

```python
(4, 3)
```

- Número de filas:

```python
df.shape[0]  # 4
```

- Número de columnas:

```python
df.shape[1]  # 3
```

---

## Cargar datos desde archivos

Pandas puede leer varios formatos:

- CSV
- JSON
- Excel
- XML

El formato CSV (valores separados por comas) es el más común.

---
### Ejemplo de archivo CSV

**earth-layers.csv**

`layer,thickness`
`crust,40`
`mantle,2900`
`outer core,2200`
`inner core,1230`

**README.md**

- Dataset sobre las capas de la Tierra
- `layer`: nombre de la capa
- `thickness`: grosor en kilómetros

---

## Leer un archivo CSV

Supongamos un archivo llamado `earth-layers.csv` con información sobre las capas de la Tierra.

### Objetivos:

- Leer el archivo
- Guardarlo en una variable llamada `layers`

```python
layers = pd.read_csv('earth-layers.csv')  
layers
```

Resultado:

|     | layer      | thickness |
| --- | ---------- | --------- |
| 0   | crust      | 40        |
| 1   | mantle     | 2900      |
| 2   | outer core | 2200      |
| 3   | inner core | 1230      |

---

## Cálculos con datos reales

Podemos sumar el grosor de todas las capas:

```python
layers['thickness'].sum()
```

Resultado:

```python
6370
```

Esto representa aproximadamente el radio de la Tierra (6370 km)

