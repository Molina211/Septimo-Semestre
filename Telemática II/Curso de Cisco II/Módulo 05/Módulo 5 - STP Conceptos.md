# Módulo 5: STP Conceptos

---

## Contenido:

- **Propósito del STP:** Explica los problemas comunes en una red conmutada redundante L2.

- **Funcionamientos del STP:** Explica cómo opera STP en una red conmutada simple.

- **Evolución del STP:** Explica la forma en que funciona PVST+ rápido.

---

## Propósito del STP:

### Redundancia en redes conmutadas de capa 2

En las redes de capa 2, la redundancia se utiliza para evitar puntos únicos de falla y garantizar la continuidad del servicio. Para ello se agregan rutas físicas alternativas que permiten que los datos sigan circulando incluso si una ruta falla. Sin embargo, en redes Ethernet conmutadas estas rutas redundantes pueden generar bucles físicos y lógicos, provocando que las tramas Ethernet se propaguen de forma continua por la red.  
Para evitar este problema se utiliza el protocolo de Árbol de Expansión (STP), que controla las rutas activas y mantiene una topología libre de bucles, asegurando que solo exista una ruta lógica entre dos dispositivos en la LAN.

---

### Protocolo de árbol de extensión

El protocolo de árbol de expansión (STP) es un protocolo de red de prevención de bucles que permite redundancia mientras crea una topología de capa 2 sin bucles. IEEE 802.1D es el estandar original IEEE MAC Bridging para STP.

#### STP Normal Operation

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260309082342.png]]

---

### Recalcular STP

#### STP Compensates for Network Failure

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260309082515.png]]

---

### Problemas con los vínculos de switch redundantes

La redundancia de ruta en una red permite tener varios caminos entre dispositivos para evitar que toda la red falle si un enlace se cae. Sin embargo, en redes Ethernet de Capa 2, si existen múltiples rutas y no se usa el protocolo STP (Spanning Tree Protocol), se pueden generar bucles de red.

Un bucle de Capa 2 provoca varios problemas:

- Inestabilidad en la tabla MAC de los switches.

- Saturación de enlaces por tráfico duplicado.

- Alto uso de CPU en switches y dispositivos.

- La red puede volverse muy lenta o incluso inutilizable.

Esto ocurre porque Ethernet no tiene un mecanismo para detener tramas que circulan infinitamente.

En cambio, los protocolos de Capa 3 (IPv4 e IPv6) sí tienen un control:

- IPv4 usa TTL (Time To Live).

- IPv6 usa Hop Limit.

Cada vez que un paquete pasa por un router, este valor disminuye. Cuando llega a 0, el paquete se descarta, evitando que circule para siempre.

Los switches de Capa 2 no tienen ese mecanismo, por lo que se creó STP, cuyo objetivo es evitar los bucles bloqueando rutas redundantes innecesarias en la red Ethernet.

---

### Bucles de la capa 2

Si STP (Spanning Tree Protocol) no está habilitado, pueden formarse bucles de Capa 2 en la red. Estos bucles hacen que algunas tramas se repitan indefinidamente, lo que puede colapsar la red en pocos segundos.

Los principales problemas ocurren con:

**1. Tramas de difusión (broadcast)**

Ejemplo: una solicitud ARP.

- El switch la envía a todos los puertos excepto al de entrada para que todos los dispositivos del dominio de difusión la reciban.

- Si existen múltiples rutas, la trama puede volver al switch y circular infinitamente, creando un bucle. 

**2. Inestabilidad de la tabla MAC**

Cuando hay bucles:

- El switch recibe la misma trama desde distintos puertos.

- Entonces actualiza constantemente la tabla de direcciones MAC.

- Esto provoca inestabilidad en la base de datos MAC y alto uso de CPU, impidiendo que el switch procese tráfico correctamente.

**3. Tramas de unidifusión desconocida**  

Suceden cuando el switch no tiene la dirección MAC de destino en su tabla.

- En ese caso, el switch reenvía la trama por todos los puertos excepto el de entrada.

- Si hay bucles, pueden llegar múltiples copias de la misma trama al dispositivo destino.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260309091123.png]]

---

### Tormenta de difusión (Broadcast Storm)

Una tormenta de difusión (broadcast storm) ocurre cuando hay demasiadas tramas de difusión en la red en muy poco tiempo, lo que satura los switches y dispositivos y puede hacer que la red deje de funcionar en segundos.

Las tormentas de difusión pueden ocurrir por dos causas principales:

- Problemas de hardware, como una tarjeta de red (NIC) defectuosa.

- Bucles de Capa 2 en la red.

En una red es normal que existan difusiones de Capa 2, por ejemplo las solicitudes ARP, pero cuando hay un bucle, esas tramas se replican indefinidamente, multiplicándose cada vez más hasta saturar la red.

Además:

- Las tramas de multidifusión (multicast) de Capa 2 se reenvían de forma similar a las de difusión.

- Aunque IPv6 no usa broadcast, sí utiliza multicast para funciones como ICMPv6 Neighbor Discovery, lo que también puede verse afectado por bucles.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260316165952.png]]

Cuando un host queda atrapado en un bucle de Capa 2, los demás dispositivos de la red no pueden comunicarse con él.

Esto ocurre porque:

- El switch actualiza constantemente su tabla de direcciones MAC debido a que recibe las mismas tramas por diferentes puertos.

- Como resultado, el switch no sabe por qué puerto enviar las tramas de unidifusión hacia ese host.

Por ejemplo, si una trama va dirigida a PC1:

- El switch puede tener registrado el puerto incorrecto en su tabla MAC.

- Entonces la trama se envía por varios puertos y termina circulando en bucle por la red.

A medida que más tramas se repiten:

- Se acumula tráfico innecesario.

- Puede generarse una tormenta de difusión (broadcast storm) que sature la red.

Para evitar estos problemas en redes con rutas redundantes, se debe usar un protocolo de árbol de expansión (Spanning Tree Protocol – STP).

- STP bloquea algunas rutas redundantes para evitar bucles.

- En los switches Cisco, STP está habilitado por defecto para prevenir bucles en la Capa 2.

---

### El algoritmo de árbol de expansión

El STP (Spanning Tree Protocol) se basa en un algoritmo creado por Radia Perlman en 1985, llamado algoritmo de árbol de expansión (STA). Este algoritmo permite evitar bucles en redes Ethernet.

El funcionamiento básico es:

1. Se elige un switch raíz (root bridge) en la red.

2. Los demás switches calculan la ruta de menor costo hacia ese switch raíz.

3. STP bloquea algunos enlaces redundantes, dejando solo un camino activo entre los dispositivos.

De esta forma se crea una topología sin bucles, pero manteniendo enlaces redundantes disponibles en caso de fallos.

- **Topología de la situación**

	Este escenario STA utiliza una LAN Ethernet con conexiones redundantes entre varios conmutadores.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260316170751.png]]

- **Seleccionar el Root Bridge**

	El algoritmo de árbol de expansión (STA) primero elige un switch principal llamado puente raíz (Root Bridge). En el ejemplo, S1 es el puente raíz.

	Luego, cada switch calcula cuál es la ruta de menor costo para llegar al puente raíz.  
	Como todos los enlaces tienen el mismo costo, cada switch simplemente elige el camino más corto hacia S1.

	Finalmente, STP bloquea algunos enlaces redundantes para evitar bucles en la red.

	*Nota: Se usa el término “puente (bridge)” porque en los inicios de Ethernet los switches se llamaban así.*

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260316171510.png]]

- **Bloquear rutas redundantes**

	STP (Spanning Tree Protocol) evita bucles en la red asegurando que solo exista una ruta activa entre los dispositivos.

	Para lograrlo, bloquea intencionalmente las rutas redundantes (caminos extra). Cuando bloquea un puerto, no permite que los datos pasen por él.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260316234813.png]]

- **Topología sin bucle**

	Un puerto bloqueado hace que ese enlace no envíe datos entre los switches.

	Esto provoca que la red quede organizada como un árbol, donde:

	- Cada switch tiene una sola ruta hacia el switch principal (raíz).

	- Se eliminan caminos alternativos para evitar problemas.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260316235042.png]]

- **Error de vínculo provoca el nuevo cálculo**

	Las rutas redundantes sí existen físicamente, pero STP las mantiene bloqueadas para evitar bucles.

	Si ocurre un problema (como daño en un cable o un switch):

	- STP recalcula la red.

	- Desbloquea una ruta alternativa para mantener la conexión.

	También recalcula cuando:

	- Se agrega un switch nuevo.

	- Se conecta un nuevo enlace.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260316235353.png]]

STP evita los bucles creando una sola ruta libre de errores en la red, bloqueando algunos puertos estratégicamente.

Si ocurre una falla:

- Desbloquea esos puertos que estaban bloqueados.

- Permite que el tráfico use rutas alternativas.

---

## Funcionamientos del STP

STP funciona usando un proceso llamado STA para crear una red sin bucles en 4 pasos:

1. Elige el switch principal (puente raíz).

2. Cada switch selecciona su mejor camino hacia la raíz (root port).

3. Se eligen los puertos que enviarán datos (designados).

4. Los demás puertos se bloquean (alternativos).

Para tomar estas decisiones, los switches se comunican usando BPDU:

- Son mensajes donde comparten información de la red.

- Sirven para decidir quién es la raíz y qué puertos usar o bloquear.

Cada switch se identifica con un BID (Bridge ID) que incluye:

- Prioridad

- Dirección MAC

- ID extendido

El switch con el BID más bajo se convierte en el puente raíz.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260317002000.png]]

*Prioridad de puente (Bridge Priority)*

- Es un valor que usan los switches para elegir el Root Bridge (el principal en STP).

- Valor por defecto: 32768.

- Rango: 0 a 61440 (en saltos de 4096).

- Regla importante:  
    Entre más baja la prioridad, mejor.  
    El switch con menor prioridad tiene más posibilidad de ser el Root Bridge.


*ID de sistema extendido (Extended System ID)*

- Es un valor que se suma a la prioridad dentro del BID.

- Sirve para identificar la VLAN en la BPDU.

**¿Por qué existe?**

- Antes (IEEE 802.1D antiguo):
    
    - No había VLAN.
        
    - Solo existía un árbol de expansión para toda la red.
    
- Ahora:
    
    - Las redes usan VLAN.
        
    - Entonces se agregó el ID de VLAN dentro del BID usando el sistema extendido.
    

**¿Qué permite?**

- Tener distintos Root Bridge para diferentes VLAN.
    
- Aprovechar mejor los enlaces redundantes.


*Dirección MAC*

- Se usa cuando hay empate:
    
    - Misma prioridad
        
    - Misma VLAN (ID extendido)
        

En ese caso:

- Gana el switch con la MAC más baja (en hexadecimal).

---

### Elige el root bridge

1. *Inicio del proceso*

Cuando los switches se encienden:

- Todos creen que son el root bridge (puente raíz).
    
- Cada uno empieza a enviar BPDU (Bridge Protocol Data Units) cada 2 segundos.

2. *¿Qué información llevan las BPDU?*

Cada BPDU incluye:

- El BID (Bridge ID) del switch que la envía.
    
- El Root ID, que inicialmente es su propio BID (porque cree que es el root).

3. *Comparación entre switches*

Cuando los switches reciben BPDU de otros:

- Comparan los BID.
    
- El BID más bajo gana.

El BID está compuesto por:

- Prioridad del switch
    
- Dirección MAC

4. *Elección del Root Bridge*

- Poco a poco, los switches se dan cuenta de cuál tiene el BID más bajo.
    
- Todos aceptan ese switch como el Root Bridge.
    
- En tu caso: S1 es elegido porque tiene el BID más bajo.

5. *Resultado final*

- Solo queda un root bridge en toda la red.
    
- Ese switch sirve como referencia para calcular rutas sin bucles.
    
- STP construye una topología en forma de árbol (sin ciclos).

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260317003828.png]]

---

### Impacto de las pujas por defecto

En Spanning Tree Protocol (STP), el Root Bridge se elige usando el Bridge ID (BID), que está compuesto por:

- Prioridad del switch (por defecto 32768)
    
- ID de VLAN (por eso aparece 32769 = 32768 + VLAN 1)
    
- Dirección MAC

*¿Cómo se elige el Root Bridge?*

1. Se compara primero la prioridad
    
    - Gana el switch con menor prioridad
    
2. Si hay empate (como en el ejemplo):
    
    - Se compara la dirección MAC
        
    - Gana la MAC más baja

Entonces:

- Todos los switches tienen prioridad 32769 → hay empate
    
- Entonces decide la MAC
    
- S2 tiene la MAC más baja → es el Root Bridge

*Importante:*

- El Root Bridge es el switch central de la red STP
    
- Desde él se calculan las mejores rutas (sin bucles)
    
- Todos los demás switches organizan sus puertos en función de él

Los administradores suelen configurar manualmente una prioridad más baja en el switch que quieren como Root Bridge, para evitar que la elección dependa de la MAC (que es aleatoria desde el punto de vista del diseño).

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318160538.png]]

---

### Determinar el costo de la ruta raíz

Cuando se elige el puente raíz en STP, los switches empiezan a calcular cuál es la mejor ruta para llegar a él. Para esto usan el costo de ruta raíz, que es simplemente la suma de los costos de todos los puertos por donde pasa la información desde un switch hasta el puente raíz.

Cada switch intercambia información mediante BPDU, que ya incluye el costo acumulado hasta ese punto. Cuando un switch recibe una BPDU, le suma el costo de su propio puerto de entrada y así va calculando su costo total hacia la raíz.

Los costos de los puertos dependen de la velocidad del enlace:

- Mayor velocidad → menor costo (mejor ruta)
    
- Menor velocidad → mayor costo

Por ejemplo:

- 10 Gbps → costo muy bajo
    
- 10 Mbps → costo alto

| Velocidad de enlace | STP Cost: IEEE 802.1D-1998 | Costo de RSTP: IEEE 802.1w-2004 |
| ------------------- | -------------------------- | ------------------------------- |
| 10 Gbps             | 2                          | 2000                            |
| 1 Gbps              | 4                          | 20000                           |
| 100 Mbps            | 19                         | 200000                          |
| 10 Mbps             | 100                        | 2000000                         |

Existen dos formas de medir estos costos:

- **IEEE 802.1D (ruta corta)**: valores más pequeños (usado por defecto en muchos switches Cisco)
    
- **IEEE 802.1w (ruta larga / RSTP)**: valores más grandes, más precisos para enlaces rápidos

Finalmente, aunque estos costos vienen por defecto, el administrador puede modificarlos para forzar qué ruta debe tomar el tráfico, controlando así el comportamiento del árbol de expansión.

---

### Elegir los puertos raíz

Después de elegir el puente raíz, cada switch que no es root debe escoger un puerto raíz.

Este puerto raíz es el que ofrece la ruta de menor costo total hacia el puente raíz. Ese costo se calcula sumando los costos de todos los puertos por donde pasa la ruta (costo de ruta raíz interna).

El algoritmo STA compara las posibles rutas:

- La ruta con menor costo se elige como principal.
    
- Las demás rutas redundantes se bloquean.

Ejemplo:

- Ruta 1: costo 19
    
- Ruta 2: costo 38

Como 19 es menor, la ruta 1 es la mejor, y ese puerto se convierte en el root port del switch.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318161546.png]]

---

### Seleccionar puertos designados

En esta fase del STP se evita que existan bucles en la red.

Después de que cada switch elige su puerto raíz, se seleccionan los puertos designados. En cada segmento (enlace entre dos switches) solo uno será designado: el que tenga el menor costo hacia el puente raíz, es decir, la mejor ruta para enviar tráfico hacia él.

Los puertos que no son ni root port ni designated port se colocan en estado bloqueado (alternativo) para evitar bucles.

Así, al final, STP garantiza que exista una sola ruta activa desde cada switch hacia el puente raíz, eliminando caminos redundantes activos.

- *Puertos designados en el puente raíz*

	Todos los puertos en el root bridge son puertos designados. Esto se debe a que el root bridge tiene el costo más bajo para sí mismo.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318162035.png]]

- *Puerto designado cuando hay un puerto raíz*

	Cuando en un enlace uno de los switches ya tiene un puerto raíz, el otro extremo automáticamente será un puerto designado.

	Esto ocurre porque:

	- El puerto raíz es el que tiene la mejor ruta hacia el puente raíz.

	- En ese mismo segmento, el otro puerto debe encargarse de enviar el tráfico hacia la red, por lo que se convierte en designado.

	Ejemplo:

	- En S4, Fa0/1 es el puerto raíz.

	- Entonces, en S3, el puerto conectado (Fa0/3) será el puerto designado.

	Además, todos los puertos que conectan a dispositivos finales (como PCs) siempre son puertos designados, ya que no generan bucles.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318162229.png]]

- *Puerto designado cuando no hay puerto raíz*

Cuando en un segmento ninguno de los switches es el puente raíz, se debe decidir cuál puerto será el designado comparando costos.

Regla:

- El switch con el menor costo de ruta hacia el puente raíz tendrá el puerto designado.
    
- Si ambos tienen el mismo costo, se usa el BID (Bridge ID) como desempate: gana el switch con el BID más bajo.

Ejemplo:

- S2 y S3 tienen el mismo costo hacia el root.
    
- Se compara el BID.
    
- Como S2 tiene menor BID, su puerto (Fa0/2) se convierte en designado.
    
- El otro puerto queda bloqueado.

Importante: los puertos designados siempre están en estado de reenvío (forwarding).

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318162532.png]]

---

### Seleccionar puertos alternativos (bloqueados)

En este paso, STP termina de evitar los bucles.

Todo puerto que no sea puerto raíz ni puerto designado se convierte en puerto alternativo (bloqueado).

Características:

- Está en estado bloqueo (discarding)
    
- No envía ni recibe tráfico de datos, solo BPDUs
    
- Sirve como respaldo en caso de que falle la ruta principal

Ejemplo:

- En S3, el puerto Fa0/2 es alternativo
    
- Está bloqueado y no reenvía tramas

Así, STP garantiza que solo haya una ruta activa, mientras mantiene otras como respaldo sin causar bucles.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318162729.png]]

---

### Seleccione un puerto raíz a partir de varias rutas de igual coste

Cuando un switch tiene varias rutas con el mismo costo hacia el puente raíz, STP usa criterios de desempate para elegir el puerto raíz.

El proceso es así, en orden:

1. **Menor Bridge ID (BID) del switch que envía la BPDU**  
    Se elige la ruta que viene del switch con menor identificador.

2. **Menor prioridad de puerto del remitente**  
    Si el BID es igual, se compara la prioridad del puerto del switch vecino.

3. **Menor ID de puerto del remitente**  
    Si aún hay empate, se elige el puerto con el número más bajo.


- *Oferta de remitente más baja*

En esta topología, S1 es el puente raíz, y cada switch debe elegir su puerto raíz (la mejor ruta hacia S1).

- En S3 y S4, es fácil: cada uno tiene una ruta con menor costo, por eso:
    
    - S3 → Fa0/1 es su puerto raíz
        
    - S4 → Fa0/3 es su puerto raíz
    
- En S2, hay un empate:
    
    - Fa0/1 y Fa0/2 tienen igual costo hacia el puente raíz

Entonces STP aplica desempate usando el BID del switch vecino (emisor):

- S3 → BID más alto
    
- S4 → BID más bajo

Como S4 tiene menor BID, la mejor ruta es a través de él.  
Por eso, en S2:

- Fa0/1 (conectado a S4) se convierte en puerto raíz

Cuando hay empate en costo, se elige la ruta que venga del switch con menor BID.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318164327.png]]

- *Prioridad de puerto del remitente mas baja*

En este caso hay empate total en el costo de las rutas hacia el puente raíz.

- S1 es el puente raíz, por lo que sus puertos son designados.
    
- S4 tiene dos caminos con igual costo hacia S1.

Se aplican los criterios de desempate:

1. BID del remitente → es el mismo (ambos vienen de S1) → empate
    
2. Prioridad de puerto del remitente → ambos puertos tienen prioridad 128 → empate

Aquí es donde este criterio sería decisivo:

- Si uno de los puertos de S1 tuviera menor prioridad, ese camino sería elegido
    
- Entonces, en S4:
    
    - El puerto conectado a ese enlace quedaría en reenvío
        
    - El otro puerto quedaría bloqueado

La prioridad de puerto sirve para romper empates cuando el costo y el BID son iguales, permitiendo decidir qué enlace usar.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260318164605.png]]

- *ID de puerto del remitente más bajo*

Este es el último criterio de desempate cuando todo lo anterior es igual.

- S4 recibe BPDUs desde dos puertos de S1 (Fa0/1 y Fa0/2).
    
- Como el costo, el BID y la prioridad son iguales, se compara el ID de puerto del remitente (los puertos de S1).

Regla:

- Se elige el puerto con menor ID.

En este caso:

- Fa0/1 (S1) tiene menor ID que Fa0/2
    
- Por eso, en S4 el puerto conectado a Fa0/1 (Fa0/6) se convierte en puerto raíz

El otro puerto:

- Fa0/5 en S4 → pasa a ser alternativo (bloqueado)

Así, STP rompe el empate y evita bucles dejando una sola ruta activa.

| Campo              | ¿Qué es?                    | ¿Para qué sirve?                           | Ejemplo                       |
| ------------------ | --------------------------- | ------------------------------------------ | ----------------------------- |
| **Protocol ID**    | Identificador del protocolo | Indica que es STP                          | `0x0000`                      |
| **Version**        | Versión de STP              | Define si es STP (802.1D) o RSTP (802.1w)  | `0` (STP), `2` (RSTP)         |
| **BPDU Type**      | Tipo de BPDU                | Define si es configuración o TCN           | `0x00` (Config), `0x80` (TCN) |
| **Flags**          | Bits de control             | Indican estado (Topología cambiando, etc.) | `0x01`, `0x02`                |
| **Root ID**        | ID del puente raíz          | Identifica quién es el root bridge         | `32768.00:11:22:33:44:55`     |
| **Root Path Cost** | Costo acumulado al root     | Define qué tan lejos está del root         | `19`                          |
| **Bridge ID**      | ID del switch emisor        | Identifica quién envía la BPDU             | `32768.AA:BB:CC:DD:EE:FF`     |
| **Port ID**        | ID del puerto emisor        | Identifica el puerto del switch            | `128.1` (prioridad + número)  |
| **Hello Time**     | Tiempo de envío de BPDU     | Cada cuánto se envían BPDUs                | `2 segundos`                  |
| **Max Age**        | Tiempo de validez           | Cuánto dura la info antes de descartarse   | `20 segundos`                 |
| **Forward Delay**  | Tiempo de transición        | Tiempo en estados listening/learning       | `15 segundos`                 |

---

### Temporizadores STP y Estados de puerto

STP usa tres temporizadores para controlar la convergencia:

- **Hello Time:** intervalo entre BPDUs (por defecto 2 s).
- **Forward Delay:** tiempo que el puerto permanece en listening y learning antes de reenviar (15 s).
- **Max Age:** tiempo máximo que se conserva la información antes de considerarla inválida (20 s).

Estos valores los define el root bridge para toda la red.

STP construye una topología sin bucles usando BPDUs. Para evitar errores, los puertos no pasan directamente a reenvío, sino que atraviesan estados:

- **Blocking:** no reenvía, solo recibe BPDUs.
- **Listening:** evalúa la red.
- **Learning:** aprende direcciones MAC.
- **Forwarding:** reenvía tráfico.
- **Disabled:** no operativo.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321170948.png]]

Explicación de cada uno de los estados

| Estado                       | Explicación sencilla                                                       |
| ---------------------------- | -------------------------------------------------------------------------- |
| **Blocking (Bloqueo)**       | El puerto no envía datos, solo escucha BPDUs. Sirve para evitar bucles.    |
| **Listening (Escucha)**      | El puerto empieza a prepararse. Envía y recibe BPDUs para entender la red. |
| **Learning (Aprendizaje)**   | Aprende direcciones MAC, pero aún no envía datos.                          |
| **Forwarding (Reenvío)**     | El puerto ya funciona normalmente: envía y recibe tráfico.                 |
| **Disabled (Deshabilitado)** | El puerto está apagado o administrativamente desactivado.                  |

---

### Detalles Operativos de cada Estado Portuario

- **Estados de puertos en STP (detalle operativo)**

| Estado del puerto | BPDU               | Tabla de direcciones MAC  | Reenvío de datos |     |
| ----------------- | ------------------ | ------------------------- | ---------------- | --- |
| Bloqueo           | Recibir solo       | No hay actualización      | No               |     |
| Escucha           | Recibir y enviar   | No hay actualización      | No               |     |
| Aprendizaje       | Recibir y enviar   | Actualización de la tabla | No               |     |
| Reenvío           | Recibir y enviar   | Actualización de la tabla | Sí               |     |
| Deshabilitado     | No envía ni recibe | No hay actualización      | No               |     |

---

### Per-VLAN Spanning Tree

PVST es una implementación de Spanning Tree en la que cada VLAN tiene su propio árbol de expansión independiente, permitiendo que cada una elija su propio root bridge y rutas. Esto mejora el uso de la red al permitir diferentes caminos para diferentes VLANs. Los cambios que se perciben de STP a PVST son:

1. *Múltiples árboles STP*

Antes:

- 1 VLAN → 1 STP → 1 árbol

Ahora:

- Varias VLAN → varios STP → varios árboles

Cada VLAN funciona como si fuera una red independiente a nivel de STP.

2. *Root bridge por VLAN*

- Ya no hay un solo root global
- Hay un root por cada VLAN

Ejemplo:

VLAN 10 → Root = S1  
VLAN 20 → Root = S3

Esto significa que la red tiene varios “centros” lógicos.

3. *Roles de puertos por VLAN*

Los roles dejan de ser únicos.

Un mismo puerto puede ser:

Fa0/1:  
- VLAN 10 → Root Port  
- VLAN 20 → Designated Port  
- VLAN 30 → Bloqueado

Importante:

- Los roles se asignan por VLAN, no por puerto físico global.

4. *Puertos bloqueados cambian por VLAN*

Un enlace puede comportarse distinto dependiendo de la VLAN:

Enlace S2–S3:  
- VLAN 10 → bloqueado  
- VLAN 20 → activo

Esto permite que:

- Un enlace no usado en una VLAN sí se usa en otra

5. *Diferentes rutas (topologías lógicas)*

Aunque el cableado sea el mismo, cada VLAN puede tener un camino distinto:

VLAN 10 → tráfico pasa por S1
VLAN 20 → tráfico pasa por S3

Resultado:

- Se crean múltiples topologías lógicas sobre una misma red física

6. *Balanceo de carga*

Este es el mayor beneficio.

Sin VLAN:

- Todo el tráfico usa el mismo camino

Con VLAN:

- El tráfico se reparte entre varios caminos

Ejemplo:

VLAN 10 → usa enlace A  
VLAN 20 → usa enlace B

7. *Costo acumulado por VLAN*

- Cada VLAN calcula su propio costo
- El mejor camino puede cambiar según la VLAN

Por eso:

- El puerto raíz puede ser diferente en cada VLAN

8. *BPDUs por VLAN*

- Se envían BPDUs independientes por VLAN
- Cada BPDU contiene información de esa VLAN específica

Esto permite:

- Que cada VLAN tome decisiones propias

9. *Bridge ID cambia por VLAN*

El Bridge ID incluye el VLAN ID:

BID = Prioridad + VLAN + MAC

Ejemplo:

VLAN 10 → 32778.xxxx.xxxx  
VLAN 20 → 32788.xxxx.xxxx

Esto permite que STP:

- Diferencie instancias
- Calcule árboles separados

10. *Visualización en la red*

No hay un único estado global.

Se analiza por VLAN:

`show spanning-tree vlan 10`  
`show spanning-tree vlan 20`

Cada comando muestra:

- Root diferente
- Puertos diferentes
- Costos diferentes

---

## Evolución del STP

### Diferentes versiones de STP

Existen varias versiones de Spanning Tree, y el término “STP” se usa de forma general para referirse a todas ellas, aunque en realidad hay diferentes implementaciones.

El estándar original es IEEE 802.1D, pero fue mejorado con el tiempo. La versión más actual del estándar (802.1D-2004) ya utiliza RSTP (802.1w), que es más rápido y eficiente.

Además, existen otras variantes como:

- **RSTP:** mejora la velocidad de convergencia
    
- **MSTP:** permite agrupar VLANs en un mismo árbol

La idea clave es que todas estas versiones buscan lo mismo:  
evitar bucles en la red, pero con diferentes niveles de eficiencia y optimización.

- **Versiones de STP**

| Variante STP    | Descripción sencilla                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| STP (802.1D)    | Versión original. Usa un solo árbol para toda la red, sin importar cuántas VLAN haya. Es más lenta. |
| PVST+           | Versión de Cisco. Crea un árbol diferente por cada VLAN. Permite mejor uso de la red.               |
| 802.1D-2004     | Actualización del estándar original que incorpora mejoras como RSTP.                                |
| RSTP (802.1w)   | Versión rápida de STP. Reduce mucho el tiempo de convergencia.                                      |
| Rapid PVST+     | Versión de Cisco de RSTP. Tiene un árbol rápido por cada VLAN.                                      |
| MSTP            | Permite agrupar varias VLAN en un mismo árbol para reducir carga.                                   |
| MST (instancia) | Implementación de MSTP en Cisco. Permite varias instancias, cada una con varias VLAN.               |
Un administrador de red debe elegir qué versión de Spanning Tree usar según las necesidades de la red.

En switches Cisco con IOS 15.0 o superior:

- Por defecto se usa PVST+, es decir, un árbol por cada VLAN.
- Esta versión ya incluye mejoras del estándar moderno (802.1D-2004), como mejores tipos de puertos.

Sin embargo:

- Si se quiere usar una versión más rápida (RSTP o Rapid PVST+), hay que configurarlo manualmente.

---

### Conceptos de RSTP

RSTP (IEEE 802.1w) es una versión mejorada de STP que mantiene la misma base y funcionamiento, pero es mucho más rápida.

- Usa la misma lógica que STP (elección de root, puertos, costos), por lo que es fácil de entender si ya conoces STP.
- La gran diferencia es que reduce drásticamente el tiempo de convergencia cuando hay cambios en la red.
- Puede reaccionar en milisegundos porque algunos puertos (alternativos o de respaldo) pueden activarse de inmediato sin esperar.

Además:

- Cisco implementa RSTP por VLAN como Rapid PVST+, donde cada VLAN tiene su propio RSTP independiente.

---

### Estados de puerto RSTP y roles de puerto

Los estados de puerto y las funciones de puerto entre STP y RSTP son similares.

- *Estados de puertos STP y RSTP*

En RSTP (802.1w) se simplifican los estados de los puertos respecto a STP original.

- En STP (802.1D) hay varios estados:  
    bloqueo, escucha, aprendizaje, reenvío y deshabilitado.
- En RSTP se reducen a solo tres estados:
    - **Discarding (Descarte):**  
        No reenvía datos ni aprende MAC. Aquí se combinan los estados de bloqueo, escucha y deshabilitado de STP.
    - **Learning (Aprendizaje):**  
        Aprende direcciones MAC, pero aún no reenvía tráfico.
    - **Forwarding (Reenvío):**  
        Reenvía tráfico normalmente.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321191705.png]]

- *Roles de puertos STP y RSTP*

En STP y RSTP, algunos roles se mantienen, pero otros se refinan.

- **Puertos raíz (Root Port)** y **puertos designados (Designated Port)**  
    → Son iguales en STP y RSTP. Cumplen la misma función.

La diferencia está en los puertos que en STP estaban bloqueados:

- En STP:
    - Solo existe el estado de “bloqueado” (no es root ni designado).
- En RSTP:
    - Ese concepto se divide en dos roles más específicos:
    - **Puerto alternativo (Alternate):**  
        Es un camino alterno hacia el root. Puede activarse rápidamente si falla el principal.
    - **Puerto de respaldo (Backup):**  
        Es un respaldo dentro del mismo segmento (menos común).

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321192259.png]]

- *Puertos RSTP alternativos y de copia de seguridad*

En RSTP existen dos tipos de puertos que reemplazan al estado bloqueado de STP:

- **Puerto alternativo (Alternate):**
    Es un camino secundario hacia el root bridge. No está activo, pero si falla el camino principal, puede activarse rápidamente.
- **Puerto de respaldo (Backup):**
    Es un respaldo dentro del mismo segmento (por ejemplo, en un hub). Es menos común hoy en día porque los hubs casi no se usan.

---

### PortFast y protección BPDU

Cuando un puerto de un switch se activa, no comienza a enviar tráfico inmediatamente. Primero pasa por los estados de escucha (listening) y aprendizaje (learning) del protocolo Spanning Tree, lo que genera un retraso aproximado de 30 segundos. Durante este tiempo, el switch evita bucles mientras aprende direcciones MAC, pero este retraso puede afectar a dispositivos como los clientes DHCP, cuyos mensajes pueden expirar antes de recibir una IP.

Para evitar este problema, se utiliza PortFast, una función que permite que el puerto pase directamente al estado de reenvío (forwarding), eliminando el tiempo de espera. Esto mejora la experiencia de conexión de dispositivos finales como PCs, laptops o impresoras, permitiendo que accedan a la red de forma rápida e inmediata.

Además, PortFast no desactiva Spanning Tree, sino que acelera su proceso únicamente en ese puerto, manteniendo cierta protección básica de la red.

*Importante:* PortFast debe usarse solo en puertos de acceso (hacia dispositivos finales). Si se habilita en un puerto conectado a otro switch, se pueden generar bucles de capa 2, lo que provoca problemas graves como:

- Saturación de la red
- Inestabilidad en la tabla MAC
- Alto uso de CPU en los switches

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321193717.png]]

En una configuración con PortFast, el puerto solo debe conectarse a dispositivos finales, por lo que no debería recibir BPDU. Si esto ocurre, significa que hay otro switch conectado, lo que puede generar bucles de red.

Para evitarlo, se usa BPDU Guard, que desactiva automáticamente el puerto (errdisabled) al recibir una BPDU, protegiendo la red. Esta característica actúa como un mecanismo de protección:

- Si el puerto recibe cualquier BPDU, automáticamente se coloca en estado errdisabled (se desactiva).
- Esto bloquea el puerto inmediatamente, evitando que se forme un bucle en la red.
- Es una medida de seguridad porque detecta una configuración incorrecta (por ejemplo, conectar un switch donde no se debe).

Cuando un puerto entra en estado errdisabled, no se recupera solo; el administrador debe reactivarlo manualmente, lo que obliga a revisar el problema antes de volver a habilitarlo.

---

### Alternativas a STP

El Spanning Tree Protocol (STP) ha sido tradicionalmente el mecanismo para evitar bucles en redes Ethernet, y sigue siendo fundamental. Sin embargo, con el tiempo, las redes han crecido en tamaño y complejidad, lo que ha generado la necesidad de mayor disponibilidad, rapidez y resiliencia.

Antes, las LAN eran simples, con pocos switches conectados a un solo router. Hoy en día, han evolucionado a un diseño jerárquico, compuesto por:

- **Capa de acceso** (donde se conectan los dispositivos finales)
- **Capa de distribución** (control y políticas)
- **Capa central o core** (alta velocidad y transporte de datos)

Debido a esta evolución, surgieron alternativas y mejoras a STP, diseñadas para ofrecer convergencia más rápida y mejor rendimiento en redes modernas.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321194147.png]]

En redes modernas, la Capa 2 no solo se limita al acceso, sino que puede extenderse a la distribución e incluso al núcleo, lo que implica redes mucho más grandes, con cientos de switches y muchas VLAN. Para adaptarse a esta complejidad, STP ha evolucionado con mejoras como RSTP (más rápido) y MSTP (más eficiente con múltiples VLAN).

Sin embargo, un punto clave en el diseño de red es la rápida y predecible recuperación (convergencia) ante fallos o cambios. En este aspecto, STP no es tan eficiente como los protocolos de enrutamiento de Capa 3, que reaccionan mejor y más rápido.

Por eso, en diseños modernos se utilizan switches multicapa en la distribución y el núcleo, que permiten enrutamiento (Capa 3) para mejorar el rendimiento y la estabilidad de la red.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321194607.png]]

El enrutamiento de Capa 3 permite tener rutas redundantes sin bloquear puertos, a diferencia de STP en Capa 2. Esto mejora el uso de la red y evita desperdiciar enlaces.

Por esta razón, muchas redes modernas están migrando a un diseño donde Capa 3 se usa en casi toda la red, excepto en la capa de acceso (donde se conectan los dispositivos finales).

Es decir, las conexiones entre switches de acceso y distribución pasan a ser de Capa 3 en lugar de Capa 2, logrando una red más eficiente y rápida.

![[Telemática II/Curso de Cisco II/Módulo 05/ANEXOS/Pasted image 20260321194711.png]]

Aunque STP sigue siendo el principal mecanismo para evitar bucles en muchas redes empresariales, hoy en día también se utilizan tecnologías más avanzadas, especialmente en switches de acceso, para mejorar el rendimiento y la disponibilidad.

Entre estas tecnologías están:

- **MLAG (Multi-Chassis Link Aggregation):** permite agrupar enlaces entre varios switches como si fueran uno solo, mejorando redundancia y uso del ancho de banda.
- **SPB (Shortest Path Bridging):** optimiza el tráfico usando rutas más cortas y eficientes dentro de la red.
- **TRILL (Transparent Interconnection of Lots of Links):** combina ventajas de Capa 2 y Capa 3 para evitar bloqueos y mejorar la escalabilidad.

Estas soluciones buscan superar las limitaciones de STP, como el bloqueo de puertos y la convergencia lenta.

*Nota: Son tecnologías más avanzadas y no se profundizan en este curso.*

---


