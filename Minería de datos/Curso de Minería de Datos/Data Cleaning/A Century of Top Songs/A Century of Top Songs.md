# A Century of Top Songs

¿Qué hace que una canción llegue a ser un éxito número uno? ¿Existe una duración ideal? ¿Las canciones actuales duran más o menos que hace un siglo?

---

## Cargando los datos

El archivo **`top-song-durations.csv`** contiene información sobre la canción número uno de cada año desde 1923 hasta 2023. Carga los datos en Python y échales un vistazo.

### Objetivos de la actividad:

- Importar pandas.
- Cargar los datos de duración de canciones.
- Mostrar las primeras 5 filas.

```python
import pandas as pd  
df = pd.read_csv('top-song-durations.csv')  
df.head(5)
```

Resultado:

|ID|year|artist|title|duration|
|---|---|---|---|---|
|0|2023|Morgan Wallen|Last Night|00:02:43|
|1|2022|Glass Animals|Heat Waves|00:03:58|
|2|2021|Dua Lipa|Levitating|00:03:23|
|3|2020|The Weeknd|Blinding Lights|00:03:20|
|4|2019|Lil Nas X feat. Billy Ray Cyrus|Old Town Road|00:02:37|

La canción número uno de 2019 dura 2 minutos y 37 segundos.  
Es la más corta entre estas primeras 5 filas. Veamos cómo se compara con la más corta de todo el dataset.

### Objetivo:

Encontrar la canción más corta del dataset.

```python
df.query('duration == duration.min()')
```

|ID|year|artist|title|duration|
|---|---|---|---|---|
|95|1928|Al Jolson|Sonny Boy|00:01:55|

La canción más corta, “Sonny Boy”, fue el éxito número uno en 1928, al final de los años 20 y justo antes de la Gran Depresión. ¿Coincidencia?

---

## Intentando graficar los datos

Podríamos pensar que este código generará una gráfica:

```python
import matplotlib.pyplot as plt  
plt.plot(df['year'], df['duration'])
```

Error: `TypeError: plt.plot() requires the y-axis to be numeric.`

El problema es que la duración no es numérica.

---

## Revisando tipos de datos

```python
df.info()
```

|     | Column   | Non-Null Count | Dtype  |
| --- | -------- | -------------- | ------ |
| 0   | year     | 101 non-null   | number |
| 1   | artist   | 101 non-null   | string |
| 2   | title    | 101 non-null   | string |
| 3   | duration | 101 non-null   | string |

Solo `year` es numérico.  
`duration` es texto, aunque parezca un número.

---

## Procesando la duración

Primero dividimos la duración en horas, minutos y segundos:

```python
split_duration = df['duration'].str.split(':', expand=True)  
split_duration.head(5)
```

|     | 0   | 1   | 2   |
| --- | --- | --- | --- |
| 0   | 00  | 02  | 43  |
| 1   | 00  | 03  | 58  |
| 2   | 00  | 03  | 23  |
| 3   | 00  | 03  | 20  |
| 4   | 00  | 02  | 37  |

---

### Convertir a números

```python
split_duration = split_duration.astype('int')  
split_duration.head(5)
```

|     | hh  | mm  | ss  |
| --- | --- | --- | --- |
| 0   | 0   | 2   | 43  |
| 1   | 0   | 3   | 58  |
| 2   | 0   | 3   | 23  |
| 3   | 0   | 3   | 20  |
| 4   | 0   | 2   | 37  |

---

## Nombrar columnas

```python
df[['h','m','s']] = split_duration  
df.head(5)
```

|     | year | artist                          | title           | duration | h   | m   | s   |
| --- | ---- | ------------------------------- | --------------- | -------- | --- | --- | --- |
| 0   | 2023 | Morgan Wallen                   | Last Night      | 00:02:43 | 0   | 2   | 43  |
| 1   | 2022 | Glass Animals                   | Heat Waves      | 00:03:58 | 0   | 3   | 58  |
| 2   | 2021 | Dua Lipa                        | Levitating      | 00:03:23 | 0   | 3   | 23  |
| 3   | 2020 | The Weeknd                      | Blinding Lights | 00:03:20 | 0   | 3   | 20  |
| 4   | 2019 | Lil Nas X feat. Billy Ray Cyrus | Old Town Road   | 00:02:37 | 0   | 2   | 37  |

---

## Calcular segundos totales

Fórmula:

`total_seconds = h*3600 + m*60 + s`

```python
df['total_seconds'] = df.eval('h*3600 + m*60 + s')  
df.head(5)
```

|     | year | artist                          | title           | duration | h   | m   | s   | total_seconds |
| --- | ---- | ------------------------------- | --------------- | -------- | --- | --- | --- | ------------- |
| 0   | 2023 | Morgan Wallen                   | Last Night      | 00:02:43 | 0   | 2   | 43  | 163           |
| 1   | 2022 | Glass Animals                   | Heat Waves      | 00:03:58 | 0   | 3   | 58  | 238           |
| 2   | 2021 | Dua Lipa                        | Levitating      | 00:03:23 | 0   | 3   | 23  | 203           |
| 3   | 2020 | The Weeknd                      | Blinding Lights | 00:03:20 | 0   | 3   | 20  | 200           |
| 4   | 2019 | Lil Nas X feat. Billy Ray Cyrus | Old Town Road   | 00:02:37 | 0   | 2   | 37  | 157           |

---

## Graficar duración de canciones

```python
plt.plot(df['year'], df['total_seconds'])  
plt.xlabel('Year')  
plt.ylabel('Duration (Seconds)')
```

![[Minería de datos/Curso de Minería de Datos/Data Cleaning/A Century of Top Songs/ANEXOS/Pasted image 20260331163851.png]]

✔️ ¡Ahora sí funciona!

---

## Observaciones

Se observa un pico fuerte en 1968.  
Después de ese punto, las canciones número uno son más largas en promedio que antes.

---

## La canción más larga

### Objetivo:

Encontrar la canción más larga.

```python
df.query('total_seconds == total_seconds.max()')
```

|ID|year|artist|title|duration|h|m|s|total_seconds|
|---|---|---|---|---|---|---|---|---|
|55|1968|The Beatles|Hey Jude|00:07:11|0|7|11|431|

---

## Conclusión

La canción número uno más larga es:  
🎵 **"Hey Jude" de The Beatles** (1968)

---