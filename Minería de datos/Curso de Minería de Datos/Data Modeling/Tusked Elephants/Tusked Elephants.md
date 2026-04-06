# Tusked Elephants

El comercio ilegal de marfil en las décadas de 1970 y 1980 fue tan severo que algunas poblaciones de elefantes disminuyeron entre un 50% y 90%, ya que los cazadores furtivos se enfocaban en aquellos con los colmillos más grandes.

Las medidas de protección implementadas en 1990 permitieron la recuperación de la población.

En este proyecto se analiza cómo este evento afectó el rasgo genético del tamaño de los colmillos en los elefantes.

---

## Cargar los datos

```python
import pandas as pd  
import matplotlib.pyplot as plt  
  
df = pd.read_csv('male-elephant-tusk-size.csv')  
df
```

### Datos

|     | period  | elephant_id | age | shoulder_height | tusk_length |
| --- | ------- | ----------- | --- | --------------- | ----------- |
| 0   | 1966-68 | 58          | 2.5 | 149             | 30          |
| 1   | 1966-68 | 78          | 2.5 | 151             | 27          |
| 2   | 1966-68 | 86          | 2.5 | 127             | 27          |
| 3   | 1966-68 | 293         | 2.5 | 156             | 32          |
| 4   | 1966-68 | 29          | 3   | 146             | 28.5        |
| ... | ...     | ...         | ... | ...             | ...         |
| 294 | 2005-13 | 78          | 7.5 | 220             | 84.7        |
| 295 | 2005-13 | 144         | 7.5 | 220             | 58.9        |
| 296 | 2005-13 | 1           | 9   | 220             | 99          |
| 297 | 2005-13 | 48          | 9   | 230             | 105.4       |
| 298 | 2005-13 | 105         | 9   | 210             | 79.6        |

---

## Separar los datos por periodo

```python
pre_poaching = df.query('period == "1966-68"')  
pre_poaching.head(3)
```

### Antes de la caza furtiva

|     | period  | elephant_id | age | shoulder_height | tusk_length |
| --- | ------- | ----------- | --- | --------------- | ----------- |
| 0   | 1966-68 | 58          | 2.5 | 149             | 30          |
| 1   | 1966-68 | 78          | 2.5 | 151             | 27          |
| 2   | 1966-68 | 86          | 2.5 | 127             | 27          |

---

```python
post_recovery = df.query('period == "2005-13"')  
post_recovery.head(3)
```

### Después de la recuperación

|     | period  | elephant_id | age | shoulder_height | tusk_length |
| --- | ------- | ----------- | --- | --------------- | ----------- |
| 214 | 2005-13 | 52          | 4.5 | 195             | 47.077      |
| 215 | 2005-13 | 14          | 5   | 200             | 48.233      |
| 216 | 2005-13 | 42          | 5   | 180             | 54.012      |

---

## Comparación de promedios

```python
print("Before:", pre_poaching['tusk_length'].mean())  
print("After:", post_recovery['tusk_length'].mean())
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Tusked Elephants/ANEXOS/Pasted image 20260401144123.png]]
### Resultado

- Antes: 67.44 cm
- Después: 57.97 cm

### Interpretación

En promedio, los colmillos disminuyeron después del periodo de caza furtiva.

---

## Problema: factor edad

Los elefantes jóvenes tienen colmillos más pequeños, lo que puede sesgar el análisis.

Para corregir esto, se analiza la relación entre:

- Altura del hombro
- Longitud del colmillo

---

## Gráfico de dispersión

```python
plt.scatter(pre_poaching['shoulder_height'], pre_poaching['tusk_length'], marker='^')  
plt.scatter(post_recovery['shoulder_height'], post_recovery['tusk_length'], marker='s')  
  
plt.xlabel('Shoulder Height (cm)')  
plt.ylabel('Tusk Length (cm)')  
  
plt.text(200, 120, 'Pre-poaching', color='C0')  
plt.text(220, 35, 'Post-recovery', color='C1')
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Tusked Elephants/ANEXOS/Pasted image 20260401144158.png]]
### Observación

Para la misma altura:

- Los elefantes antes de la caza furtiva tienen colmillos más largos
	- Los elefantes después tienen colmillos más cortos

---

## Modelos lineales

### Antes de la caza furtiva

```python
pre_model = LinearModel("pre_poaching")  
pre_model.fit(x=pre_poaching['shoulder_height'], y=pre_poaching['tusk_length'])
```

### Después de la recuperación

```python
post_model = LinearModel("post_recovery")  
post_model.fit(x=post_recovery['shoulder_height'], y=post_recovery['tusk_length'])
```

---

## Graficar modelos

```python
plt.scatter(pre_poaching['shoulder_height'], pre_poaching['tusk_length'], marker='^')  
plt.scatter(post_recovery['shoulder_height'], post_recovery['tusk_length'], marker='s')  
  
plt.xlabel('Shoulder Height (cm)')  
plt.ylabel('Tusk Length (cm)')  
  
plt.text(200, 120, 'Pre-poaching', color='C0')  
plt.text(220, 35, 'Post-recovery', color='C1')  
  
pre_model.plot_model(140, 250, 'C0')  
post_model.plot_model(140, 250, 'C1')
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Tusked Elephants/ANEXOS/Pasted image 20260401144235.png]]

---

## Ecuaciones de los modelos

### Antes de la caza furtiva

```python
post_model.print_model_info()
```

- Pendiente: 0.83
- Intercepto: -91.14
- Ecuación:

y = 0.83x - 91.14

- R²: 0.831

---

### Después de la recuperación

```python
post_model.print_model_info()
```

- Pendiente: 0.40
- Intercepto: -22.02
- Ecuación:

y = 0.40x - 22.02

- R²: 0.431

---

## Conclusión

- La pendiente disminuyó de 0.83 a 0.40
- Esto indica que:
    - La relación entre tamaño corporal y colmillos se debilitó
- La caza furtiva generó una presión evolutiva
- Resultado:
    - Elefantes con colmillos más pequeños sobrevivieron y se reprodujeron más

---