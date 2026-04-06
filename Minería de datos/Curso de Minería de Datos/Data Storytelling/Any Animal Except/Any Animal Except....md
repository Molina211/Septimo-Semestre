# Any Animal Except...

Durante la exploración global del Imperio Británico (1750–1835), muchos animales exóticos fueron traídos a Inglaterra.

Estos animales se exhibían en menageries (precursoras de los zoológicos), lo que influyó en qué tan frecuentes eran mencionados en textos escritos.

Este proyecto analiza cómo estas exhibiciones afectaron la popularidad de ciertos animales en el lenguaje.

---

## Cargar los datos

```python
import pandas as pd  
import matplotlib.pyplot as plt   
word_trends = pd.read_csv('animal-word-trends.csv')
```

---

## 🔧 Función reutilizable

```python
def plot_animal(animal):  
    trend = word_trends.query("word == @animal")  
    plt.plot(trend['year'], trend['frequency'], label=animal)  
    plt.ylabel('Frecuencia por millón')
```

---

## 🐅 Animales de menagerie

### Animales estudiados:

- tiger
- hyena
- tapir
- toucan
- macaw
- ostrich

### Código 1:

```python
plot_animal('tiger')  
plt.axvspan(1750, 1835, color='magenta', label='Periodo Menagerie')  
plt.title('Periodo de menagerie y frecuencia de "tiger"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402133046.png]]

---

### Código 2:

```python
plot_animal('hyena')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "hyena"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402133240.png]]

---
### Código 3

```python
plot_animal('tapir')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "tapir"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134104.png]]

---

### Código 4

```python
plot_animal('toucan')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "toucan"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134152.png]]

---

### Código 5

```python
plot_animal('macaw')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "macaw"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134231.png]]

---

### Código 6

```python
plot_animal('ostrich')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "ostrich"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134313.png]]

---

## Animales difíciles de mantener

### Animales:

- hummingbird
- chimpanzee
- meerkat
- penguin

### Código 1:

```python
plot_animal('hummingbird')  
plt.axvspan(1750, 1835, color='magenta', label='Periodo Menagerie')  
plt.title('Periodo de menagerie y frecuencia de "hummingbird"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134413.png]]

---

### Código 2:

```python
plot_animal('chimpanzee')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "chimpanzee"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134507.png]]

---

### Código 3:

```python
plot_animal('meerkat')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "meerkat"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134541.png]]

---

### Código 4:

```python
plot_animal('penguin')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for "penguin"')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134618.png]]

---

## 🧠 Mecanismo explicativo

Los animales exhibidos eran más visibles para la sociedad y los escritores, lo que generó:

- Mayor interés público
- Más menciones en textos
- Mayor frecuencia en el lenguaje

---

## Animales australianos

### Animales:

- kangaroo
- koala
- wombat

### Código 1:

```python
plot_animal('kangaroo')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for kangaroo')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134757.png]]

---

### Código 2:

```python
plot_animal('koala')
plt.axvspan(1750, 1835, color='magenta', label='Menagerie Period')
plt.title('The menagerie period and word frequency for koala')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134838.png]]

---
### Código 3:

```python
plot_animal('wombat')  
plt.axvspan(1750, 1835, color='magenta', label='Periodo Menagerie')  
plt.title('Periodo de menagerie y frecuencia de wombat')
```

## Observación

![[Minería de datos/Curso de Minería de Datos/Data Storytelling/Any Animal Except/ANEXOS/Pasted image 20260402134715.png]]

---

## 🐨 Caso especial: Koala

Los koalas tienen una dieta muy específica (hojas de eucalipto), lo que dificultaba su supervivencia fuera de Australia.

Esto llevó a la famosa frase de Charles Jamarach:

> "…cualquier animal, excepto un koala."

---