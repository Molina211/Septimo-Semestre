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