# Warm Waters off Peru

Hace siglos, comunidades pesqueras de Perú acuñaron el término El Niño para describir años en los que las aguas cálidas afectaban la pesca.

En este proyecto se analiza cómo los eventos de El Niño influyen en la frecuencia de uso de palabras relacionadas con peces.

---

## Función utilizada

```python
import pandas as pd  
import matplotlib.pyplot as plt  
word_trends = pd.read_csv('animal-word-trends.csv')  
def plot_animal(animal):  
    trend = word_trends.query("word == @animal")  
    plt.plot(trend['year'], trend['frequency'], label=animal)  
    plt.ylabel('Frecuencia por millón')
```

---

## Palabras de peces analizadas

- sardine
- mackerel
- bonito
- anchoveta
- hake

---

## Años de eventos El Niño

- 1965
- 1973
- 1983
- 1987

---

## Código de análisis 1

```python
plot_animal('sardine')  
for year in [1965, 1973, 1983, 1987]:  
    plt.axvline(year, color='magenta', ls='--')    
plt.xlim(1960, 1990)  
plt.title('Eventos El Niño y frecuencia de "sardine"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Warm Waters off Peru/ANEXOS/Pasted image 20260402135426.png]]

---

## Código de análisis 2

```python
plot_animal('mackerel')
for year in [1965, 1973, 1983, 1987]:
plt.axvline( year, label='El Niño event', color='magenta', ls='--' )
plt.xlim(1960, 1990)
plt.title('El Niño events and word frequency for "mackerel"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Warm Waters off Peru/ANEXOS/Pasted image 20260402135506.png]]

---

## Código de análisis 3

```python
plot_animal('bonito')
for year in [1965, 1973, 1983, 1987]:
plt.axvline( year, label='El Niño event', color='magenta', ls='--' )
plt.xlim(1960, 1990)
plt.title('El Niño events and word frequency for "bonito"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Warm Waters off Peru/ANEXOS/Pasted image 20260402135537.png]]

---

## Código de análisis 4

```python
plot_animal('anchoveta')
for year in [1965, 1973, 1983, 1987]:
plt.axvline( year, label='El Niño event', color='magenta', ls='--' )
plt.xlim(1960, 1990)
plt.title('El Niño events and word frequency for "anchoveta"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Warm Waters off Peru/ANEXOS/Pasted image 20260402135610.png]]

----

## Código de análisis 5

```python
plot_animal('hake')
for year in [1965, 1973, 1983, 1987]:
plt.axvline( year, label='El Niño event', color='magenta', ls='--' )
plt.xlim(1960, 1990)
plt.title('El Niño events and word frequency for "hake"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Warm Waters off Peru/ANEXOS/Pasted image 20260402135646.png]]

---

## Observación clave

La palabra “anchoveta” presenta picos de uso cercanos a los eventos de El Niño, especialmente en:

- 1965
- 1973
- 1983

---

## 🧠 Hipótesis planteadas

### 1. Hipótesis de abundancia

Las anchovetas aumentan en aguas cálidas → más menciones.

### 2. Hipótesis de escasez

Las anchovetas disminuyen → preocupación → más menciones.

### 3. Hipótesis de excepción

Las anchovetas reaccionan diferente a otros peces → interés científico.

---

## Datos de captura

### Cargar datos

```python
catch_size = pd.read_csv('anchoveta-caught-per-year.csv')  
catch_size
```

---

## Tabla

|     | Año  | Megatoneladas |
| --- | ---- | ------------- |
| 0   | 1950 | 0.013         |
| 1   | 1951 | 0.028         |
| 2   | 1952 | 0.034         |
| 3   | 1953 | 0.057         |
| 4   | 1954 | 0.063         |
| ... | ...  | ...           |
| 36  | 1986 | 5.936         |
| 37  | 1987 | 3.413         |
| 38  | 1988 | 4.333         |
| 39  | 1989 | 6.467         |
| 40  | 1990 | 4.539         |

---

## Visualización

```python
plt.plot(catch_size['year'], catch_size['megatonnes'], color='green')  
for year in [1965, 1973, 1983, 1987]:  
    plt.axvline(year, color='magenta', ls='--')  
plt.ylabel('Megatoneladas')  
plt.title('Captura de anchoveta por año')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Warm Waters off Peru/ANEXOS/Pasted image 20260402135859.png]]

---

## Observación clave

Durante los eventos de El Niño:

- 📉 Las capturas de anchoveta disminuyen
- 📈 Las menciones de “anchoveta” aumentan

---

## Relación encontrada

Existe una relación inversa:

|Variable|Comportamiento|
|---|---|
|Frecuencia palabra|Aumenta|
|Captura real|Disminuye|

---

## Explicación (Mecanismo)

Una explicación plausible es:

- Antes del evento:
    - Se anticipa El Niño
    - Aumenta la preocupación → más menciones
- Durante el evento:
    - Las aguas cálidas reducen la población de anchoveta
    - Disminuyen las capturas

Esto genera:

- Más discusión (medios, científicos, pescadores)
- Menos disponibilidad real