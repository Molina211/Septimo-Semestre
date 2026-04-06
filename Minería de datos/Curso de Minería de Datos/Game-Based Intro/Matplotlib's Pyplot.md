# Matplotlib's Pyplot

Matplotlib.pyplot es la librería principal de Python para visualización de datos. ¿Listo para convertir datos en gráficos? ¡Vamos a empezar!

---

## Importar Matplotlib

El módulo pyplot de Matplotlib normalmente se importa con el alias plt.

### Objetivos:

- Importar matplotlib
- Usar plt como alias

```python
import matplotlib.pyplot as plt
```

Con Matplotlib importado, tenemos acceso a un potente conjunto de herramientas de gráficos.

---

## Graficar datos

La mayoría de los métodos de graficación reciben valores **x** y **y** como argumentos principales.

### Objetivos:

- Definir valores x e y
- Graficarlos
- Mostrar el gráfico

```python
x = [1,2,3,4,5,6]  
y = [1,8,1,8,1,8]  
plt.plot(x, y)  
plt.show()
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200053.png]]

¡Nuestro primer gráfico!

---

## Mostrar o no mostrar

En el ejemplo anterior usamos `plt.show()` para mostrar el gráfico.

Sin embargo, muchos entornos de notebooks lo ejecutan automáticamente al final.

Por simplicidad, a veces se omite:

```python
x = [0, 50, 100]  
y = [10, 1, 4]  
plt.plot(x, y, color='red')
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200122.png]]

---

## Los 4 gráficos básicos

En este curso se usan principalmente estos tipos:

### 1. Gráfico de líneas

```python
a = [1, 2, 3, 4]  
b = [1, 4, 3, 4]  
plt.plot(a, b)
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200234.png]]
### 2. Gráfico de barras

```python
a = ['A','B','C']  
b = [4, 1, 2]  
plt.bar(a, b)
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200242.png]]
### 3. Gráfico de barras horizontal

```python
a = ['A','B','C']  
b = [4, 1, 2]  
plt.barh(a, b)
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200251.png]]
### 4. Gráfico de dispersión (scatter)

```python
a = [1, 2, 3, 4]  
b = [1, 4, 3, 4]  
plt.scatter(a, b)
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200304.png]]

Estos gráficos son la base para muchas visualizaciones de datos.

---

## Graficar DataFrames

Matplotlib se integra fácilmente con Pandas.

Primero cargamos los datos:

### Objetivos:

- Importar pandas
- Cargar el archivo
- Mostrarlo

```python
import pandas as pd  
df = pd.read_csv('earth-layers.csv')  
df
```

Resultado:

|     | layer      | thickness |
| --- | ---------- | --------- |
| 0   | crust      | 40        |
| 1   | mantle     | 2900      |
| 2   | outer core | 2200      |
| 3   | inner core | 1230      |

---

## Gráfico de barras con DataFrame

Usamos columnas del DataFrame:

### Objetivos:

- x → nombres de capas
- y → grosor
- Crear gráfico

```python
x = df['layer']  
y = df['thickness']  
plt.bar(x, y)
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200506.png]]

Este gráfico muestra que la corteza (crust) es mucho más delgada que las demás capas.

---

## Etiquetas y títulos

Podemos agregar información al gráfico:

### Objetivos:

- Etiqueta del eje Y
- Título

```python
plt.bar(df['layer'], df['thickness'])  
plt.ylabel('Thickness (km)')  
plt.title('Layers of the Earth')
```

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329200532.png]]

---

## Nota importante

No siempre es necesario usar variables.  
Podemos pasar directamente las columnas del DataFrame al método `bar()`.