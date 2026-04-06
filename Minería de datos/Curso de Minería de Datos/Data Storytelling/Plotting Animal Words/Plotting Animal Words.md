# Plotting Animal Words

El data storytelling es fundamental en la ciencia de datos. Consiste en transformar resultados en comprensión, explicando el cómo y el por qué ocurren los fenómenos.

En este proyecto trabajaremos con un dataset derivado de la iniciativa de Google Books, el cual analiza la frecuencia de uso de palabras relacionadas con animales durante los últimos 300 años.

Además, construiremos una función reutilizable para explorar tendencias de palabras.

---

## Cargar los datos

```python
import pandas as pd  
word_trends = pd.read_csv('animal-word-trends.csv')  
word_trends
```

### Tabla

|        | year | word       | frequency |
| ------ | ---- | ---------- | --------- |
| 0      | 1700 | aardvark   | 0         |
| 1      | 1700 | agouti     | 0         |
| 2      | 1700 | albatross  | 0         |
| 3      | 1700 | alligator  | 1.087     |
| 4      | 1700 | allosaurus | 0         |
| ...    | ...  | ...        | ...       |
| 127331 | 2019 | wren       | 2.553     |
| 127332 | 2019 | xenopus    | 0.226     |
| 127333 | 2019 | yak        | 0.572     |
| 127334 | 2019 | zebra      | 1.106     |
| 127335 | 2019 | zebrafish  | 0.609     |

La frecuencia representa el número de apariciones por millón de palabras publicadas en ese año.

---

## Filtrar datos (ejemplo: "horse")

```python
trend = word_trends.query('word == "horse"')  
trend
```

### Tabla

|      | year | word  | frequency |
| ---- | ---- | ----- | --------- |
| 2    | 1700 | horse | 107.127   |
| 8    | 1701 | horse | 119.436   |
| 14   | 1702 | horse | 135.049   |
| 20   | 1703 | horse | 150.645   |
| 26   | 1704 | horse | 163.304   |
| ...  | ...  | ...   | ...       |
| 2152 | 2015 | horse | 91.868    |
| 2159 | 2016 | horse | 93.777    |
| 2166 | 2017 | horse | 95.808    |
| 2173 | 2018 | horse | 97.602    |
| 2180 | 2019 | horse | 98.829    |

La palabra "horse" es mucho más frecuente que otras como "zebra".

---

## Visualización de tendencia

```python
import matplotlib.pyplot as plt  
  
plt.plot(trend['year'], trend['frequency'])  
plt.ylabel('Frequency per million')  
plt.title('Word frequency for "horse" over time')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130151.png]]
### Observación

- La palabra "horse" era muy usada en siglos anteriores.
- Presenta una disminución con el tiempo.

---

## Función reutilizable

```python
def plot_word_trend(animal):  
    trend = word_trends.query('word == @animal')  
    plt.plot(trend['year'], trend['frequency'], label=animal)  
    plt.ylabel('Frequency per million')
```

Permite graficar cualquier palabra de animal fácilmente.

---

## Ejemplo con evento histórico (automóvil - 1886)

```python
plot_word_trend('horse')  
plt.axvline(1886, color='orange', ls='--')  
plt.title('Uso de "horse" y la invención del automóvil')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130217.png]]
### Observación

- Después de 1886 (invención del automóvil):
    - Hay un leve aumento
    - Luego una disminución significativa

Posible explicación: reemplazo del caballo por vehículos.

---

## Comparación de múltiples palabras

```python
plot_word_trend('penguin')  
plot_word_trend('dinosaur')  
plt.legend()
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130254.png]]
### Observación

- "penguin" aparece aproximadamente 3 veces más que "dinosaur".

---

## Exploración e hipótesis 1

```python
plot_word_trend('goat')  
plt.axvline(1869, color='magenta', ls='--')  
plt.title('Ferrocarril y uso de "goat"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130319.png]]

---

## Exploración e hipótesis 2

```python
plot_word_trend('lobster')
plt.axvline(1869, color='magenta', ls='--')
plt.title('Transcontinental railway and word usage for "lobster"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130421.png]]

---

## Exploración e hipótesis 3

```python
plot_word_trend('shrimp')
plt.axvline(1869, color='magenta', ls='--')
plt.title('Transcontinental railway and word usage for "shrimp"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130501.png]]

---

## Exploración e hipótesis 4

```python
plot_word_trend('tuna')
plt.axvline(1869, color='magenta', ls='--')
plt.title('Transcontinental railway and word usage for "tuna"')
```

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Plotting Animal Words/ANEXOS/Pasted image 20260402130536.png]]

---

## Análisis de ejemplo

### Hallazgo importante

La palabra "lobster" muestra un aumento significativo después de 1869.

### Hipótesis

El crecimiento del uso de "lobster" puede estar relacionado con el desarrollo del ferrocarril transcontinental.

---

## Mecanismo explicativo

Una posible explicación es:

- Los trenes comenzaron a servir langosta como comida premium.
- Más personas la conocieron y consumieron.
- Esto aumentó su presencia en libros y textos.

Esto conecta el dato con un fenómeno real → causalidad plausible

---

## Conclusión

- Los datos permiten identificar patrones históricos en el lenguaje.
- Eventos tecnológicos (automóvil, ferrocarril) afectan el uso de palabras.
- Es importante:
    - Formular hipótesis
    - Buscar mecanismos explicativos
    - Validar con evidencia

La correlación no implica causalidad, pero puede guiarnos a descubrir relaciones reales.

---