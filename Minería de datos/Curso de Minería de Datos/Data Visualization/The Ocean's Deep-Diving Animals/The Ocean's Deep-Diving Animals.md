# The Ocean's Deep-Diving Animals

¿Qué tan profundo pueden sumergirse los animales que respiran aire?  
¿Las ballenas bajan más que las focas? ¿Qué animales llegan más profundo?

En este proyecto se utiliza visualización de datos para comparar las profundidades de inmersión de distintos animales marinos. Además, se mejorarán gráficos de barras usando buenas prácticas.

---

## Cargando los datos

El archivo `deepest-diving-animals.csv` contiene las profundidades máximas registradas para diferentes especies (en metros).

### Objetivos

- Cargar los datos
- Mostrar el DataFrame

```python
import pandas as pd  
import matplotlib.pyplot as plt  
  
divers = pd.read_csv('deepest-diving-animals.csv')  
divers
```

Resultados:

|     | animal             | category             | depth |
| --- | ------------------ | -------------------- | ----- |
| 0   | Emperor Penguin    | penguins             | 564   |
| 1   | King Penguin       | penguins             | 343   |
| 2   | Rockhopper Penguin | penguins             | 104   |
| 3   | Macaroni Penguin   | penguins             | 154   |
| 4   | Royal Penguin      | penguins             | 226   |
| ... | ...                | ...                  | ...   |
| 113 | Northern Sea Otter | sea otters           | 97    |
| 114 | Southern Sea Otter | sea otters           | 88    |
| 115 | Atlantic Walrus    | walruses             | 500   |
| 116 | Dugong             | other marine mammals | 33    |
| 117 | Florida Manatee    | other marine mammals | 16    |

---

## Conteo por categoría

### Objetivo

- Contar cuántos animales hay por categoría

```python
divers['category'].value_counts()
```

|                      |     |
| -------------------- | --- |
| other seabirds       | 45  |
| seals                | 24  |
| penguins             | 14  |
| toothed whales       | 14  |
| baleen whales        | 7   |
| sea lions            | 5   |
| turtles              | 4   |
| sea otters           | 2   |
| other marine mammals | 2   |
| walruses             | 1   |

---

## Profundidad máxima por categoría

### Objetivos

- Agrupar por categoría
- Obtener profundidad máxima

```python
max_depths = divers.groupby('category')['depth'].max()  
max_depths
```

|                      |      |
| -------------------- | ---- |
| baleen whales        | 616  |
| other marine mammals | 33   |
| other seabirds       | 152  |
| penguins             | 564  |
| sea lions            | 597  |
| sea otters           | 97   |
| seals                | 2389 |
| toothed whales       | 2992 |
| turtles              | 1344 |
| walruses             | 500  |

---

## Convertir a DataFrame

```python
df = max_depths.reset_index(name='max_depth')  
df
```

|     | category             | max_depth |
| --- | -------------------- | --------- |
| 0   | baleen whales        | 616       |
| 1   | other marine mammals | 33        |
| 2   | other seabirds       | 152       |
| 3   | penguins             | 564       |
| 4   | sea lions            | 597       |
| 5   | sea otters           | 97        |
| 6   | seals                | 2389      |
| 7   | toothed whales       | 2992      |
| 8   | turtles              | 1344      |
| 9   | walruses             | 500       |

---

## Gráfico de barras (básico)

```python
plt.bar(df['category'], df['max_depth'])  
plt.ylabel('Maximum Depth (meters)')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331225951.png]]

Problema: las etiquetas se sobreponen.

---

## Mejora 1: barras horizontales

```python
plt.barh(df['category'], df['max_depth'])  
plt.xlabel('Maximum Depth (meters)')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331230020.png]]

---

## Mejora 2: ordenar los datos

```python
df = df.sort_values('max_depth')  
df
```

|     | category             | max_depth |
| --- | -------------------- | --------- |
| 1   | other marine mammals | 33        |
| 5   | sea otters           | 97        |
| 2   | other seabirds       | 152       |
| 9   | walruses             | 500       |
| 3   | penguins             | 564       |
| 4   | sea lions            | 597       |
| 0   | baleen whales        | 616       |
| 8   | turtles              | 1344      |
| 6   | seals                | 2389      |
| 7   | toothed whales       | 2992      |
```python
plt.barh(df['category'], df['max_depth'])  
plt.xlabel('Maximum Depth (meters)')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331230230.png]]


---

## Mejora 3: limpiar el gráfico

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331230323.png]]

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331230330.png]]

```python
def clean_bar_axes():  
    ax = plt.gca()  
    ax.spines[['top','bottom','left','right']].set_visible(False)  
    ax.grid(axis='x', color='black', alpha=0.5)  
    ax.tick_params(axis='both', length=0)
```

---

## Storytelling con datos

Para dar contexto:  
Un submarino nuclear implosionó a 730 metros.

---

## Agregar columna de color

```python
df['color'] = 'C0'  
df
```

|     | category             | max_depth | color |
| --- | -------------------- | --------- | ----- |
| 1   | other marine mammals | 33        | C0    |
| 5   | sea otters           | 97        | C0    |
| 2   | other seabirds       | 152       | C0    |
| 9   | walruses             | 500       | C0    |
| 3   | penguins             | 564       | C0    |
| 4   | sea lions            | 597       | C0    |
| 0   | baleen whales        | 616       | C0    |
| 8   | turtles              | 1344      | C0    |
| 6   | seals                | 2389      | C0    |
| 7   | toothed whales       | 2992      | C0    |

---

## Agregar referencia

```python
df.loc['ref_0'] = ['submarine implosion', 730, 'C1']  
df = df.sort_values('max_depth')  
df
```

| ID    | category             | max_depth | color |
| ----- | -------------------- | --------- | ----- |
| 1     | other marine mammals | 33        | C0    |
| 5     | sea otters           | 97        | C0    |
| 2     | other seabirds       | 152       | C0    |
| 9     | walruses             | 500       | C0    |
| 3     | penguins             | 564       | C0    |
| 4     | sea lions            | 597       | C0    |
| 0     | baleen whales        | 616       | C0    |
| ref_0 | submarine implosion  | 730       | C1    |
| 8     | turtles              | 1344      | C0    |
| 6     | seals                | 2389      | C0    |
| 7     | toothed whales       | 2992      | C0    |

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331230542.png]]

---

## Gráfico final

```python
plt.barh(df['category'], df['max_depth'], color=df['color'])  
plt.xlabel('Maximum Diving Depth (meters)')  
clean_bar_axes()
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Ocean's Deep-Diving Animals/ANEXOS/Pasted image 20260331230624.png]]

---

## Conclusiones

- Los animales que más profundo se sumergen son:
    - ballenas dentadas (toothed whales)
    - focas (seals)
- Solo 3 categorías superan los 730 metros.
- El uso de:
    - barras horizontales
    - ordenamiento
    - líneas guía

mejora significativamente la interpretación del gráfico.

---