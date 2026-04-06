# E-Bike Stopping Distances

¿Qué tan lejos recorre una bicicleta eléctrica antes de detenerse completamente?

En este proyecto se analiza la relación entre la velocidad y la distancia de frenado en bicicletas eléctricas.  
Se aplican modelos matemáticos para entender mejor este comportamiento físico.

---

## Cargar los datos

```python
import pandas as pd  
import matplotlib.pyplot as plt  
  
df = pd.read_csv('ebike-stopping-distances.csv')  
df
```

### Datos iniciales

|     | speed (km/h) | distance (m) |
| --- | ------------ | ------------ |
| 0   | 15.4         | 3.6          |
| 1   | 16.2         | 3.8          |
| 2   | 17.2         | 4.3          |
| 3   | 19.4         | 5.1          |
| 4   | 25.7         | 7.6          |
| 5   | 26.8         | 8.5          |
| 6   | 32.6         | 9.9          |
| 7   | 34.7         | 11.9         |
| 8   | 36.3         | 14.2         |

La velocidad más alta registrada es 36.3 km/h, con una distancia de frenado de 14.2 m.

---

## Visualización inicial

```python
plt.scatter(df['speed'], df['distance'])  
plt.xlabel('Speed (km/h)')  
plt.ylabel('Stopping distance (m)')
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/E-Bike Stopping Distances/ANEXOS/Pasted image 20260401200007.png]]
### Observación

- A mayor velocidad, mayor distancia de frenado.
- Existe una relación positiva clara.

---

## Modelo Lineal

```python
linear = LinearModel()  
linear.fit(x=df['speed'], y=df['distance'])  
linear.print_model_info()
```

### Resultado del modelo

- Pendiente: **0.45**
- Intercepto: **-3.64**
- Ecuación:  
    **y = 0.45x - 3.64**
- R²: **0.968**

### Problema

- El modelo predice una distancia negativa cuando la velocidad es 0.
- Esto no tiene sentido físico

---

## Verificación del modelo

```python
plt.axhline(color='black', alpha=0.5, linestyle='--')  
plt.axvline(color='black', alpha=0.5, linestyle='--')
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/E-Bike Stopping Distances/ANEXOS/Pasted image 20260401200344.png]]

Se evidencia que el modelo falla en velocidades bajas.

---

## Datos de baja velocidad

```python
df_low = pd.read_csv('ebike-data-low-speed.csv')  
df_low
```

### Tabla

|     | speed (km/h) | distance (m) |
| --- | ------------ | ------------ |
| 0   | 0            | 0            |
| 1   | 2            | 0.04         |
| 2   | 3            | 0.1          |
| 3   | 5            | 0.2          |
| 4   | 7            | 0.33         |
| 5   | 8            | 0.86         |
| 6   | 10           | 1.5          |
| 7   | 11           | 1.79         |
| 8   | 13           | 2.26         |

### Observación

- La relación ya no es lineal.
- Hay curvatura en los datos.

---

## Modelo Cuadrático

Ecuación general:

$y=ax2+bx+cy = ax^2 + bx + cy=ax2+bx+c$

```python
df_all = pd.concat([df, df_low])  
  
quadratic = QuadraticModel()  
quadratic.fit(df_all['speed'], df_all['distance'])  
quadratic.print_model_info()
```

### Resultado

- a = **0.01**
- b = **0.14**
- c = **-0.43**

Ecuación:

y=0.01x2+0.14x−0.43y = 0.01x^2 + 0.14x - 0.43y=0.01x2+0.14x−0.43

- R²: **0.989** ✅ (mejor ajuste)

---

## Interpretación

![[Minería de datos/Curso de Minería de Datos/Data Modeling/E-Bike Stopping Distances/ANEXOS/Pasted image 20260401200825.png]]

- El modelo cuadrático refleja mejor la realidad.
- Tiene sentido físico:
    - La distancia de frenado crece no linealmente con la velocidad.
    - Relacionado con energía cinética:
        
        $KE=12mv2KE = \frac{1}{2}mv^2KE=21​mv2$

---

## Datos de alta velocidad

```python
df_high = pd.read_csv('ebike-data-high-speed.csv')  
df_high
```

### Tabla

|     | speed (km/h) | distance (m) |
| --- | ------------ | ------------ |
| 0   | 38           | 14.35        |
| 1   | 39           | 15.09        |
| 2   | 42           | 17.74        |
| 3   | 42           | 15.75        |
| 4   | 42           | 17.61        |
| ... | ...          | ...          |
| 10  | 56           | 24.51        |
| 11  | 58           | 34.31        |
| 12  | 59           | 30.01        |
| 13  | 61           | 31.59        |
| 14  | 61           | 34.57        |

---

## Evaluación del modelo

```python
quadratic.plot_model(0, 61)
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/E-Bike Stopping Distances/ANEXOS/Pasted image 20260401201000.png]]
### Observación

- El modelo cuadrático predice bastante bien los datos nuevos.
- Se ajusta correctamente incluso a altas velocidades.

---

## Conclusión

- El modelo lineal:
    - Ajusta bien los datos iniciales
    - Pero falla en interpretación física
- El modelo cuadrático:
    - Representa mejor la realidad
    - Se ajusta a todo el rango de velocidades
    - Tiene fundamento físico (energía cinética)

La distancia de frenado de una e-bike crece de forma no lineal con la velocidad, por lo que un modelo cuadrático es más adecuado.

---