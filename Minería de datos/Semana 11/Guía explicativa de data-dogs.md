# Guía explicativa de data-dogs

---

## Celda 1

**Qué hace la celda**

- Importa librerías clave de análisis/ML: numpy, pandas, matplotlib, seaborn, scipy, sklearn, statsmodels.
- Agrega .. a sys.path para poder importar módulos locales del proyecto.
- Importa engine desde scripts.database para conexión con PostgreSQL.
- Crea la carpeta ../data/graficas si no existe.
- Configura estilo visual global de gráficas (seaborn + matplotlib).
- Imprime confirmación: OK - Librerias importadas.

**Lo más relevante**

- Esta celda no modela: **prepara el entorno completo**.
- Valida que dependencias, rutas e importaciones del proyecto funcionan.
- Deja listo el pipeline para que las celdas siguientes no fallen por setup.

**Qué se concluye del resultado esperado**

- Si ves OK - Librerias importadas, el entorno base está correcto.
- Si falla aquí, el problema es de entorno (kernel, paquetes, path, conexión), no del análisis estadístico.

---

## Celda 2

**Qué hace la celda**

- Define una consulta SQL a la tabla razas_perros.
- Extrae variables clave: vida_*, peso_*, categoria_peso, hipoalergenico, fecha_extraccion.
- Carga el resultado en df con pd.read_sql(...).
- Imprime tamaño del dataset (filas/columnas).
- Muestra df.head() para inspección rápida.

**Lo más relevante**

- Es la celda que **inyecta los datos reales** al notebook.
- Confirma que conexión DB + query + esquema de columnas están correctos.
- Te permite detectar de inmediato si faltan columnas o tipos raros desde origen.

**Qué se concluye del resultado esperado**

- Si devuelve filas, columnas y una muestra coherente, la etapa de extracción está bien.
- Si falla, normalmente es por credenciales/DB host/tabla no encontrada.
- Si pasa, ya puedes confiar en que el EDA/modelado trabaja sobre datos cargados correctamente.

---

## Celda 3

**Qué hace la celda**

- Ejecuta diagnóstico básico del DataFrame (info).
- Cuenta nulos por variable.
- Muestra estadísticas descriptivas de numéricas (describe).
- Revisa distribución por categorías clave (por ejemplo categoria_peso).

**Lo más relevante**

- Evalúa calidad de datos antes de modelar.
- Identifica variables con riesgo de sesgo por faltantes (hipoalergenico).
- Confirma que variables numéricas sí están listas para regresión.
- Señala qué columnas categóricas requerirán codificación si entran al modelo.

**Qué se concluye del resultado esperado**

- Dataset sólido para ML si la mayoría de columnas clave están completas.
- hipoalergenico suele ser el foco principal de limpieza (nulos significativos).
- La distribución por categoria_peso permite análisis comparativos útiles.
- Hay que cuidar fuga de información si se usan variables derivadas entre sí (promedios con sus componentes).

**Implementación**

- Quitamos hipoalergénico porque tenía muchos faltantes y no era parte del objetivo actual de regresión.
- Al dejar una una celda 3.1 que crea directamente el dataset sin esa columna, evitamos errores por orden de ejecución y evitamos que se “cuelen” nulos innecesarios en pasos posteriores.
- La celda 3.2 quedó para validar que el nuevo dataset (ya limpio para el objetivo) esté bien antes de seguir.

Fue para **evitar sesgos/ruido por faltantes**, **reducir riesgo de errores en Jupyter**, y asegurar que todo el notebook use desde temprano el dataset correcto para el modelo.

---

## Celda 4

**Qué hace la celda**

- Selecciona variables numéricas clave: vida_promedio, peso_promedio, peso_macho_max, peso_hembra_max, diferencia_sexual_peso.
- Ejecuta describe() para obtener métricas descriptivas: count, mean, std, min, cuartiles (25%, 50%, 75%) y max.
- Redondea a 3 decimales para lectura clara.

**Lo más relevante**

- Tienes count = 1000 en todas esas variables: no hay faltantes en numéricas críticas.
- vida_promedio: media 14.202, mediana 14.0, rango 4.5 a 20.5.
- peso_promedio: media 23.989, mediana 19.025, rango muy amplio 1.4 a 110.0.
- diferencia_sexual_peso: media 2.063, mediana 1.1, máximo 20.0 (hay razas con brecha marcada macho-hembra).

**Qué se concluye del resultado (esperado en ML/EDA)**

- Para esta etapa, el resultado es bueno: variables numéricas completas y listas para modelar.
- Hay **alta dispersión en pesos** (std de peso_promedio ≈ 20.245), lo que sugiere posibles outliers/asimetría; es normal con razas muy pequeñas y gigantes.
- Como mean > median en pesos, probablemente hay sesgo a la derecha (colas de razas muy pesadas).
- Esta celda confirma que conviene seguir con visualización (hist/boxplot) y considerar transformaciones/robustez si los extremos afectan el modelo.

**1) Definición de cada dato (describe) y cómo analizarlo**

- count: cantidad de valores no nulos. Si baja mucho frente al total, hay problema de faltantes.
- mean: promedio. Resume el centro, pero puede moverse por outliers.
- std: dispersión respecto al promedio. Alto = datos muy variados; bajo = datos más concentrados.
- min: menor valor observado. Sirve para detectar posibles errores o extremos bajos.
- 25% (Q1): el 25% de datos está en o por debajo de ese valor.
- 50% (mediana): punto central real. Es más robusto que la media cuando hay outliers.
- 75% (Q3): el 75% de datos está en o por debajo de ese valor.
- max: mayor valor observado. Detecta extremos altos.

- Comparación mean vs mediana: si mean > mediana, suele haber sesgo a la derecha; si mean < mediana, a la izquierda.

**2) Qué te dicen esos datos en tus 5 columnas**

**vida_promedio**

- count=1000: sin faltantes, buena calidad.
- mean=14.202 y mediana=14.0: centro estable, casi sin sesgo.
- std=3.128: variación moderada.
- min=4.5, max=20.5: rango razonable para expectativa de vida.
- Conclusión: variable objetivo bastante limpia y estable para regresión.

**peso_promedio**

- count=1000: completo.
- mean=23.989 mayor que mediana=19.025: sesgo a la derecha.
- std=20.245: alta dispersión.
- min=1.4, max=110: rango muy amplio, probable presencia de extremos.
- Conclusión: variable útil, pero sensible a outliers; conviene revisar boxplot/histograma.

**peso_macho_max**

- count=1000: completo.
- mean=25.021 > mediana=20.0: también sesgo a la derecha.
- std=21.270: dispersión muy alta.
- min=1.5, max=110: extremos altos claros.
- Conclusión: informativa, pero puede influir mucho en el modelo por valores grandes.

**peso_hembra_max**

- count=1000: completo.
- mean=22.958 > mediana=18.1: sesgo a la derecha.
- std=19.261: dispersión alta.
- min=1.3, max=110: rango amplio.
- Conclusión: patrón similar a macho; probablemente alta correlación con otras variables de peso.

**diferencia_sexual_peso**

- count=1000: completo.
- mean=2.063 > mediana=1.1: sesgo a la derecha.
- std=2.726: dispersión moderada-alta relativa a su escala.
- min=0, max=20: la mayoría con diferencia baja, pocos casos muy altos.
- Conclusión: útil para captar dimorfismo, pero con cola larga.

**Lectura global**

- Calidad de datos: buena (todo con count=1000).
- Estructura de distribución: pesos con sesgo a la derecha y alta variabilidad.
- Implicación para modelado: mantener variables de peso, pero validar outliers y robustez (por ejemplo comparar modelo base vs robusto).

---

### Sesgo

El Sesgo (en distribución de datos) es cuando los valores no están “simétricos” alrededor del centro.

- **Sesgo a la derecha (positivo)**: la cola larga está hacia valores altos; suele pasar cuando hay pocos valores muy grandes.
- **Sesgo a la izquierda (negativo)**: la cola larga está hacia valores bajos.

En tu caso, pesos y diferencia sexual tenían sesgo a la derecha: muchos valores bajos/medios y pocos muy altos.

---

### Log1p

Para qué sirve:

- Comprime valores grandes más que los pequeños.
- Reduce sesgo a la derecha.
- Suele estabilizar varianza y hacer la distribución más “manejable” para modelos lineales.

Por qué log1p y no solo log:

- log(0) no existe.
- log1p(0) = 0, así que funciona bien cuando hay ceros (como en diferencia_sexual_peso).

---

## Celda 5

**Qué hace la celda**

- La **celda 5** grafica histogramas de distribución **antes de transformar** (datos originales).
- Arma una figura (subplots) para variables de peso y diferencia sexual (peso_promedio, peso_macho_max, etc.).
- En cada gráfico muestra frecuencia y etiqueta de la variable.
- Guarda la imagen en ../data/graficas/eda_distribuciones_dogs.png.

**Lo más relevante**

- Es una celda de **diagnóstico de forma de distribución** (simetría, colas, outliers).
- Sirve como línea base para comparar con la celda 5.1 (después de log1p).
- Te dice visualmente si hay **sesgo a la derecha** en pesos (muy común en este dataset).

**Qué se concluye del resultado esperado**

- Lo normal en DataDogs es ver pesos con cola derecha (razas muy pesadas empujan la distribución).
- Si ves esa asimetría, está bien justificada la transformación log1p de la celda 4.1/5.1.
- Esta celda no evalúa modelo todavía: valida si el preprocesamiento de variables tiene sentido estadístico antes de entrenar.

**Grafica de diferencia de peso por sexo**

Se ve así porque diferencia_sexual_peso tiene este patrón natural:

- Casi todas las razas tienen diferencia de peso macho-hembra **pequeña**.
- Muy pocas razas tienen diferencia **muy grande**.

Entonces en la gráfica:

- se junta mucha barra al principio (valores bajos),
- y sale una “cola” hacia la derecha (pocos valores altos).

---

## Celda 6

**Qué hace la celda**

- La **celda 6** construye **boxplots por categoria_peso**.
- Compara dos variables:
    - peso_promedio por categoría.
    - vida_promedio por categoría.
- Ordena categorías (Muy pequeño → Gigante) y guarda la figura en ../data/graficas/eda_boxplots_categoria_dogs.png.

**Lo más relevante**

- Muestra **mediana, rango intercuartílico y outliers** por grupo.
- Permite ver si categoria_peso realmente separa poblaciones distintas.
- Es clave para detectar heterogeneidad entre grupos antes de modelar.

**Qué se concluye del resultado esperado**

- En peso_promedio, se espera una separación clara entre categorías (coherencia del ETL/feature).
- En vida_promedio, puedes evaluar si hay tendencia por tamaño (p. ej., categorías más pesadas con vida diferente).
- Si hay mucho solapamiento o muchos outliers, conviene robustecer el modelado (transformaciones, validación de variables o modelos más flexibles).

**Implementación:**

Qué sí cambió en el box de peso (izquierda):

- Se comprimieron más los valores altos.
- Disminuye visualmente la asimetría/cola derecha.
- La diferencia entre grupos sigue existiendo, pero en escala logarítmica.

---

## Celda 7

**Qué hace la celda**

- La **celda 7** calcula la matriz de correlación (corr) entre variables numéricas (vars_num).
- La visualiza con un **heatmap** para ver fuerza y signo de relación (positiva/negativa).
- Guarda la figura en ../data/graficas/eda_correlacion_dogs.png.
- Imprime un ranking de correlación de cada variable contra vida_promedio (ordenado).

**Lo más relevante**

- Es la celda que te dice **qué X tienen más señal** para predecir vida_promedio.
- Ayuda a elegir features para modelo simple y múltiple.
- También alerta de **colinealidad** entre predictores (ej. peso_macho_max vs peso_hembra_max).

**Qué se concluye del resultado esperado**

- En este tipo de dataset, se espera que variables de peso tengan correlaciones más visibles con vida_promedio.
- Si alguna correlación está cerca de 0, esa variable aporta poca relación lineal directa.
- Correlación alta entre dos X no es “malo”, pero sí puede causar problemas en regresión múltiple (se revisa luego con VIF).
- Importante: correlación **no implica causalidad**; solo guía el modelado inicial.

### Correlación

- **Positiva (r > 0)**: cuando la X aumenta, vida_promedio **tiende a aumentar** (se mueven en el mismo sentido). Ej: r=0.4.
- **Negativa (r < 0)**: cuando la X aumenta, vida_promedio **tiende a disminuir** (sentido contrario). Ej: r=-0.4.
- **Cerca de 0 (r ≈ 0)**: **no hay relación lineal clara** entre esa X y vida_promedio (puede existir relación no lineal, pero lineal casi no).

Y lo de “correlación alta entre dos X”:

- Si dos X están muy correlacionadas entre sí (ej. r=0.95), aportan información casi repetida.
- En regresión múltiple eso puede causar **multicolinealidad**: coeficientes que cambian mucho y son difíciles de interpretar; por eso se revisa con **VIF**.

- **Correlación positiva**: cuando una variable X sube, **vida_promedio también sube**.
- **Correlación negativa**: cuando una variable X sube, **vida_promedio baja** (relación inversa).

- Si muchas variables se comportan igual (todas suben o todas bajan juntas), puede haber **multicolinealidad** (variables muy parecidas entre sí).

**Qué tan fuerte es la relación (|r|):**

- < 0.10 → casi nula
- 0.10–0.30 → débil
- 0.30–0.50 → moderada
- > 0.50 → fuerte
    

Lo importante no es solo el número, sino:

- que **tenga sentido lógico**
- y que **ayude al modelo a predecir mejor**

---

## Celda 8

**Qué hace la celda**

- La **celda 8** crea **3 scatter plots bivariados** con vida_promedio como variable objetivo.
- Compara estas relaciones:
    - peso_promedio vs vida_promedio
    - peso_macho_max vs vida_promedio
    - diferencia_sexual_peso vs vida_promedio
- Para cada gráfico:
    - limpia nulos (dropna)
    - dibuja los puntos (scatter)
    - ajusta una **línea de tendencia lineal** (np.polyfit).

**Lo más relevante**

- Es la validación visual de si hay **patrón lineal** (base de regresión lineal).
- Te deja ver **dispersión**, **outliers** y posible **fuerza de relación** por variable.
- Complementa la matriz de correlación: aquí ves la forma real de la relación, no solo un número.

**Qué se concluye del resultado esperado**

- Si la nube de puntos sigue una pendiente clara (arriba o abajo), esa feature aporta señal lineal para el modelo.
- Si hay mucha nube sin forma, esa feature tendrá menor poder predictivo lineal.
- Si aparecen extremos muy alejados, podrían influir fuerte en la pendiente; luego conviene revisar residuales/robustez.
- Esta celda normalmente justifica cuál variable usar en modelo simple y cuáles priorizar en el múltiple.

- **Las 2 primeras (log peso vs vida)**
    
    - r ≈ -0.83: relación inversa fuerte, o sea, a más peso (aunque sea en log), menor vida promedio.
    - La “caída final” y puntos lejos de la línea indican que **la relación no es perfectamente lineal** en todo el rango: en razas muy grandes, la vida cae más y hay más variación.
    - Los puntos alejados también sugieren **outliers** y/o que faltan variables que expliquen esa variación (por ejemplo genética/raza/categoría), así que la recta es un promedio.
	
- **La 3ra (log diferencia sexual vs vida)**
    
    - r ≈ -0.51: relación inversa moderada, pero con mucha dispersión.
    - Que haya puntos “muy arriba” de la línea significa que para un mismo nivel de diferencia_sexual_peso hay razas con vida mucho mayor: esa X **no determina** bien la vida por sí sola.
    - Que “traspase” la línea es normal: la línea es el promedio; puntos arriba son **residuos positivos** (el modelo subestima) y abajo **residuos negativos** (sobreestima).

**Qué concluyes para el modelado**

- log_peso_promedio y log_peso_macho_max tienen señal fuerte, pero la relación parece **no lineal en extremos** y con heterogeneidad.
- log_diferencia_sexual_peso aporta algo, pero es más débil y ruidosa; funciona mejor como feature adicional en modelo múltiple, no como única X.

---

## Celda 9

**Qué hace la celda**

- La **celda 9** prepara el dataset para el modelo simple.
- Define:
    - `X_simple = df[[feature_simple]].values` (la X seleccionada, en tu flujo suele ser log_peso_promedio después de la transformación).
    - `y = df['vida_promedio'].values` (objetivo).
- Aplica train_test_split(..., test_size=0.20, random_state=42) para dividir datos.
- Imprime el tamaño de entrenamiento y prueba.

**Lo más relevante**

- Tu salida muestra **800 train (80%)** y **200 test (20%)** sobre 1000 muestras.
- Esa proporción es estándar y adecuada para regresión en este tamaño de muestra.
- random_state=42 asegura que la partición sea **reproducible** (mismo split al repetir).

**Qué se concluye del resultado esperado**

- El split está bien hecho y listo para entrenar/evaluar sin mezclar datos.
- Se evita evaluar el modelo con los mismos datos de entrenamiento (reduce sobreajuste aparente).
- Con 200 casos en test, tendrás una evaluación razonablemente estable de métricas (R², RMSE, MAE) en la celda siguiente.

---

## Celda 10

**Qué hace la celda**

- La **celda 10** entrena la regresión lineal simple:
    - crea modelo_simple = LinearRegression()
    - ajusta con modelo_simple.fit(X_train, y_train)
    - predice en test con y_pred_simple = modelo_simple.predict(X_test)
- Imprime parámetros del modelo:
    - **Intercepto** b0
    - **Coeficiente** b1
    - **Ecuación lineal** final.

**Lo más relevante**

- Tu salida muestra:
    - b0 = 17.3770
    - b1 = -0.1330
    - ecuación: vida_promedio = 17.377 + (-0.133) * feature_simple
- El coeficiente negativo indica relación inversa: cuando sube la X, baja la vida estimada.

**Qué se concluye del resultado esperado**

- El modelo ya quedó entrenado correctamente y listo para métricas en la siguiente celda.
- El signo de b1 es coherente con la hipótesis típica en perros (mayor tamaño/peso → menor longevidad promedio).
- Aún no sabes “qué tan bueno” es: eso lo confirman R², RMSE, MAE en evaluación posterior.

- **Coeficiente b1 = -3.1864
    
    - Interpreta la pendiente: por cada **+1 unidad** en tu X, el modelo predice **-3.1864 años** en vida_promedio.
    - Como es negativo, confirma una **relación inversa**: más peso (o tu feature_simple) se asocia con menor vida promedio.
    
- **Intercepto b0 = 23.4342
    
    - Es el valor predicho de vida_promedio cuando X = 0.
    - Con peso real, X=0 no es un caso realista; sirve más como “punto de partida” matemático de la recta, no como conclusión biológica.
    
- **Ecuación vida_promedio = 23.4342 + (-3.1864) * X**
    
    - Te permite hacer predicciones rápidas y entender tendencia general.
    - Conclusión principal: el modelo capturó una tendencia global “más grande/pesado → vive menos”, pero **no dice aún** si predice bien (eso lo validas con R2, RMSE, MAE y residuos).

- El **signo negativo** se mantiene: a mayor peso (en escala log), **menor vida promedio**. Eso confirma la misma idea pero con una variable más “centrada” (menos sesgada).
- Ahora b1 = -3.186 se interpreta así: si log_peso_promedio sube 1 unidad, la vida baja ~3.19 años. En términos de peso real, subir 1 en log1p(peso) es multiplicar aproximadamente el peso por e (2.7x), o sea que el cambio es grande por diseño.
- El **intercepto b0 = 23.434** es el valor que el modelo daría cuando log_peso_promedio = 0 (equivale a peso_promedio = 0), que no es real en perros; por eso no se interpreta como “vida real”, solo como parámetro de la recta.
- Lo importante ahora es verificar si **mejoró el ajuste** respecto al “antes” mirando R2, RMSE, MAE y residuos: si mejora, la transformación está ayudando.

---

## Celda 11

**Qué hace la celda**

- Grafica la regresión lineal simple: pone los puntos reales del conjunto de prueba (X_test, y_test) y encima dibuja la recta predicha por modelo_simple.
- Etiqueta ejes/título, activa grilla, guarda la imagen en ../data/graficas/regresion_simple_dogs.png y la muestra.

**Lo más relevante**

- Es una celda de **validación visual** del modelo, no de entrenamiento.
- Te permite ver rápidamente si la relación lineal entre log1p(peso_promedio) y vida_promedio tiene sentido.
- También deja evidencia exportada (PNG) para informe/presentación.

**Qué se concluye (esperado en ML)**

- Si los puntos siguen de forma razonable la recta (con dispersión moderada), el modelo lineal simple está bien planteado.
- Si la nube es muy curva o muy dispersa lejos de la recta, sugiere que falta transformar variables o pasar a un modelo más completo.

