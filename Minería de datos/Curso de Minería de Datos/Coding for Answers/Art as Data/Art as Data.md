# Art as Data

Piet Mondrian fue un artista neerlandés conocido por sus diseños en forma de cuadrícula durante las décadas de 1920 y 1930. Mondrian formó parte de un movimiento de arte abstracto que buscaba la simplicidad utilizando solo colores y formas básicas.

Observa la siguiente pintura, que recientemente se vendió por 51 millones de dólares:

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Art as Data/ANEXOS/Pasted image 20260330141242.png]]

¿Cómo podríamos representar las características de esta pintura usando datos tabulares?

---

Una forma es la siguiente:

Esta tabla representa las características de la pintura usando 12 filas de datos.

| feature | x   | y   | width | height | color  |
| ------- | --- | --- | ----- | ------ | ------ |
| rect    | 0   | 0   | 121   | 152    | white  |
| rect    | 132 | 0   | 378   | 365    | red    |
| rect    | 0   | 173 | 121   | 192    | white  |
| rect    | 0   | 377 | 121   | 133    | blue   |
| rect    | 132 | 377 | 335   | 133    | white  |
| rect    | 479 | 377 | 31    | 59     | white  |
| rect    | 479 | 451 | 31    | 59     | yellow |
| h-line  | 0   | 365 | 510   | 12     | black  |
| v-line  | 121 | 0   | 11    | 510    | black  |
| v-line  | 467 | 377 | 12    | 133    | black  |
| h-line  | 0   | 152 | 121   | 21     | black  |
| h-line  | 479 | 436 | 31    | 15     | black  |

Cada fila representa una forma rectangular con coordenadas (x, y), tamaño y color.

Al representar el arte como datos, abrimos el análisis artístico a técnicas de ciencia de datos.

En este proyecto exploraremos la  búsqueda de simplicidad de Mondrian e intentaremos detectar pinturas falsas.

---

## Cargando los datos

El archivo 'mondrian-painting-features.csv' contiene características digitalizadas de 136 pinturas de Mondrian entre 1920 y 1940.

### Objetivos:

- Importar pandas
- Cargar los datos
- Mostrar el DataFrame

```python
import pandas as pd  
features = pd.read_csv('mondrian-painting-features.csv')  
features
```

Resultado: 3204 filas × 8 columnas.

|      | painting_id | feature | x   | y   | width | height | color | rgb     |
| ---- | ----------- | ------- | --- | --- | ----- | ------ | ----- | ------- |
| 0    | b104        | rect    | 0   | 0   | 146   | 13     | white | #ced2ca |
| 1    | b104        | rect    | 151 | 0   | 576   | 13     | gray  | #a4a7a7 |
| 2    | b104        | rect    | 732 | 0   | 278   | 129    | gray  | #c8c9c7 |
| 3    | b104        | rect    | 0   | 18  | 146   | 468    | white | #cfd0ce |
| 4    | b104        | rect    | 151 | 18  | 107   | 111    | black | #151d16 |
| ...  | ...         | ...     | ... | ... | ...   | ...    | ...   | ...     |
| 3199 | b296        | v-line  | 620 | 0   | 19    | 825    | black | #000000 |
| 3200 | b296        | v-line  | 49  | 508 | 19    | 79     | black | #000000 |
| 3201 | b296        | h-line  | 0   | 268 | 711   | 19     | black | #000000 |
| 3202 | b296        | h-line  | 0   | 489 | 711   | 19     | black | #000000 |
| 3203 | b296        | h-line  | 0   | 679 | 11    | 28     | black | #000000 |

La primera pintura tiene ID b104.  
Hay múltiples filas con ese mismo ID.

### Objetivo:

- Filtrar las características de b104

```python
features.query('painting_id == "b104"')
```

La pintura b104 tiene 41 características.

|     | painting_id | feature | x   | y   | width | height | color | rgb     |
| --- | ----------- | ------- | --- | --- | ----- | ------ | ----- | ------- |
| 0   | b104        | rect    | 0   | 0   | 146   | 13     | white | #ced2ca |
| 1   | b104        | rect    | 151 | 0   | 576   | 13     | gray  | #a4a7a7 |
| 2   | b104        | rect    | 732 | 0   | 278   | 129    | gray  | #c8c9c7 |
| 3   | b104        | rect    | 0   | 18  | 146   | 468    | white | #cfd0ce |
| 4   | b104        | rect    | 151 | 18  | 107   | 111    | black | #151d16 |
| ... | ...         | ...     | ... | ... | ...   | ...    | ...   | ...     |
| 36  | b104        | v-line  | 727 | 0   | 5     | 1007   | black | #000000 |
| 37  | b104        | v-line  | 258 | 18  | 5     | 111    | black | #000000 |
| 38  | b104        | v-line  | 531 | 134 | 5     | 809    | black | #000000 |
| 39  | b104        | v-line  | 944 | 134 | 5     | 873    | black | #000000 |
| 40  | b104        | v-line  | 258 | 282 | 5     | 725    | black | #000000 |


---

## Información adicional de pinturas

Archivo: 'mondrian-painting-info.csv'

### Objetivos:

- Cargar datos
- Mostrar DataFrame

```python
painting_info = pd.read_csv('mondrian-painting-info.csv')  
painting_info
```

Cada fila representa una pintura.  
b104 fue pintada en 1920.

| ID  | painting_id | year | title                                  | width | height |
| --- | ----------- | ---- | -------------------------------------- | ----- | ------ |
| 0   | b104        | 1920 | No. VI                                 | 1010  | 1007   |
| 1   | b105        | 1920 | Composition A                          | 918   | 900    |
| 2   | b106        | 1920 | Composition B                          | 575   | 677    |
| 3   | b107        | 1920 | Composition C                          | 610   | 603    |
| 4   | b108        | 1920 | Composition I                          | 646   | 750    |
| ... | ...         | ...  | ...                                    | ...   | ...    |
| 131 | b292        | 1939 | Composition no. 1                      | 1023  | 1052   |
| 132 | b293        | 1939 | Composition of red, blue and white: II | 330   | 435    |
| 133 | b294        | 1939 | Trafalgar Square                       | 1200  | 1452   |
| 134 | b295        | 1939 | Composition no. 8                      | 681   | 752    |
| 135 | b296        | 1940 | Composition no. 11                     | 711   | 825    |

---

## Convertir datos en imágenes

Se proporciona la función `draw_mondrian()` para dibujar pinturas a partir de datos usando Matplotlib.

(Esta función dibuja rectángulos de colores según los datos).

### Objetivo:

- Dibujar la pintura b104

```python
draw_mondrian('b104')
```

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Art as Data/ANEXOS/Pasted image 20260331161456.png]]

Pasamos de arte → datos → arte nuevamente

---

## Comparando complejidad

Mondrian buscaba simplificar el arte.  
¿Sus pinturas varían en complejidad?

### **Objetivo:**

- Dibujar dos pinturas

```python
draw_mondrian('b105')  
draw_mondrian('b170')
```

La primera es más compleja (más líneas y formas).

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Art as Data/ANEXOS/Pasted image 20260331161523.png]]


---

## Cuantificar la complejidad

Una forma simple: contar el número de características (features).

### Objetivos:

- Agrupar por painting_id
- Contar filas

```python
sizes = features.groupby('painting_id').size()  
sizes
```

Resultado: serie con cantidad de features por pintura.

| painting_id | value |
| ----------- | ----- |
| b104        | 41    |
| b105        | 42    |
| b106        | 41    |
| b107        | 44    |
| b108        | 44    |
| ...         | ...   |
| b292        | 31    |
| b293        | 26    |
| b294        | 62    |
| b295        | 47    |
| b296        | 49    |

---

### Convertir a DataFrame

```python
complexity_df = sizes.reset_index(name='complexity')  
complexity_df
```

Ahora tenemos la complejidad de las 136 pinturas.

|     | painting_id | complexity |
| --- | ----------- | ---------- |
| 0   | b104        | 41         |
| 1   | b105        | 42         |
| 2   | b106        | 41         |
| 3   | b107        | 44         |
| 4   | b108        | 44         |
| ... | ...         | ...        |
| 131 | b292        | 31         |
| 132 | b293        | 26         |
| 133 | b294        | 62         |
| 134 | b295        | 47         |
| 135 | b296        | 49         |

---

## Unir datos (merge)

Tenemos:

- `painting_info` → año

| ID  | painting_id | year | title              | width | height |
| --- | ----------- | ---- | ------------------ | ----- | ------ |
| 0   | b104        | 1920 | No. VI             | 1010  | 1007   |
| 1   | b105        | 1920 | Composition A      | 918   | 900    |
| 2   | b106        | 1920 | Composition B      | 575   | 677    |
| ... | ...         | ...  | ...                | ...   | ...    |
| 133 | b294        | 1939 | Trafalgar Square   | 1200  | 1452   |
| 134 | b295        | 1939 | Composition no. 8  | 681   | 752    |
| 135 | b296        | 1940 | Composition no. 11 | 711   | 825    |

- `complexity_df` → complejidad

|ID|painting_id|complexity|
|---|---|---|
|0|b104|41|
|1|b105|42|
|2|b106|41|
|...|...|...|
|133|b294|62|
|134|b295|47|
|135|b296|49|

Unimos usando `painting_id`:

```python
painting_info = painting_info.merge(complexity_df, on='painting_id', how='left')  
painting_info
```

Ahora el DataFrame incluye la columna complexity.

|     | painting_id | year | title                                  | width | height | complexity |
| --- | ----------- | ---- | -------------------------------------- | ----- | ------ | ---------- |
| 0   | b104        | 1920 | No. VI                                 | 1010  | 1007   | 41         |
| 1   | b105        | 1920 | Composition A                          | 918   | 900    | 42         |
| 2   | b106        | 1920 | Composition B                          | 575   | 677    | 41         |
| 3   | b107        | 1920 | Composition C                          | 610   | 603    | 44         |
| 4   | b108        | 1920 | Composition I                          | 646   | 750    | 44         |
| ... | ...         | ...  | ...                                    | ...   | ...    | ...        |
| 131 | b292        | 1939 | Composition no. 1                      | 1023  | 1052   | 31         |
| 132 | b293        | 1939 | Composition of red, blue and white: II | 330   | 435    | 26         |
| 133 | b294        | 1939 | Trafalgar Square                       | 1200  | 1452   | 62         |
| 134 | b295        | 1939 | Composition no. 8                      | 681   | 752    | 47         |
| 135 | b296        | 1940 | Composition no. 11                     | 711   | 825    | 49         |

---

## Graficar complejidad en el tiempo

### Objetivos:

- Crear scatter plot
- Etiquetar ejes

```python
import matplotlib.pyplot as plt  
plt.scatter(painting_info['year'], painting_info['complexity'])  
plt.xlabel('Year')  
plt.ylabel('Complexity')
```

Observación:

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Art as Data/ANEXOS/Pasted image 20260331162059.png]]

- Disminuye entre 1920–1925
- Se mantiene baja hasta 1935
- Luego vuelve a subir

---

## Detectar posibles falsificaciones

Dado que las pinturas de Mondrian valen millones, podrían existir falsificaciones.

Ejemplo:

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Art as Data/ANEXOS/Pasted image 20260331162131.png]]

---

### Cargar datos de la pintura sospechosa

```python
fp26_features = pd.read_csv('fp26-features.csv')  
fp26_features
```

Tiene 54 características (complejidad = 54).

| ID  | painting_id | feature | x   | y   | width | height | color  | rgb     |
| --- | ----------- | ------- | --- | --- | ----- | ------ | ------ | ------- |
| 0   | fp26        | rect    | 0   | 0   | 34    | 92     | white  | #fafafa |
| 1   | fp26        | rect    | 41  | 0   | 267   | 22     | white  | #f9f9f9 |
| 2   | fp26        | rect    | 317 | 0   | 309   | 22     | white  | #fafafa |
| 3   | fp26        | rect    | 634 | 0   | 38    | 261    | white  | #fafafa |
| 4   | fp26        | rect    | 680 | 0   | 32    | 261    | yellow | #fcf202 |
| ... | ...         | ...     | ... | ... | ...   | ...    | ...    | ...     |
| 49  | fp26        | h-line  | 206 | 462 | 506   | 8      | black  | #000000 |
| 50  | fp26        | h-line  | 0   | 497 | 166   | 8      | black  | #000000 |
| 51  | fp26        | v-line  | 270 | 96  | 9     | 169    | black  | #000000 |
| 52  | fp26        | v-line  | 580 | 96  | 7     | 370    | black  | #000000 |
| 53  | fp26        | v-line  | 308 | 466 | 9     | 80     | black  | #000000 |

---

## Comparar con datos reales

### Objetivos:

- Graficar nuevamente
- Añadir punto rojo

```python
plt.scatter(painting_info['year'], painting_info['complexity'])  
plt.scatter(x=1926, y=54, color='red', marker='s')  
plt.xlabel('Year')  
plt.ylabel('Complexity')
```

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Art as Data/ANEXOS/Pasted image 20260331162258.png]]

---