# The Cicadas are Coming

Las cigarras periódicas son insectos que pasan gran parte de su vida bajo tierra y emergen en ciclos largos, creando eventos masivos y ruidosos.

En este proyecto se analiza cómo estos ciclos se reflejan en la frecuencia de uso de la palabra "cicada" a lo largo del tiempo.

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

## Visualización inicial

```python
plot_animal('cicada')  
plt.xlim(1820, 2020)
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402140744.png]]

---

## Observación

Se observa un patrón repetitivo de:

- 📈 picos
- 📉 caídas

Este comportamiento se repite cada cierto número de años.

---

## Periodicidad

Las cigarras tienen dos ciclos principales:

| Ciclo (años) | Tipo de camada   |
| ------------ | ---------------- |
| 13 años      | XIX, XXII, XXIII |
| 17 años      | II, IV, X, XIV   |

---

## Análisis

Al medir la distancia entre picos en la gráfica:

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402140832.png]]

La periodicidad es cercana a 17 años

---

## Camadas de 17 años

| Camada | Años de aparición                  |
| ------ | ---------------------------------- |
| X      | 1919, 1936, 1953, 1970, 1987, 2004 |
| XIV    | 1923, 1940, 1957, 1974, 1991, 2008 |
| II     | 1928, 1945, 1962, 1979, 1996, 2013 |
| IV     | 1930, 1947, 1964, 1981, 1998, 2015 |

---

## Comparación con datos 1

```python
plot_animal('cicada')  
plt.xlim(1820, 2020)    
for year in [1928, 1945, 1962]:  
    plt.axvline(year, color='magenta', ls=':')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402140917.png]]

---

## Comparación con datos 2

```python
plot_animal( 'cicada' )
plt.xlim(1820, 2020)
plt.title('Brood XIV: Years Emerged')
for year in [1923,1940,1957]:
plt.axvline( year, color='magenta', ls=':' )
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402140949.png]]

---

## Comparación con datos 3

```python
plot_animal( 'cicada' )
plt.xlim(1820, 2020)
plt.title('Brood II: Years Emerged')
for year in [1928,1945,1962]:
plt.axvline( year, color='magenta', ls=':' )
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402141013.png]]

---

## Comparación con datos 4

```python
plot_animal( 'cicada' )
plt.xlim(1820, 2020)
plt.title('Brood IV: Years Emerged')
for year in [1930,1947,1964]:
plt.axvline( year, color='magenta', ls=':' )
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402141037.png]]

---

## Observación clave

- **Brood II** coincide con los picos más altos
- **Brood X** coincide con picos secundarios

---

## Datos reales de menciones

```python
broods = pd.read_csv('cicada-brood-mentions-print.csv')  
broods
```

---

## Tabla

|     | Brood | Menciones |
| --- | ----- | --------- |
| 0   | II    | 1024      |
| 1   | X     | 968       |
| 2   | XIV   | 636       |
| 3   | I     | 634       |
| 4   | XIII  | 348       |
| ... | ...   | ...       |
| 10  | VIII  | 166       |
| 11  | IV    | 160       |
| 12  | VII   | 116       |
| 13  | XXII  | 100       |
| 14  | IX    | 88        |

---

## Visualización

```python
plt.bar(broods['brood_name'], broods['mentions'])  
plt.xlabel('Nombre de la camada')  
plt.ylabel('Número de menciones')  
plt.title('Menciones totales de camadas de cigarras')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/The Cicadas are Coming/ANEXOS/Pasted image 20260402141216.png]]

---

## Resultado

La camada II tiene el mayor número de menciones.

---

## Conclusión

- Existe un patrón periódico en el uso de la palabra cicada
- Este patrón coincide con ciclos biológicos reales
- El ciclo dominante es de 17 años
- La camada más influyente en el lenguaje es Brood II

---