# Zero to Python in 60 Seconds

---
## Librerías de Python

El poder de Python proviene de la gran cantidad de librerías disponibles.

Una librería es un paquete de objetos de código reutilizables que puedes importar y combinar con otros códigos para lograr cosas increíbles.

Este curso cubrirá dos librerías populares de ciencia de datos: Pandas y Matplotlib. Pero para introducir algunos conceptos, primero jugaremos con la librería puzzlebox, que fue creada solo por diversión.

Haz clic en el puzzlebox de abajo para ver los objetos que contiene:

![[Minería de datos/Curso de Minería de Datos/Game-Based Intro/ANEXOS/Pasted image 20260329183229.png]]

Este paquete tiene cuatro clases de objetos: Ant, Candle, AntRow y Rocket.

Ahora vamos a importar esta librería en Python y ver qué puede hacer.

---

## Importar librerías

En Python usamos la palabra clave `import` para hacer que una librería esté disponible para programar.

Incluso si nunca has programado en Python antes, intenta importar la librería puzzlebox y hacer que una hormiga camine en la pantalla.

### Objetivos de la actividad:

- Importar la librería puzzlebox
- Crear una hormiga
- Hacer que camine

```python
import puzzlebox as box  
ant = box.Ant()  
ant.walk()
```

¡Funcionó!

---

## Elementos indexados

Algunos objetos tienen sub-elementos a los que podemos acceder por índice usando corchetes [ ]:

`subitem = object[index]`

La numeración de índices en Python empieza en cero.  
El índice 0 es el primero, el 1 es el segundo, y así sucesivamente.

Para ver cómo funciona, crea una fila de hormigas (AntRow) y haz que la segunda hormiga camine.

### Objetivos de la actividad:

- Crear un AntRow con 4 hormigas
- Hacer que la segunda hormiga camine

```python
ants = box.AntRow(4)  
ants[1].walk()
```

¡Los corchetes ganan!

Nota:  
`ants[0]` es la primera hormiga, y `ants[1]` es la segunda.

---

## Lanzar un cohete

Para el gran final, vamos a coordinar varios objetos para lanzar un cohete.

### Objetivos de la actividad:

- Crear una fila de 3 hormigas
- Crear una vela con llama
- Hacer que todas las hormigas caminen

```python
rocket = box.Rocket()  
ants = box.AntRow(3)  
candle = box.Candle(flame=True)  
ants.walk()
```

🚀 ¡Despegue!

---

## Resumen: lo que aprendimos

- **Importar librerías:**  
    `import puzzlebox as box`
- **Crear objetos:**  
    `ant = box.Ant()`
- **Llamar métodos:**  
    `ant.walk()`
- **Argumentos de función:**  
    `AntRow(3)`
- **Argumentos con nombre (keyword):**  
    `Candle(flame=True)`
- **Indexación desde cero:**  
    `ants[0], ants[1], ants[2]`