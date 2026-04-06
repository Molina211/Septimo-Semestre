# Is Granola Healthy?

¿Qué alimentos son realmente saludables?    
A veces existe consenso general, pero en otras ocasiones, la opinión del público difiere de la de los expertos en nutrición.  
  
En este proyecto se construye una visualización para comparar el nivel de acuerdo entre ambas perspectivas. Además, se aplican buenas prácticas para mejorar gráficos tipo scatter.  
  
---  
  
## Cargar y limpiar los datos  
  
### Datos del público  
  
```python  
import pandas as pd  
import matplotlib.pyplot as plt  
df_public = pd.read_csv('healthy-food-survey-public.csv')  
df_public
```

|     | food              | yes | no  | no_opinion |
| --- | ----------------- | --- | --- | ---------- |
| 0   | almonds           | 913 | 55  | 24         |
| 1   | apples            | 945 | 31  | 7          |
| 2   | avocados          | 882 | 88  | 59         |
| 3   | baked potatoes    | 666 | 248 | 26         |
| 4   | butter            | 338 | 600 | 34         |
| ... | ...               | ... | ... | ...        |
| 35  | sushi             | 500 | 307 | 209        |
| 36  | tofu              | 568 | 228 | 194        |
| 37  | white bread       | 124 | 476 | 20         |
| 38  | whole milk        | 628 | 393 | 50         |
| 39  | whole wheat bread | 850 | 140 | 23         |

---

## Calcular porcentaje del público

```python
df_public['public'] = df_public.eval('yes / (yes + no + no_opinion)')  
df_public['public'] = df_public.eval('public * 100').round()  
df_public
```

|     | food              | yes | no  | no_opinion | public |
| --- | ----------------- | --- | --- | ---------- | ------ |
| 0   | almonds           | 913 | 55  | 24         | 92     |
| 1   | apples            | 945 | 31  | 7          | 96     |
| 2   | avocados          | 882 | 88  | 59         | 86     |
| 3   | baked potatoes    | 666 | 248 | 26         | 71     |
| 4   | butter            | 338 | 600 | 34         | 35     |
| ... | ...               | ... | ... | ...        | ...    |
| 35  | sushi             | 500 | 307 | 209        | 49     |
| 36  | tofu              | 568 | 228 | 194        | 57     |
| 37  | white bread       | 124 | 476 | 20         | 20     |
| 38  | whole milk        | 628 | 393 | 50         | 59     |
| 39  | whole wheat bread | 850 | 140 | 23         | 84     |

---

## Mantener solo columnas necesarias

```python
df_public = df_public[['food', 'public']]  
df_public
```

|     | food              | public |
| --- | ----------------- | ------ |
| 0   | almonds           | 92     |
| 1   | apples            | 96     |
| 2   | avocados          | 86     |
| 3   | baked potatoes    | 71     |
| 4   | butter            | 35     |
| ... | ...               | ...    |
| 35  | sushi             | 49     |
| 36  | tofu              | 57     |
| 37  | white bread       | 20     |
| 38  | whole milk        | 59     |
| 39  | whole wheat bread | 84     |

---

## Datos de expertos

```python
df_experts = pd.read_csv('healthy-food-survey-experts.csv')  
df_experts['experts'] = df_experts.eval('yes / (yes + no + no_opinion)')  
df_experts['experts'] = df_experts.eval('experts * 100').round()  
df_experts = df_experts[['food', 'experts']]  
df_experts
```

|     | food              | experts |
| --- | ----------------- | ------- |
| 0   | almonds           | 98      |
| 1   | apples            | 99      |
| 2   | avocados          | 95      |
| 3   | baked potatoes    | 72      |
| 4   | butter            | 40      |
| ... | ...               | ...     |
| 35  | sushi             | 75      |
| 36  | tofu              | 85      |
| 37  | white bread       | 15      |
| 38  | whole milk        | 64      |
| 39  | whole wheat bread | 90      |

---

## Unir datasets

```python
df = df_public.merge(df_experts, on='food', how='left')  
df
```

|     | food              | public | experts |
| --- | ----------------- | ------ | ------- |
| 0   | almonds           | 92     | 98      |
| 1   | apples            | 96     | 99      |
| 2   | avocados          | 86     | 95      |
| 3   | baked potatoes    | 71     | 72      |
| 4   | butter            | 35     | 40      |
| ... | ...               | ...    | ...     |
| 35  | sushi             | 49     | 75      |
| 36  | tofu              | 57     | 85      |
| 37  | white bread       | 20     | 15      |
| 38  | whole milk        | 59     | 64      |
| 39  | whole wheat bread | 84     | 90      |

---

## Visualización inicial

```python
plt.scatter(df['public'], df['experts'])  
plt.xlabel('Public (%)')  
plt.ylabel('Experts (%)')  
plt.title('Is food healthy?')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/Is Granola Healthy/ANEXOS/Pasted image 20260331233344.png]]

---

## Pro Tips para mejorar el gráfico

### Pro Tip 1: Línea de igualdad

```python
def add_equality_line():  
    x = [0, 50, 100]  
    y = [0, 50, 100]  
    plt.plot(x, y, color='black', alpha=0.5, linestyle='--')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/Is Granola Healthy/ANEXOS/Pasted image 20260331233407.png]]

---

### Pro Tip 2: Cuadrar el gráfico

```python
def square_the_plot():  
    plt.xlim(0, 100)  
    plt.ylim(0, 100)  
    ax = plt.gca()  
    ax.set_aspect(1)
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/Is Granola Healthy/ANEXOS/Pasted image 20260331233453.png]]

---

### Pro Tip 3: Transparencia

```python
def plot_data():  
    plt.scatter(df['public'], df['experts'], alpha=0.5)
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/Is Granola Healthy/ANEXOS/Pasted image 20260331233514.png]]

---

## Identificar desacuerdos

```python
df['public_minus_experts'] = df.eval('public - experts')  
df = df.sort_values(by='public_minus_experts', ascending=False)
highest_disagreement = df.head(4)  
highest_disagreement
```

|     | food          | public | experts | public_minus_experts |
| --- | ------------- | ------ | ------- | -------------------- |
| 19  | granola bar   | 71     | 28      | 43                   |
| 11  | coconut oil   | 73     | 37      | 36                   |
| 17  | frozen yogurt | 66     | 32      | 34                   |
| 18  | granola       | 80     | 47      | 33                   |

---

## Agregar etiquetas

```python
plt.scatter(df['public'], df['experts'], alpha=0.5)
format_plot()
add_equality_line()
square_the_plot()
add_labels(highest_disagreement, 'public', 'experts', 'food')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/Is Granola Healthy/ANEXOS/Pasted image 20260331233648.png|477]]

```python
def add_labels(df, x_col, y_col, label_col):  
    for (i, row) in df.iterrows():  
        x = row[x_col]  
        y = row[y_col]  
        label = "  " + row[label_col]  
        plt.text(x, y, label, va='center', ha='left')
```

---

## Código final

```python
def format_plot():  
    plt.xlabel('Public (%)')  
    plt.ylabel('Experts (%)')  
    plt.title('Is food healthy?')  
  
def add_equality_line():  
    x = [0, 50, 100]  
    y = [0, 50, 100]  
    plt.plot(x, y, color='black', alpha=0.5, linestyle='--')  
  
def square_the_plot():  
    plt.xlim(0, 100)  
    plt.ylim(0, 100)  
    ax = plt.gca()  
    ax.set_aspect(1)  
  
def add_labels(df, x_col, y_col, label_col):  
    for (i, row) in df.iterrows():  
        x = row[x_col]  
        y = row[y_col]  
        label = "  " + row[label_col]  
        plt.text(x, y, label, va='center', ha='left')  
  
plt.scatter(df['public'], df['experts'], alpha=0.5)  
format_plot()  
add_equality_line()  
square_the_plot()  
add_labels(highest_disagreement, 'public', 'experts', 'food')
```

---

## Conclusión

- La mayoría de los alimentos muestran acuerdo entre público y expertos.
- Los puntos alejados de la línea diagonal representan desacuerdos.
- Ejemplo: granola y granola bar son percibidos como más saludables por el público que por los expertos.

---