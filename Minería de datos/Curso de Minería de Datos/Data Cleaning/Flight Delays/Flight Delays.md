# Flight Delays

Los retrasos pueden ser un aspecto no deseado de los viajes en avión. ¿Con qué frecuencia ocurren los retrasos de vuelos?

En este proyecto, trabajarás con datos de vuelos de un aeropuerto y explorarás cómo el día de la semana afecta la probabilidad de una salida retrasada.

---
## Cargando los datos

El archivo `'atlanta-airport-flights-2023.csv'` contiene una muestra de vuelos domésticos que salen del aeropuerto más concurrido del mundo. Carga los datos y échales un vistazo.

### Objetivos de la actividad:

- Importar ambas bibliotecas.
- Cargar los datos de retrasos de vuelos.
- Mostrar el dataframe.

```python
import pandas as pd
import matplotlib.pyplot as plt
flights = pd.read_csv('atlanta-airport-flights-2023.csv')
flights
````

|      | scheduled         | actual            | carrier | flight | tailnum | origin | dest | air_time | distance |
| ---- | ----------------- | ----------------- | ------- | ------ | ------- | ------ | ---- | -------- | -------- |
| 0    | 04/29/2023, 16:35 | 04/29/2023, 17:01 | WN      | 1079   | N230WN  | ATL    | HOU  | 110      | 696      |
| 1    | 07/02/2023, 15:10 | 07/02/2023, 15:05 | DL      | 355    | N953AT  | ATL    | GPT  | 54       | 352      |
| 2    | 12/25/2023, 10:55 | 12/25/2023, 10:53 | WN      | 291    | N413WN  | ATL    | RDU  | 57       | 356      |
| 3    | 09/01/2023, 12:50 | 09/01/2023, 12:48 | DL      | 1132   | N947DZ  | ATL    | TYS  | 28       | 152      |
| 4    | 12/14/2023, 07:05 | 12/14/2023, 07:02 | DL      | 40     | N332DN  | ATL    | BOS  | 121      | 946      |
| ...  | ...               | ...               | ...     | ...    | ...     | ...    | ...  | ...      | ...      |
| 4995 | 11/15/2023, 14:20 | 11/15/2023, 14:17 | WN      | 13     | N400WN  | ATL    | MCO  | 63       | 404      |
| 4996 | 04/09/2023, 19:50 | 04/09/2023, 19:58 | OH      | 1320   | N567NN  | ATL    | CLT  | 42       | 226      |
| 4997 | 12/14/2023, 13:20 | 12/14/2023, 13:16 | DL      | 695    | N363NB  | ATL    | DAL  | 103      | 721      |
| 4998 | 12/06/2023, 13:05 | 12/06/2023, 13:01 | DL      | 911    | N992AT  | ATL    | GSO  | 56       | 306      |
| 4999 | 05/29/2023, 14:38 | 05/29/2023, 14:57 | NK      | 952    | N624NK  | ATL    | DFW  | 110      | 731      |

---

La columna `'scheduled'` representa la hora en que el vuelo estaba programado, pero la hora de salida real está representada por la columna `'actual'`. Podemos usar estas columnas para calcular los retrasos de vuelos.

Comencemos extrayendo las dos columnas de hora de salida.

### Objetivos de la actividad:

- Extraer las columnas `'scheduled'` y `'actual'`.
- Asignar a un nuevo dataframe y llamarlo `departures`.
- Mostrar los resultados.

```python
departures = flights[['scheduled', 'actual']]
departures #mostrar el dataframe
```

|      | scheduled         | actual            |
| ---- | ----------------- | ----------------- |
| 0    | 04/29/2023, 16:35 | 04/29/2023, 17:01 |
| 1    | 07/02/2023, 15:10 | 07/02/2023, 15:05 |
| 2    | 12/25/2023, 10:55 | 12/25/2023, 10:53 |
| 3    | 09/01/2023, 12:50 | 09/01/2023, 12:48 |
| 4    | 12/14/2023, 07:05 | 12/14/2023, 07:02 |
| ...  | ...               | ...               |
| 4995 | 11/15/2023, 14:20 | 11/15/2023, 14:17 |
| 4996 | 04/09/2023, 19:50 | 04/09/2023, 19:58 |
| 4997 | 12/14/2023, 13:20 | 12/14/2023, 13:16 |
| 4998 | 12/06/2023, 13:05 | 12/06/2023, 13:01 |
| 4999 | 05/29/2023, 14:38 | 05/29/2023, 14:57 |

---

¿Qué tipos de datos se están utilizando para estas horas de salida? Vamos a averiguarlo usando el método `info()`. Ejecuta el código a continuación.

```python
departures.info()
```

|     | Column    | Non-Null Count | Dtype  |
| --- | --------- | -------------- | ------ |
| 0   | scheduled | 5000 non-null  | string |
| 1   | actual    | 5000 non-null  | string |

---

Los valores de tiempo son actualmente cadenas de texto (strings). Las cadenas de texto no son adecuadas para cálculos numéricos. Para cálculos que involucran fechas y horas, se recomienda convertir esas cadenas en objetos datetime.

## Convertir cadenas a datetime

Pandas tiene un método `to_datetime()` que convierte cadenas de texto en objetos datetime.

### Objetivos de la actividad:

- Convertir las cadenas de texto en objetos datetime.
- Hacer esto para ambas columnas.
- Mostrar el dataframe actualizado.

```python
departures['scheduled'] = pd.to_datetime(departures['scheduled'])
departures['actual'] = pd.to_datetime(departures['actual'])
departures #mostrar
```

|      | scheduled           | actual              |
| ---- | ------------------- | ------------------- |
| 0    | 2023-04-29 16:35:00 | 2023-04-29 17:01:00 |
| 1    | 2023-07-02 15:10:00 | 2023-07-02 15:05:00 |
| 2    | 2023-12-25 10:55:00 | 2023-12-25 10:53:00 |
| 3    | 2023-09-01 12:50:00 | 2023-09-01 12:48:00 |
| 4    | 2023-12-14 07:05:00 | 2023-12-14 07:02:00 |
| ...  | ...                 | ...                 |
| 4995 | 2023-11-15 14:20:00 | 2023-11-15 14:17:00 |
| 4996 | 2023-04-09 19:50:00 | 2023-04-09 19:58:00 |
| 4997 | 2023-12-14 13:20:00 | 2023-12-14 13:16:00 |
| 4998 | 2023-12-06 13:05:00 | 2023-12-06 13:01:00 |
| 4999 | 2023-05-29 14:38:00 | 2023-05-29 14:57:00 |

---

Podemos ver que ha habido un ligero cambio de formato.

Usemos `info()` para confirmar el nuevo tipo de dato. Ejecuta el código a continuación.

```python
departures.info()
```

|     | Column    | Non-Null Count | Dtype    |
| --- | --------- | -------------- | -------- |
| 0   | scheduled | 5000 non-null  | datetime |
| 1   | actual    | 5000 non-null  | datetime |

¡Perfecto! Ahora tenemos valores datetime que podemos usar para realizar cálculos de fecha y hora.

---
## Calcular los retrasos

Para identificar los vuelos retrasados, primero calculemos la cantidad de retraso de cada vuelo usando nuestras columnas datetime. La ecuación para la cantidad de retraso de un vuelo es:

`retraso = actual − programado`

### Objetivos de la actividad:

- Calcular la cantidad de retraso usando `eval()`.
- Asignar el resultado a una nueva columna.
- Mostrar el dataframe.

```python
departures['delay'] = departures.eval('actual - scheduled')
departures #mostrar
```

|      | scheduled           | actual              | delay     |
| ---- | ------------------- | ------------------- | --------- |
| 0    | 2023-04-29 16:35:00 | 2023-04-29 17:01:00 | 00:26:00  |
| 1    | 2023-07-02 15:10:00 | 2023-07-02 15:05:00 | -00:05:00 |
| 2    | 2023-12-25 10:55:00 | 2023-12-25 10:53:00 | -00:02:00 |
| 3    | 2023-09-01 12:50:00 | 2023-09-01 12:48:00 | -00:02:00 |
| 4    | 2023-12-14 07:05:00 | 2023-12-14 07:02:00 | -00:03:00 |
| ...  | ...                 | ...                 | ...       |
| 4995 | 2023-11-15 14:20:00 | 2023-11-15 14:17:00 | -00:03:00 |
| 4996 | 2023-04-09 19:50:00 | 2023-04-09 19:58:00 | 00:08:00  |
| 4997 | 2023-12-14 13:20:00 | 2023-12-14 13:16:00 | -00:04:00 |
| 4998 | 2023-12-06 13:05:00 | 2023-12-06 13:01:00 | -00:04:00 |
| 4999 | 2023-05-29 14:38:00 | 2023-05-29 14:57:00 | 00:19:00  |

---

¡Tenemos una nueva columna `'delay'`! El primer vuelo en nuestro dataframe salió 26 minutos tarde. El segundo vuelo tiene un retraso negativo, lo que indica que salió 5 minutos antes de lo programado.

Las aerolíneas pueden salir unos minutos después de lo programado sin considerarse tardías. Típicamente, un vuelo se considera tarde si sale más de 900 segundos (15 minutos) después de la hora de salida programada.

Determinemos cuáles vuelos son tardíos usando `dt.total_seconds()`.

### Objetivos de la actividad:

- Crear una nueva columna para marcar los vuelos como tardíos.
- Mostrar el dataframe.

```python
departures['is_late'] = departures['delay'].dt.total_seconds() > 900
departures # mostrar dataframe
```

|      | scheduled           | actual              | delay     | is_late |
| ---- | ------------------- | ------------------- | --------- | ------- |
| 0    | 2023-04-29 16:35:00 | 2023-04-29 17:01:00 | 00:26:00  | True    |
| 1    | 2023-07-02 15:10:00 | 2023-07-02 15:05:00 | -00:05:00 | False   |
| 2    | 2023-12-25 10:55:00 | 2023-12-25 10:53:00 | -00:02:00 | False   |
| 3    | 2023-09-01 12:50:00 | 2023-09-01 12:48:00 | -00:02:00 | False   |
| 4    | 2023-12-14 07:05:00 | 2023-12-14 07:02:00 | -00:03:00 | False   |
| ...  | ...                 | ...                 | ...       | ...     |
| 4995 | 2023-11-15 14:20:00 | 2023-11-15 14:17:00 | -00:03:00 | False   |
| 4996 | 2023-04-09 19:50:00 | 2023-04-09 19:58:00 | 00:08:00  | False   |
| 4997 | 2023-12-14 13:20:00 | 2023-12-14 13:16:00 | -00:04:00 | False   |
| 4998 | 2023-12-06 13:05:00 | 2023-12-06 13:01:00 | -00:04:00 | False   |
| 4999 | 2023-05-29 14:38:00 | 2023-05-29 14:57:00 | 00:19:00  | True    |

---

Ahora sabemos cuáles vuelos se retrasaron. A continuación, calcularemos el día de la semana para cada vuelo.

## Obtener el día de la semana

Además de admitir cálculos, los objetos datetime nos permiten obtener información como el año, el mes y el día.

Para hacer esto, tomamos cada objeto datetime y lo convertimos en una cadena con formato usando el método de formato de cadena de tiempo, `strftime()`. El método utiliza códigos de formato para representar la fecha y la hora. A continuación se muestran algunos ejemplos:

- `%d` - Día del mes como número decimal con cero a la izquierda
- `%m` - Mes como número decimal con cero a la izquierda
- `%Y` - Año con siglo como número decimal

### Objetivos de la actividad:

- Obtener el nombre abreviado del día de la semana para cada vuelo.
- Asignar el resultado a una nueva columna.
- Mostrar el dataframe.

```python
departures['day_name'] = departures['actual'].dt.strftime('%a')
departures #mostrar
```

|ID|scheduled|actual|delay|is_late|day_name|
|---|---|---|---|---|---|
|0|2023-04-29 16:35:00|2023-04-29 17:01:00|00:26:00|True|Sat|
|1|2023-07-02 15:10:00|2023-07-02 15:05:00|-00:05:00|False|Sun|
|2|2023-12-25 10:55:00|2023-12-25 10:53:00|-00:02:00|False|Mon|
|3|2023-09-01 12:50:00|2023-09-01 12:48:00|-00:02:00|False|Fri|
|4|2023-12-14 07:05:00|2023-12-14 07:02:00|-00:03:00|False|Thu|
|...|...|...|...|...|...|
|4995|2023-11-15 14:20:00|2023-11-15 14:17:00|-00:03:00|False|Wed|
|4996|2023-04-09 19:50:00|2023-04-09 19:58:00|00:08:00|False|Sun|
|4997|2023-12-14 13:20:00|2023-12-14 13:16:00|-00:04:00|False|Thu|
|4998|2023-12-06 13:05:00|2023-12-06 13:01:00|-00:04:00|False|Wed|
|4999|2023-05-29 14:38:00|2023-05-29 14:57:00|00:19:00|True|Mon|

---

Cada nombre abreviado del día de la semana está compuesto por tres letras.

Ahora que tenemos los días de la semana, calculemos el porcentaje de vuelos que se retrasan para cada día de la semana.

## Porcentaje de vuelos retrasados por día de la semana

Para calcular el porcentaje de vuelos que se retrasan, tomemos la `mean()` de la columna `'is_late'` para cada día de la semana. La media de una columna Verdadero/Falso equivale a la proporción de valores Verdadero.

Luego convertiremos esta proporción en un porcentaje multiplicando por 100.

### Objetivos de la actividad:

- Agrupar el dataframe por día de la semana.
- Calcular la media de la columna `'is_late'` para cada día.
- Convertir esa proporción en un porcentaje.
- Mostrar la serie resultante.

```python
proportion_delayed = departures.groupby('day_name')['is_late'].mean()
percent_delayed = proportion_delayed * 100
percent_delayed #Mostrar serie
```

|     |        |
| --- | ------ |
| Fri | 22.594 |
| Mon | 20.186 |
| Sat | 18.558 |
| Sun | 23.377 |
| Thu | 20.94  |
| Tue | 15.42  |
| Wed | 16.691 |

---

El índice de la serie es `day_name`. Observa que la serie está ordenada alfabéticamente por el índice. A partir de esto podemos ver que el día con el mayor porcentaje de retrasos es el domingo.

Estas diferencias serán más fáciles de ver en un gráfico, así que vamos a crear un gráfico de barras.

## Graficar los datos

¡Ya casi terminamos! La serie `percent_delayed` está ordenada alfabéticamente. Para graficar los datos, primero reordenemos `percent_delayed` en el orden natural de los días de la semana.

Ejecuta el código a continuación, que utiliza el método `reindex()`.

```python
new_index_order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
percent_delayed = percent_delayed.reindex(new_index_order)
percent_delayed
```

|     |        |
| --- | ------ |
| Sun | 23.377 |
| Mon | 20.186 |
| Tue | 15.42  |
| Wed | 16.691 |
| Thu | 20.94  |
| Fri | 22.594 |
| Sat | 18.558 |

---

`percent_delayed` ahora está ordenado de domingo a sábado. Tenemos un conjunto de datos limpio que podemos graficar.

### Objetivos de la actividad:

- Graficar el gráfico de barras.
- Etiquetar el eje Y.

```python
plt.bar(percent_delayed.index, percent_delayed)
plt.ylabel('Porcentaje Retrasado')
```

![[Minería de datos/Curso de Minería de Datos/Data Cleaning/Flight Delays/ANEXOS/Pasted image 20260331175155.png]]

El día de la semana con menos vuelos tardíos es el **martes**.