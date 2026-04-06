# Lion Attacks

La humanidad ha temido durante mucho tiempo la oscuridad debido a los depredadores nocturnos. Los cazadores nocturnos, como los leones, tienen una excelente visión en condiciones de poca luz.

En este proyecto se analiza la influencia de la luz de la luna en la actividad de caza de los leones.

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Lion Attacks/ANEXOS/Pasted image 20260401145500.png]]

---

## Cargar los datos

```python
import pandas as pd  
import matplotlib.pyplot as plt  
  
df = pd.read_csv('lion-attacks-lunar-cycle.csv')  
df
```

### Datos

|     | lunar_day | evening_moonlight | attacks |
| --- | --------- | ----------------- | ------- |
| 0   | 0         | 0                 | 10      |
| 1   | 1         | 0.01              | 9       |
| 2   | 2         | 0.038             | 10      |
| 3   | 3         | 0.1               | 11      |
| 4   | 4         | 0.17              | 6       |
| ... | ...       | ...               | ...     |
| 25  | 25        | 0                 | 12      |
| 26  | 26        | 0                 | 8       |
| 27  | 27        | 0                 | 10      |
| 28  | 28        | 0                 | 9       |
| 29  | 29        | 0                 | 16      |

---

## Interpretación de variables

- evening_moonlight: nivel de luz lunar entre 6pm y 10pm (0 a 1)
- Depende de:
    - Fase de la luna
    - Tiempo visible en la noche

Durante casi la mitad del ciclo lunar, no hay luz en la noche temprana.

---

## Ataques vs luz lunar

```python
plt.scatter(df['evening_moonlight'], df['attacks'], alpha=0.5)  
plt.xlabel('Evening Moonlight')  
plt.ylabel('Number of Lion Attacks')
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Lion Attacks/ANEXOS/Pasted image 20260401145613.png]]

### Observación

Existe una relación negativa:

- A mayor luz lunar → menos ataques
- A menor luz lunar → más ataques

---

## Modelo lineal

```python
attack_model = LinearModel("attacks")  
attack_model.fit(x=df['evening_moonlight'], y=df['attacks'])
```

### Graficar modelo

```python
plt.scatter(df['evening_moonlight'], df['attacks'], alpha=0.5)  
plt.xlabel('Evening Moonlight')  
plt.ylabel('Number of Lion Attacks')  
  
attack_model.plot_model(0, 1)
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Lion Attacks/ANEXOS/Pasted image 20260401145652.png]]

---

## Ecuación del modelo

```python
attack_model.print_model_info()
```

- Pendiente: -8.92
- Intercepto: 11.65

y = -8.92x + 11.65

- R²: 0.475

### Interpretación

- Pendiente negativa → más luz = menos ataques
- Ajuste moderado del modelo

---

## Correlación vs causalidad

En ciencia de datos:

**"Correlación no implica causalidad"**

Para demostrar causalidad se necesitan:

1. Un mecanismo lógico
2. Evidencia independiente

### Posible explicación

La luz de la luna ayuda a los humanos a **ver a los leones y evitarlos**.

---

## Segundo dataset: tamaño del estómago

```python
df_belly = pd.read_csv('lion-belly-sizes.csv')  
df_belly
```

### Datos

|     | lunar_day | moonlight | belly_size |
| --- | --------- | --------- | ---------- |
| 0   | 0         | 0         | 0.5        |
| 1   | 1         | 0.003     | 0.507      |
| 2   | 2         | 0.013     | 0.503      |
| 3   | 3         | 0.033     | 0.493      |
| 4   | 4         | 0.071     | 0.49       |
| ... | ...       | ...       | ...        |
| 25  | 25        | 0.04      | 0.504      |
| 26  | 26        | 0.023     | 0.511      |
| 27  | 27        | 0.007     | 0.5        |
| 28  | 28        | 0.001     | 0.497      |
| 29  | 29        | 0         | 0.49       |

---

## Tamaño del estómago vs luz lunar

```python
plt.scatter(df_belly['moonlight'], df_belly['belly_size'], alpha=0.5)  
plt.xlabel('Moonlight')  
plt.ylabel('Lion Belly Size')
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Lion Attacks/ANEXOS/Pasted image 20260401195202.png]]
### Observación

Relación negativa:

- Más luz → menor tamaño de estómago
- Menos luz → mayor tamaño

Esto sugiere que los leones comen menos cuando hay más luz.

---

## Modelo lineal (belly)

```python
belly_model = LinearModel("belly")  
belly_model.fit(df_belly['moonlight'], df_belly['belly_size'])
```

### Graficar modelo

```python
plt.scatter(df_belly['moonlight'], df_belly['belly_size'], alpha=0.5)  
plt.xlabel('Moonlight')  
plt.ylabel('Lion Belly Size')  
  
belly_model.plot_model(0, 1)
```

![[Minería de datos/Curso de Minería de Datos/Data Modeling/Lion Attacks/ANEXOS/Pasted image 20260401195236.png]]

---

## Ecuación del modelo

```python
belly_model.print_model_info()
```

- Pendiente: -0.03
- Intercepto: 0.50

y = -0.03x + 0.50

- R²: 0.682

---

## Interpretación

- Pendiente negativa → más luz = menos comida
- Mejor ajuste que el modelo anterior

---

## Conclusión

- Dos datasets independientes muestran el mismo patrón:
    - Más luz lunar → menos éxito en caza
- Evidencia:
    1. Menos ataques a humanos
    2. Menor tamaño de estómago
- Explicación:
    - La luz permite a las presas detectar a los leones
    - Esto reduce su efectividad al cazar

---