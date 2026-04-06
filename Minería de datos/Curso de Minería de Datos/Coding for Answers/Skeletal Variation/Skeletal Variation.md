# Skeletal Variation

La comparación de esqueletos entre especies ha llevado a importantes descubrimientos en la biología evolutiva. En este proyecto, explorarás los huesos del cuerpo humano y los compararás con una gran variedad de mamíferos y aves.

---

## Cargando los datos

El archivo 'adult-human-skeleton.csv' contiene información sobre cada hueso del cuerpo humano adulto.  
Carga los datos CSV y obsérvalos.

### Objetivos:

- Importar pandas
- Cargar los datos del esqueleto
- Mostrar el DataFrame

```python
import pandas as pd  
df = pd.read_csv('adult-human-skeleton.csv')  
df
```

Resultado:

|     | name                         | region | subregion | side   | fused_from |
| --- | ---------------------------- | ------ | --------- | ------ | ---------- |
| 0   | frontal                      | head   | cranium   | center | 2          |
| 1   | left parietal                | head   | cranium   | left   | 1          |
| 2   | right parietal               | head   | cranium   | right  | 1          |
| 3   | left temporal                | head   | cranium   | left   | 1          |
| 4   | right temporal               | head   | cranium   | right  | 1          |
| ... | ...                          | ...    | ...       | ...    | ...        |
| 201 | right distal pedal phalanx 1 | foot   | toes      | right  | 1          |
| 202 | right distal pedal phalanx 2 | foot   | toes      | right  | 1          |
| 203 | right distal pedal phalanx 3 | foot   | toes      | right  | 1          |
| 204 | right distal pedal phalanx 4 | foot   | toes      | right  | 1          |
| 205 | right distal pedal phalanx 5 | foot   | toes      | right  | 1          |
206 filas × 5 columnas

Cada fila representa un hueso del cuerpo humano adulto. Podemos ver que los adultos tienen 206 huesos. ¿Qué más podemos descubrir?

---

## Afirmación: el 50% de los huesos están en manos y pies

Puede que hayas escuchado que más de la mitad de los huesos del cuerpo están en las manos y los pies. ¿Es cierto o es un mito?

Usemos el método `value_counts()`.

### Objetivo:

- Contar valores de la columna 'region'

```python
df['region'].value_counts()
```

Resultado:

|       |     |
| ----- | --- |
| head  | 54  |
| foot  | 52  |
| torso | 50  |
| head  | 28  |
| neck  | 8   |
| leg   | 8   |
| arm   | 6   |

Las manos tienen 54 huesos y los pies 52.

Total del cuerpo: 206 huesos. Calculamos la proporción:

```python
(54 + 52) / 206
```

Resultado:

```
0.5145...
```

Más del 51% de los huesos están en manos y pies.  
¡La afirmación es verdadera!

---

## Huesos en bebés

Los bebés tienen más huesos que los adultos. A medida que crecen, algunos huesos se fusionan.

Esto se muestra en la columna 'fused_from'.

Ordenemos los datos:

### Objetivos:

- Ordenar por 'fused_from'
- Orden descendente

```python
df.sort_values(by='fused_from', ascending=False)
```

Ejemplo:

|     | name                         | region | subregion | side   | fused_from |
| --- | ---------------------------- | ------ | --------- | ------ | ---------- |
| 40  | sternum                      | torso  | chest     | center | 6          |
| 30  | c2                           | neck   | vertebra  | center | 5          |
| 82  | sacrum                       | torso  | pelvis    | center | 5          |
| 5   | occipital                    | head   | cranium   | center | 4          |
| 83  | coccyx                       | torso  | pelvis    | center | 4          |
| ... | ...                          | ...    | ...       | ...    | ...        |
| 201 | right distal pedal phalanx 1 | foot   | toes      | right  | 1          |
| 202 | right distal pedal phalanx 2 | foot   | toes      | right  | 1          |
| 203 | right distal pedal phalanx 3 | foot   | toes      | right  | 1          |
| 204 | right distal pedal phalanx 4 | foot   | toes      | right  | 1          |
| 205 | right distal pedal phalanx 5 | foot   | toes      | right  | 1          |

El esternón se forma a partir de la fusión de 6 huesos.

¿Cuántos huesos tienen los bebés antes de la fusión?

### Objetivos:

- Sumar la columna 'fused_from'

```python
df['fused_from'].sum()
```

Resultado:

```python
305
```

Los bebés tienen 305 huesos, que luego se reducen a 206.

---

## Huesos del cuello humano

El cuello es flexible. ¿Cuántos huesos lo componen?

### Objetivo:

- Filtrar donde region sea 'neck'

```python
df.query('region == "neck"')
```

Resultado:

|     | name  | region | subregion | side   | fused_from |
| --- | ----- | ------ | --------- | ------ | ---------- |
| 28  | hyoid | neck   | throat    | center | 3          |
| 29  | c1    | neck   | vertebra  | center | 3          |
| 30  | c2    | neck   | vertebra  | center | 5          |
| 31  | c3    | neck   | vertebra  | center | 3          |
| 32  | c4    | neck   | vertebra  | center | 3          |
| 33  | c5    | neck   | vertebra  | center | 3          |
| 34  | c6    | neck   | vertebra  | center | 3          |
| 35  | c7    | neck   | vertebra  | center | 3          |

El cuello tiene:

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Skeletal Variation/ANEXOS/Pasted image 20260329205128.png]]

- 1 hueso de la garganta
- 7 vértebras cervicales (C1 a C7)

La "C" significa cervical.

---

## Huesos del cuello en mamíferos

Cargamos el archivo:

```python
mammals = pd.read_csv('mammal-neck-bones.csv')  
mammals
```

Resultado: 302 mamíferos.

|     | species             | neck_vertebrae |
| --- | ------------------- | -------------- |
| 0   | cheetah             | 7              |
| 1   | impala              | 7              |
| 2   | giant panda         | 7              |
| 3   | hartebeest          | 7              |
| 4   | moose               | 7              |
| ... | ...                 | ...            |
| 297 | alpaca              | 7              |
| 298 | common wombat       | 7              |
| 299 | red fox             | 7              |
| 300 | fennec fox          | 7              |
| 301 | california sea lion | 7              |

Muchos tienen 7 vértebras… pero ¿todos?

---

### Ejemplo: jirafa

```python
mammals.query('species == "giraffe"')
```

Resultado:

|     | species | neck_vertebrae |
| --- | ------- | -------------- |
| 108 | giraffe | 7              |

A pesar de su cuello largo, la jirafa también tiene 7 vértebras.


---

### Buscar excepciones

```python
mammals.query('neck_vertebrae != 7')
```

Resultado:

|     | species                   | neck_vertebrae |
| --- | ------------------------- | -------------- |
| 27  | pale-throated sloth       | 9              |
| 28  | brown-throated sloth      | 9              |
| 60  | hoffmann's two-toed sloth | 6              |
| 291 | west indian manatee       | 6              |

Solo los perezosos y manatíes no siguen la regla.

---

## Huesos del cuello en aves

Cargamos los datos:

```python
birds = pd.read_csv('bird-neck-bones.csv')  
birds
```

Resultado: 81 aves.

|     | species              | neck_vertebrae |
| --- | -------------------- | -------------- |
| 0   | cinereous vulture    | 13             |
| 1   | guineafowl           | 14             |
| 2   | red-legged partridge | 14             |
| 3   | blue-cheeked parrot  | 12             |
| 4   | northern pintail     | 15             |
| ... | ...                  | ...            |
| 76  | barn owl             | 12             |
| 77  | eurasian hoopoe      | 13             |
| 78  | murre                | 13             |
| 79  | new zealand rockwren | 13             |
| 80  | bushwren             | 13             |

Las aves tienen más vértebras que los mamíferos.

---

## Gráfico de distribución

```python
bird_counts = birds['neck_vertebrae'].value_counts()  
bird_counts = bird_counts.sort_index()  
bird_counts.plot.bar()
```

Esto muestra la distribución de vértebras en aves.

![[Minería de datos/Curso de Minería de Datos/Coding for Answers/Skeletal Variation/ANEXOS/Pasted image 20260330125548.png]]

- Valor más común: **13**
- Máximo: **23**

---

## ¿Qué ave tiene más vértebras?

```python
birds.query('neck_vertebrae == neck_vertebrae.max()')
```

Resultado:

|     | species   | neck_vertebrae |
| --- | --------- | -------------- |
| 28  | mute swan | 23             |

El hermoso cisne mudo  tiene el récord con 23 vértebras cervicales.

---