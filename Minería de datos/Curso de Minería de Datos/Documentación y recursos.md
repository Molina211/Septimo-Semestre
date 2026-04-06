# Documentación y recursos - Sintaxis y estructura

---

## Sintaxis básica de Python

|Concepto|Sintaxis|
|---|---|
|Variable|`nombre = valor`|
|Método|`obj.hacer_algo()`|
|Argumento|`obj.metodo(arg1, arg2)`|
|Argumento nombrado|`obj.metodo(nombre=valor)`|
|Comentario|`# esto es un comentario`|
|Imprimir|`print('texto')`|

---

## Tipos de datos

|Concepto|Sintaxis|
|---|---|
|Entero positivo|`42`|
|Entero negativo|`-42`|
|Flotante|`3.14`|
|String|`'hola'`|
|String con apóstrofe|`"It's text!"`|
|Booleano verdadero|`True`|
|Booleano falso|`False`|
|Lista|`[0, 1, 2]`|
|Diccionario|`{'e': 2.718, 'pi': 3.14}`|
|Sin valor|`None`|

---

## Comparaciones

|Concepto|Sintaxis|
|---|---|
|¿Es igual?|`valor == 42`|
|¿No es igual?|`valor != 42`|
|¿Mayor que?|`valor > 42`|
|¿Mayor o igual?|`valor >= 42`|
|¿Menor que?|`valor < 42`|
|¿Menor o igual?|`valor <= 42`|

---

## Objetos

|Concepto|Sintaxis|
|---|---|
|Crear objeto|`obj = AlgunaClase()`|
|Primer elemento|`obj[0]`|
|Segundo elemento|`obj[1]`|
|Elemento por nombre|`obj['nombre']`|
|Propiedad|`obj.propiedad`|
|Llamar método|`obj.metodo()`|

---

## Librerías

|Concepto|Sintaxis|
|---|---|
|Importar librería|`import libreria`|
|Con alias|`import libreria as lib`|
|Pandas|`import pandas as pd`|
|Matplotlib|`import matplotlib.pyplot as plt`|

---

# Pandas — DataFrame

---

## `eval()`

Evalúa una expresión string sobre las columnas del DataFrame.

**Sintaxis:** `df.eval('expresión')`

```python
# Operación aritmética
df.eval('total = precio * cantidad')
df.eval('ganancia = ventas - costos')

# Filtro condicional
df.eval('descuento > 0.2 and ventas > 1000')

# Nuevo valor inplace
df.eval('impuesto = precio * 0.19', inplace=True)
```

---

## `query()`

Filtra filas usando una expresión string como condición.

**Sintaxis:** `df.query('condición')`

```python
# Condición simple
df.query('edad > 30')
df.query('ciudad == "Bogotá"')

# Variable externa con @
umbral = 100
df.query('ventas > @umbral')

# Condición múltiple
df.query('edad > 25 and salario < 3000000')
```

---

## `groupby()`

Agrupa filas por una o más columnas para aplicar funciones de agregación.

**Sintaxis:** `df.groupby('col').func()`

```python
# Suma por grupo
df.groupby('ciudad')['ventas'].sum()

# Múltiples funciones
df.groupby('producto').agg({'ventas': 'sum', 'precio': 'mean'})

# Agrupar por varias columnas
df.groupby(['region', 'mes'])['ingresos'].mean()

# Contar por grupo
df.groupby('categoria').size()
```

---

## `merge()`

Une dos DataFrames como un JOIN de base de datos.

**Sintaxis:** `df.merge(otro, on='col', how='inner')`

```python
# Inner join (intersección)
clientes.merge(compras, on='cliente_id')

# Left join (todos del izquierdo)
df1.merge(df2, on='id', how='left')

# Columnas con nombres distintos
df1.merge(df2, left_on='cod', right_on='codigo')
```

---

## `pd.concat()`

Concatena DataFrames a lo largo de un eje (filas o columnas).

**Sintaxis:** `pd.concat([df1, df2], axis=0)`

```python
# Unir filas (apilar)
pd.concat([enero, febrero, marzo], ignore_index=True)

# Unir columnas
pd.concat([df_a, df_b], axis=1)
```

---

## `astype()`

Convierte el tipo de dato de una columna.

**Sintaxis:** `df['col'].astype(tipo)`

```python
# Texto a número
df['precio'] = df['precio'].astype(float)
df['edad'] = df['edad'].astype(int)

# A string
df['codigo'] = df['codigo'].astype(str)

# A categoría (eficiente en memoria)
df['ciudad'] = df['ciudad'].astype('category')
```

---

## `df[column]`

Selecciona una o varias columnas del DataFrame.

**Sintaxis:** `df['col']` / `df[['col1', 'col2']]`

```python
# Una columna → Serie
df['nombre']

# Varias columnas → DataFrame
df[['nombre', 'salario', 'ciudad']]
```

---

## `df[filter]`

Filtra filas usando una condición booleana.

**Sintaxis:** `df[df['col'] > valor]`

```python
# Condición simple
df[df['edad'] >= 18]

# Condición múltiple
df[(df['edad'] > 25) & (df['ciudad'] == 'Cali')]

# Usando isin()
df[df['pais'].isin(['Colombia', 'México', 'Perú'])]
```

---

## `drop()`

Elimina filas o columnas del DataFrame.

**Sintaxis:** `df.drop('col', axis=1)`

```python
# Eliminar columna
df.drop('columna_inutil', axis=1)

# Eliminar varias columnas
df.drop(['col1', 'col2'], axis=1)

# Eliminar filas por índice
df.drop([0, 5, 10], axis=0)
```

---

## `dropna()`

Elimina filas (o columnas) que contengan valores NaN.

**Sintaxis:** `df.dropna()`

```python
# Eliminar filas con algún NaN
df.dropna()

# Solo si todas son NaN
df.dropna(how='all')

# Solo columnas específicas
df.dropna(subset=['email', 'telefono'])
```

---

## `head()`

Muestra las primeras N filas del DataFrame.

**Sintaxis:** `df.head(n=5)`

```python
df.head()     # primeras 5 filas
df.head(10)   # primeras 10 filas
```

---

## `iloc[]`

Selecciona filas y columnas por posición numérica.

**Sintaxis:** `df.iloc[fila, columna]`

```python
df.iloc[0]          # primera fila
df.iloc[-1]         # última fila
df.iloc[0:5]        # primeras 5 filas
df.iloc[2, 3]       # fila 2, columna 3
df.iloc[[0,2,4], [1,3]]  # filas y columnas específicas
```

---

## `index`

Propiedad que devuelve el índice del DataFrame.

**Sintaxis:** `df.index`

```python
df.index            # RangeIndex(0, 100, step=1)
list(df.index)      # [0, 1, 2, ...]
```

---

## `info()`

Muestra un resumen del DataFrame: tipos, valores no nulos, memoria.

**Sintaxis:** `df.info()`

```python
df.info()
# <class 'pandas.core.frame.DataFrame'>
# RangeIndex: 500 entries, 0 to 499
# Data columns: nombre, edad, ciudad...
```

---

## `isna()`

Retorna un DataFrame booleano indicando cuáles valores son NaN.

**Sintaxis:** `df.isna()`

```python
df.isna()                    # mapa de nulos
df.isna().sum()              # contar nulos por columna
df.isna().mean() * 100       # porcentaje de nulos
```

---

## `iterrows()`

Itera sobre las filas como pares (índice, Serie). Útil pero lento en DataFrames grandes.

**Sintaxis:** `for i, row in df.iterrows():`

```python
# Iterar e imprimir
for i, row in df.iterrows():
    print(i, row['nombre'], row['edad'])

# Construir lista desde filas
resultados = []
for _, row in df.iterrows():
    resultados.append(row['a'] + row['b'])
```

---

## `loc[]`

Selecciona filas y columnas por etiqueta (nombre de índice o columna).

**Sintaxis:** `df.loc[indice, 'columna']`

```python
df.loc[5]                              # fila con índice 5
df.loc['2024-01-01']                   # índice de fecha
df.loc[df['edad'] > 30, 'nombre']      # filtro + columna
df.loc[df['activo'] == False, 'salario'] = 0  # asignar valor
```

---

## `max()`

Devuelve el valor máximo de una columna o de todo el DataFrame.

**Sintaxis:** `df['col'].max()`

```python
df['precio'].max()
df[['precio', 'cantidad']].max()
df.loc[df['ventas'].idxmax()]          # fila con valor máximo
```

---

## `mean()`

Calcula el promedio de valores numéricos.

**Sintaxis:** `df['col'].mean()`

```python
df['salario'].mean()
df.mean(numeric_only=True)
df.groupby('departamento')['salario'].mean()
```

---

## `median()`

Calcula la mediana (valor central) de una columna.

**Sintaxis:** `df['col'].median()`

```python
df['precio'].median()
df.groupby('ciudad')['ingreso'].median()
```

---

## `min()`

Devuelve el valor mínimo de una columna.

**Sintaxis:** `df['col'].min()`

```python
df['temperatura'].min()
df.loc[df['precio'].idxmin()]          # fila con valor mínimo
```

---

## `read_csv()`

Lee un archivo CSV y lo convierte en un DataFrame.

**Sintaxis:** `pd.read_csv('archivo.csv')`

```python
# Lectura básica
df = pd.read_csv('datos.csv')

# Con separador y encoding
df = pd.read_csv('datos.csv', sep=';', encoding='utf-8')

# Columna como índice
df = pd.read_csv('datos.csv', index_col='fecha')

# Solo algunas columnas
df = pd.read_csv('datos.csv', usecols=['id', 'nombre', 'valor'])
```

---

## `reindex()`

Reorganiza el DataFrame según un nuevo orden de índices.

**Sintaxis:** `df.reindex([nuevo_orden])`

```python
df.reindex([3, 1, 0, 2])
df.reindex([0,1,2,3,4,5], fill_value=0)
```

---

## `rename()`

Renombra columnas o índices del DataFrame.

**Sintaxis:** `df.rename(columns={'viejo': 'nuevo'})`

```python
df.rename(columns={'name': 'nombre', 'age': 'edad'})
df.rename(columns=str.lower)
df.rename(index={0: 'primero', 1: 'segundo'})
```

---

## `reset_index()`

Restablece el índice a números consecutivos 0, 1, 2, ...

**Sintaxis:** `df.reset_index(drop=True)`

```python
df.reset_index(drop=True)
resultado = df[df['activo'] == True].reset_index(drop=True)
```

---

## `round()`

Redondea valores numéricos a N decimales.

**Sintaxis:** `df.round(decimales)`

```python
df['precio'] = df['precio'].round(2)
df.round(0)
df.round({'precio': 2, 'porcentaje': 4})
```

---

## `set_index()`

Establece una columna como índice del DataFrame.

**Sintaxis:** `df.set_index('col')`

```python
df.set_index('fecha')
df.set_index(['año', 'mes'])          # MultiIndex
df.set_index('id', inplace=True)
```

---

## `shape`

Propiedad que retorna (número de filas, número de columnas).

**Sintaxis:** `df.shape`

```python
df.shape                       # (1500, 8)
n_filas, n_cols = df.shape
```

---

## `sort_index()`

Ordena el DataFrame por su índice.

**Sintaxis:** `df.sort_index()`

```python
df.sort_index()
df.sort_index(ascending=False)
```

---

## `sort_values()`

Ordena el DataFrame por los valores de una o varias columnas.

**Sintaxis:** `df.sort_values('col')`

```python
df.sort_values('precio')
df.sort_values('precio', ascending=False)
df.sort_values(['ciudad', 'edad'])
df.sort_values(['ventas', 'precio'], ascending=[False, True])
```

---

## `sum()`

Suma los valores de una columna o de todo el DataFrame.

**Sintaxis:** `df['col'].sum()`

```python
df['ventas'].sum()
df.groupby('producto')['cantidad'].sum()
df.sum(numeric_only=True)
```

---

## `tail()`

Muestra las últimas N filas del DataFrame.

**Sintaxis:** `df.tail(n=5)`

```python
df.tail()      # últimas 5 filas
df.tail(3)     # últimas 3 filas
```

---

## `to_datetime()`

Convierte una columna de texto a tipo fecha (datetime).

**Sintaxis:** `pd.to_datetime(serie)`

```python
df['fecha'] = pd.to_datetime(df['fecha'])
df['fecha'] = pd.to_datetime(df['fecha'], format='%d/%m/%Y')
df['año'] = df['fecha'].dt.year
df['mes'] = df['fecha'].dt.month
```

---

# Pandas — Series

---

## `series.plot`

Genera gráficas directamente desde una Serie de pandas.

**Sintaxis:** `serie.plot(kind='line')`

```python
df['ventas'].plot(kind='line', title='Ventas')
df['edad'].plot(kind='hist', bins=20)
df.groupby('ciudad')['ventas'].sum().plot(kind='bar')
```

---

## `str.split()`

Divide strings en partes usando un separador.

**Sintaxis:** `serie.str.split('sep')`

```python
df['nombre_completo'].str.split(' ')
# ['Juan', 'Pérez']

df[['nombre', 'apellido']] = df['nombre_completo'].str.split(' ', expand=True)

df['nombre_completo'].str.split(',').str[0]
```

---

## `dt.strftime()`

Formatea fechas como string según un patrón.

**Sintaxis:** `serie.dt.strftime('%Y-%m-%d')`

```python
df['fecha'].dt.strftime('%d/%m/%Y')     # '15/03/2024'
df['fecha'].dt.strftime('%B %Y')        # 'March 2024'
df['fecha'].dt.strftime('%Y-%m-%d %H:%M')
```

---

## `total_seconds()`

Convierte un timedelta a segundos totales.

**Sintaxis:** `timedelta.total_seconds()`

```python
df['duracion'] = (df['fin'] - df['inicio']).dt.total_seconds()
df['minutos'] = (df['fin'] - df['inicio']).dt.total_seconds() / 60
```

---

## `value_counts()`

Cuenta las ocurrencias únicas de cada valor en una Serie.

**Sintaxis:** `serie.value_counts()`

```python
df['ciudad'].value_counts()
df['categoria'].value_counts(normalize=True) * 100
df['estado'].value_counts(dropna=False)
```

---

# Matplotlib

---

## `bar()`

Crea un gráfico de barras verticales.

**Sintaxis:** `plt.bar(x, altura)`

```python
# Barras simples
plt.bar(['A', 'B', 'C'], [10, 25, 15])
plt.title('Comparación')
plt.show()

# Con color y ancho
plt.bar(meses, ventas, color='steelblue', width=0.6)

# Barras agrupadas
x = np.arange(len(categorias))
plt.bar(x - 0.2, valores_2023, width=0.4, label='2023')
plt.bar(x + 0.2, valores_2024, width=0.4, label='2024')
plt.xticks(x, categorias)
plt.legend()
```

---

## `barh()`

Crea un gráfico de barras horizontales.

**Sintaxis:** `plt.barh(y, ancho)`

```python
plt.barh(['Producto A', 'Producto B', 'Producto C'], [30, 45, 20])
plt.xlabel('Ventas')
plt.show()

# Ordenadas
df_sorted = df.sort_values('ventas')
plt.barh(df_sorted['nombre'], df_sorted['ventas'])
```

---

## `plot()`

Dibuja líneas. Función más básica y flexible de matplotlib.

**Sintaxis:** `plt.plot(x, y)`

```python
# Línea simple
plt.plot([1, 2, 3, 4], [10, 20, 15, 30])
plt.show()

# Con estilo y marcadores
plt.plot(fechas, valores, color='teal', linestyle='--', marker='o', label='Ventas')
plt.legend()

# Múltiples líneas
plt.plot(x, y1, label='Línea 1')
plt.plot(x, y2, label='Línea 2')
plt.legend()
```

---

## `scatter()`

Crea un gráfico de dispersión (puntos).

**Sintaxis:** `plt.scatter(x, y)`

```python
# Dispersión básica
plt.scatter(df['peso'], df['altura'])
plt.xlabel('Peso (kg)')
plt.ylabel('Altura (cm)')
plt.show()

# Con color y tamaño variable
plt.scatter(x, y, c=colores, s=tamaños, alpha=0.6, cmap='viridis')
```

---

## `axhline()`

Dibuja una línea horizontal en el gráfico.

**Sintaxis:** `plt.axhline(y=valor)`

```python
plt.axhline(y=0, color='black', linewidth=0.8)
plt.axhline(y=df['ventas'].mean(), color='red', linestyle='--', label='Promedio')
```

---

## `axvline()`

Dibuja una línea vertical en el gráfico.

**Sintaxis:** `plt.axvline(x=valor)`

```python
plt.axvline(x='2024-01-01', color='gray', linestyle='--', label='Inicio 2024')
```

---

## `axvspan()`

Dibuja un área sombreada entre dos valores en el eje X.

**Sintaxis:** `plt.axvspan(xmin, xmax)`

```python
plt.axvspan('2024-03-01', '2024-06-30', alpha=0.2, color='yellow', label='Q1')
```

---

## `gca()`

Obtiene el eje (Axes) activo del gráfico actual. Permite personalización avanzada.

**Sintaxis:** `ax = plt.gca()`

```python
ax = plt.gca()
ax.set_facecolor('#f0f0f0')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
```

---

## `grid()`

Activa o configura la cuadrícula del gráfico.

**Sintaxis:** `plt.grid(True)`

```python
plt.grid(True)
plt.grid(axis='y', linestyle='--', alpha=0.5)
```

---

## `set_aspect()`

Define la relación de aspecto entre los ejes.

**Sintaxis:** `ax.set_aspect('equal')`

```python
ax = plt.gca()
ax.set_aspect('equal')
```

---

## `show()`

Muestra el gráfico en pantalla. Se llama al final.

**Sintaxis:** `plt.show()`

```python
plt.plot(x, y)
plt.title('Mi gráfica')
plt.show()
```

---

## `text()`

Agrega texto en coordenadas específicas del gráfico.

**Sintaxis:** `plt.text(x, y, 'texto')`

```python
plt.text(3, 25, 'Máximo', fontsize=10, color='red')

# Etiquetar todas las barras
for i, val in enumerate(valores):
    plt.text(i, val + 0.5, str(val), ha='center')
```

---

## `title()`

Agrega un título al gráfico.

**Sintaxis:** `plt.title('texto')`

```python
plt.title('Ventas 2024')
plt.title('Ventas 2024', fontsize=16, fontweight='bold', pad=15)
```

---

## `xlabel()` / `ylabel()`

Agregan etiqueta al eje X o al eje Y.

**Sintaxis:** `plt.xlabel('etiqueta')`

```python
plt.xlabel('Mes')
plt.ylabel('Ventas (USD)')
```

---

## `xlim()` / `ylim()`

Establecen el rango de valores visibles en cada eje.

**Sintaxis:** `plt.xlim(min, max)`

```python
plt.xlim(0, 100)
plt.ylim(0, 500)
```

---

## `xticks()` / `yticks()`

Configuran las marcas y etiquetas de los ejes.

**Sintaxis:** `plt.xticks(valores, etiquetas)`

```python
plt.xticks([0, 1, 2, 3], ['Ene', 'Feb', 'Mar', 'Abr'])
plt.xticks(rotation=45, ha='right')
plt.yticks([0, 500000, 1000000], ['0', '500K', '1M'])
```

---