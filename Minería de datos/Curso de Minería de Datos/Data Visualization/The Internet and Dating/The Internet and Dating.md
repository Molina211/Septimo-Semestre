# The Internet and Dating

Cisco fue fundada por Sandy Lerner y Leonard Bosak debido al amor y la necesidad de comunicarse.

En 1984, mientras trabajaban en diferentes edificios de Stanford University, desarrollaron una forma de conectar sus computadoras a larga distancia. Esto dio origen a las redes de computadoras y a Cisco.

En este proyecto se analiza cómo ha cambiado la forma en que las parejas se conocen, especialmente con la llegada de Internet. También se aplican buenas prácticas para mejorar gráficos de líneas múltiples.

---

## Cargar los datos

```python
import pandas as pd  
import matplotlib.pyplot as plt  
df = pd.read_csv('how-couples-met.csv')  
df
```

### Datos iniciales (formato Obsidian)

|     | decade | college | at work | through friends | through family | online | restaurant | neighbors |
| --- | ------ | ------- | ------- | --------------- | -------------- | ------ | ---------- | --------- |
| 0   | 1960   | 12.2    | 18.2    | 45.9            | 30.4           | 0      | 21.5       | 11.6      |
| 1   | 1970   | 16.4    | 23.9    | 48.9            | 28.6           | 0      | 25         | 8.9       |
| 2   | 1980   | 10.2    | 32.4    | 36.6            | 20.2           | 0.3    | 28.3       | 8         |
| 3   | 1990   | 10.5    | 30.7    | 35.9            | 18.5           | 3.2    | 26.2       | 7.7       |
| 4   | 2000   | 10.6    | 20.3    | 38.1            | 15.2           | 22.6   | 18.5       | 8.8       |
| 5   | 2010   | 6.7     | 15.5    | 28.9            | 10             | 42.2   | 14         | 4.3       |

---

## Configurar el índice

```python
df = df.set_index('decade')  
df
```

| decade | college | at work | through friends | through family | online | restaurant | neighbors |
| ------ | ------- | ------- | --------------- | -------------- | ------ | ---------- | --------- |
| 1960   | 12.2    | 18.2    | 45.9            | 30.4           | 0      | 21.5       | 11.6      |
| 1970   | 16.4    | 23.9    | 48.9            | 28.6           | 0      | 25         | 8.9       |
| 1980   | 10.2    | 32.4    | 36.6            | 20.2           | 0.3    | 28.3       | 8         |
| 1990   | 10.5    | 30.7    | 35.9            | 18.5           | 3.2    | 26.2       | 7.7       |
| 2000   | 10.6    | 20.3    | 38.1            | 15.2           | 22.6   | 18.5       | 8.8       |
| 2010   | 6.7     | 15.5    | 28.9            | 10             | 42.2   | 14         | 4.3       |

---

## Gráfico inicial

```python
df.plot()
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401142452.png]]
### Observación

Se observa un crecimiento muy fuerte en la forma de conocer pareja **online**, especialmente a partir del año 2000.

---

## Enfatizar la historia (focus en "online")

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401142847.png]]

```python
focus_column = 'online'  
focus_color = 'C3'  
  
back_columns = [  
    'college', 'at work', 'through friends',  
    'through family', 'restaurant', 'neighbors'  
]  
  
back_colors = ['C0', 'C1', 'C2', 'C4', 'C5', 'C6']  
  
df.plot(y=back_columns, color=back_colors, alpha=0.5)  
plt.plot(df.index, df[focus_column], color=focus_color, linewidth=5)
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401142907.png]]

---

## Pro Tip 1: Etiquetar líneas directamente

```python
def add_end_labels(df, x, column_names, alpha):  
    for column_name in column_names:  
        y = df[column_name].iloc[-1]  
        label = "  " + column_name  
        plt.text(x, y, label, va="center", alpha=alpha)
```

### Aplicación

```python
df.plot(y=back_columns, color=back_colors, alpha=0.5)  
plt.plot(df.index, df[focus_column], color=focus_color, linewidth=5)  
  
plt.legend().set_visible(False)  
  
add_end_labels(df, 2010, back_columns, alpha=0.5)  
add_end_labels(df, 2010, [focus_column], alpha=1)
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401142937.png]]

---

## Pro Tip 2: Limpiar ejes

```python
def clean_axes():  
    ax = plt.gca()  
    ax.spines[['left', 'top', 'right']].set_visible(False)  
    ax.tick_params(axis='y', length=0)  
    plt.grid(axis='y', alpha=0.5)
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401142957.png]]

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401143015.png]]

---

## Pro Tip 3: Evitar texto rotado

```python
def add_axes_labels():  
    y_ticks = [0, 10, 20, 30, 40, 50]  
    y_tick_labels = ['0', '10', '20', '30', '40', '50%']  
    plt.yticks(y_ticks, y_tick_labels)  
    plt.xlabel('Decade')
```

![[Minería de datos/Curso de Minería de Datos/Data Visualization/The Internet and Dating/ANEXOS/Pasted image 20260401143041.png]]

---

## Código final

```python
def add_end_labels(df, x, column_names, alpha):  
    for column_name in column_names:  
        y = df[column_name].iloc[-1]  
        label = "  " + column_name  
        plt.text(x, y, label, va="center", alpha=alpha)  
  
def clean_axes():  
    ax = plt.gca()  
    ax.spines[['left', 'top', 'right']].set_visible(False)  
    ax.tick_params(axis='y', length=0)  
    plt.grid(axis='y', alpha=0.5)  
  
def add_axes_labels():  
    y_ticks = [0, 10, 20, 30, 40, 50]  
    y_tick_labels = ['0', '10', '20', '30', '40', '50%']  
    plt.yticks(y_ticks, y_tick_labels)  
    plt.xlabel('Decade')  
  
focus_column = 'online'  
focus_color = 'C3'  
  
back_columns = [  
    'college', 'at work', 'through friends',  
    'through family', 'restaurant', 'neighbors'  
]  
  
back_colors = ['C0', 'C1', 'C2', 'C4', 'C5', 'C6']  
  
df.plot(y=back_columns, color=back_colors, alpha=0.5)  
plt.plot(df.index, df[focus_column], color=focus_color, linewidth=5)  
  
plt.legend().set_visible(False)  
  
add_end_labels(df, 2010, back_columns, alpha=0.5)  
add_end_labels(df, 2010, [focus_column], alpha=1)  
  
clean_axes()  
add_axes_labels()
```

---

## Conclusión

- La forma de conocer pareja ha cambiado significativamente con el tiempo.
- Antes predominaban métodos tradicionales como amigos y familia.
- En la actualidad, Internet es el método dominante.
- Aplicar foco visual en los gráficos permite contar mejor la historia de los datos.

---