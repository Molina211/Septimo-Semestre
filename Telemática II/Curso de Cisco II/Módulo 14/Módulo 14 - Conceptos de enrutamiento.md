# Módulo 14: Conceptos de enrutamiento

---

## Contenido

- **Determinación de ruta:** Explica cómo los routers determinan la mejor ruta.

- **Reenvió de paquetes:** Explica cómo los routers reenvían los paquetes al destino.

- **Configuración básica de un router:** Configurar los parámetros básicos en un router.

- **Tabla de routing IP:** Describir la estructura de una tabla de routing.

- **Enrutamiento estático y dinámico:**  Comparar los conceptos de routing estático y dinámico.

---

## Determinación de ruta

Antes de reenviar un paquete, un router debe determinar la mejor ruta para enviarlo hacia su destino.

A diferencia de los switches, que conectan dispositivos dentro de una misma red, los routers conectan múltiples redes distintas mediante varias interfaces, cada una asociada a una red IP diferente.

Cuando un router recibe un paquete, analiza su tabla de enrutamiento para decidir por qué interfaz debe reenviarlo, cumpliendo así sus funciones principales: seleccionar la mejor ruta y dirigir los paquetes hacia su destino.

---

### Mejor ruta es igual a la coincidencia más larga

Cuando un router busca la mejor ruta en su tabla de enrutamiento, utiliza un proceso llamado coincidencia más larga.

Esto significa que compara la dirección IP de destino del paquete con las rutas disponibles y selecciona aquella cuya dirección de red comparte la mayor cantidad de bits iniciales coincidentes con la dirección de destino.

Cada ruta en la tabla incluye un prefijo de red y una longitud de prefijo (máscara de subred), que determina cuántos bits deben coincidir. La ruta con la coincidencia más específica, es decir, con más bits coincidentes desde la izquierda, será siempre la ruta preferida para reenviar el paquete.

---

### Ejemplo de coincidencia más larga de direcciones IPv4

Si un paquete tiene como destino la dirección IPv4 172.16.0.10, el router compara esta dirección con las rutas disponibles en su tabla de enrutamiento.

Aunque varias rutas pueden coincidir, como 172.16.0.0/12, 172.16.0.0/18 y 172.16.0.0/26, el router selecciona la ruta más específica, es decir, la que tenga la mayor cantidad de bits coincidentes según su máscara de subred.

En este caso, la ruta 172.16.0.0/26 es la mejor opción porque representa la coincidencia más larga.

| Dirección IPv4 de destino | Dirección de host en formato binario                          |
|---------------------------|---------------------------------------------------------------|
| 172.16.0.10               | 10101100.00010000.00000000.00001010                           |

| Entradas de ruta | Longitud del prefijo/prefijo | Dirección de host en formato binario  |
| ---------------- | ---------------------------- | ------------------------------------- |
| 1                | 172.16.0.0/12                | 10101100.00010000.00000000.001010     |
| 2                | 172.16.0.0/18                | 10101100.00010000.00000000.00001010   |
| *3*              | *172.16.0.0/26*              | *10101100.00010000.00000000.00001010* |

---

### Ejemplo de coincidencia más larga de direcciones IPv6

Para una dirección IPv6 de destino como 2001:db8:c000::99, el router compara los bits iniciales de la dirección con las rutas de su tabla.

En este caso:

- La ruta con prefijo /40 coincide porque comparte los primeros 40 bits.
- La ruta con prefijo /48 también coincide y es más específica.
- La ruta con prefijo /64 no coincide, ya que requiere 64 bits iguales y solo coinciden 48.

Por lo tanto, el router selecciona la ruta /48 porque representa la coincidencia más larga válida.

| Entradas de ruta | Longitud del prefijo/prefijo | ¿Coincide?                                         |
| ---------------- | ---------------------------- | -------------------------------------------------- |
| 1                | 2001:db8:c000::/40           | Coincidencia de 40 bits                            |
| *2*              | *2001:db8:c000::/48*         | *Coincidencia de 48 bits (coincidencia más larga)* |
| 3                | 2001:db8:c000:5555::/64      | No coincide (64 bits)                              |

---

### Creación de la tabla de enrutamiento

Una tabla de enrutamiento consta de prefijos y sus longitudes de prefijo. Pero, ¿Cómo aprende el router sobre estas redes? ¿Cómo rellena R1 en la figura su tabla de enrutamiento?

#### Redes desde la perspectiva de R1

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502011839.png]]

- ##### Redes conectadas directamente

Las redes conectadas directamente son aquellas que están configuradas en las interfaces activas del router.

Cuando una interfaz recibe una dirección IP y una máscara de subred, y además se encuentra en estado activo, el router agrega automáticamente esa red a su tabla de enrutamiento, permitiéndole reconocerla y comunicarse con ella directamente.

Por ejemplo, si un router tiene una interfaz configurada con la dirección IP 192.168.1.1/24, esto significa que está conectado directamente a la red 192.168.1.0/24.

Si esa interfaz está activa, el router añadirá automáticamente esa red a su tabla de enrutamiento.

**Ejemplo:**

- Interfaz del router: 192.168.1.1/24
- Red conectada directamente: 192.168.1.0/24

Así, cualquier dispositivo dentro de esa red podrá comunicarse con el router sin necesidad de rutas adicionales.

- ##### Redes remotas

Las redes remotas son aquellas que no están conectadas directamente al router, por lo que para llegar a ellas necesita información adicional en su tabla de enrutamiento.

El router puede conocer estas redes de dos formas:

**Rutas estáticas:**  
Son configuradas manualmente por el administrador, indicando la ruta que debe seguir el tráfico hacia esa red.

**Protocolos de enrutamiento dinámico:**  
Permiten que el router aprenda automáticamente sobre redes remotas mediante protocolos como RIPv2, OSPF o EIGRP, actualizando su tabla de enrutamiento de forma dinámica.

Por ejemplo, un router tiene conectada directamente la red 192.168.1.0/24, pero necesita llegar a la red 10.0.0.0/24, que está ubicada detrás de otro router.

Como esa red no está conectada directamente, se considera una red remota.

**Ejemplo:**

El administrador configura manualmente una ruta indicando que para llegar a **10.0.0.0/24**, debe enviar los paquetes al siguiente router, por ejemplo **192.168.1.2**.

`ip route 10.0.0.0 255.255.255.0 192.168.1.2`

De esta forma, el router sabe cómo reenviar el tráfico hacia esa red remota.

- ##### Ruta predeterminada

Una ruta predeterminada es la ruta que utiliza un router cuando no encuentra en su tabla de enrutamiento una ruta específica para la dirección de destino.

Funciona como una “salida general”, enviando los paquetes a un router de siguiente salto, conocido también como puerta de enlace de último recurso.

En IPv4, la ruta predeterminada se representa como 0.0.0.0/0, y en IPv6 como ::/0.  
El prefijo /0 significa que no se requiere coincidencia de bits, por lo que esta ruta puede usarse para cualquier destino cuando no exista una ruta más específica.

**Ejemplo:**

Si un router no conoce cómo llegar a la red 8.8.8.8, enviará el paquete a su ruta predeterminada, por ejemplo al router 192.168.1.254.

`ip route 0.0.0.0 0.0.0.0 192.168.1.254`

Así, todo tráfico hacia redes desconocidas será enviado automáticamente a ese siguiente salto.

---

## Reenvío de paquetes

Ahora que el router ha determinado la mejor ruta para un paquete en función de la coincidencia más larga, debe determinar como encapsular el paquete y reenviarlo hacia fuera la interfaz de salida correcta.

La figura muestra como un router determina primero la mejor ruta y, a continuación, reenvía el paquete.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502013105.png]]

- *Reenvía el paquete a un dispositivo en una red conectada directamente*

Si la ruta indica que el destino está en una red conectada directamente, el router puede enviar el paquete directamente al dispositivo final sin pasar por otro router.

Para hacerlo, primero debe conocer la dirección MAC del dispositivo de destino, ya que el paquete debe encapsularse en una trama Ethernet.

En IPv4, el router consulta su tabla ARP para encontrar la dirección MAC asociada a la dirección IP de destino. Si no la encuentra, envía una solicitud ARP y recibe una respuesta con la dirección MAC correspondiente.

En IPv6, el proceso es similar, pero utiliza la caché de vecinos y mensajes ICMPv6 Neighbor Solicitation y Neighbor Advertisement para obtener la dirección MAC.

Una vez obtenida esa información, el router puede encapsular correctamente el paquete y enviarlo al destino.

- *Reenvía el paquete a un router de salto siguiente*

Si la dirección IP de destino pertenece a una red remota, el router no puede enviar el paquete directamente al dispositivo final, por lo que debe reenviarlo a un router de siguiente salto.

La tabla de enrutamiento indica cuál es ese siguiente router. Para enviar el paquete, el router necesita conocer la dirección MAC del siguiente salto, no la del destino final.

En redes Ethernet, el router utiliza ARP en IPv4 o Neighbor Discovery en IPv6 para obtener la dirección MAC del siguiente router y luego encapsula el paquete para reenviarlo correctamente.

- *Descarta el paquete - No coincide en la tabla de enrutamiento*

Si no hay ninguna coincidencia entre la dirección IP de destino y un prefijo en la tabla de enrutamiento, y si no hay una ruta predeterminada, se descartará el paquete.

---

### Reenvío de paquetes

Una función principal del proceso de switching en un router es encapsular los paquetes en el formato de trama de capa 2 adecuado según el tipo de enlace de salida.

Esto significa que, antes de reenviar un paquete, el router adapta su encapsulación al protocolo utilizado por la red de destino, como Ethernet, PPP, HDLC u otros protocolos de enlace de datos.

- *PC1 envía paquete a PC2*

Cuando PC1 necesita enviar un paquete a PC2 en otra red, no puede comunicarse directamente con ella, por lo que envía el paquete a su puerta de enlace predeterminada.

Para hacerlo, PC1 busca en su caché ARP la dirección MAC del gateway. Si no la tiene registrada, envía una solicitud ARP y el router responde con su dirección MAC.

Con esta información, PC1 encapsula el paquete en una trama adecuada y lo envía al router para su reenvío.

- *El R1 reenvía el paquete a la R2*

Cuando R1 recibe el paquete y determina que debe enviarlo hacia otra red, lo reenvía al siguiente router o destino correspondiente.

Si la salida también utiliza una red Ethernet, R1 necesita conocer la dirección MAC del siguiente salto. Para ello, consulta su tabla ARP y, si no encuentra la dirección correspondiente, envía una solicitud ARP. Una vez que recibe la respuesta, puede encapsular el paquete correctamente y reenviarlo.

- *El R2 reenvía el paquete al R3*

Cuando R2 reenvía el paquete a través de una conexión serial punto a punto, no necesita resolver una dirección MAC, ya que este tipo de enlace no utiliza direcciones MAC como Ethernet.

En su lugar, el router encapsula el paquete utilizando el protocolo de capa 2 correspondiente, como PPP o HDLC, y lo envía directamente por la interfaz serial hacia el siguiente router.

- *El R3 reenvía el paquete a la PC2*

Cuando R3 recibe el paquete y detecta que PC2 está en una red Ethernet conectada directamente, debe obtener la dirección MAC de PC2 para completar el envío.

Para ello, consulta su caché ARP. Si no encuentra la dirección, envía una solicitud ARP y PC2 responde con su dirección MAC.

Con esta información, R3 encapsula el paquete en una trama Ethernet y lo entrega directamente a PC2.

---

### Mecanismo de reenvío de paquetes

La función principal del reenvío de paquetes en un router consiste en encapsular cada paquete en el formato de trama de capa 2 adecuado según la interfaz de salida.

La eficiencia con la que el router realiza este proceso influye directamente en su velocidad de reenvío.

Para ello, los routers utilizan distintos mecanismos de procesamiento:

**Switching de procesos:** analiza cada paquete individualmente.  
**Switching rápido:** utiliza información almacenada para acelerar decisiones repetidas.  
**Cisco Express Forwarding (CEF):** método más avanzado y eficiente, optimizado para un reenvío más rápido.

- *Conmutación de procesos*

El switching de procesos es un método antiguo de reenvío de paquetes en routers Cisco.

Cada vez que llega un paquete, la CPU analiza su dirección de destino, consulta la tabla de enrutamiento, determina la mejor ruta y luego lo reenvía.

Este proceso se repite para cada paquete individual, incluso si varios paquetes tienen el mismo destino, lo que lo hace mucho más lento y menos eficiente en comparación con métodos más modernos.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502123720.png]]

- *Conmutación rápida*

La conmutación rápida (Fast Switching) mejora el rendimiento respecto al switching de procesos al utilizar una caché para almacenar información de reenvío.

Cuando llega el primer paquete de un flujo, la CPU procesa la ruta normalmente y guarda la información del siguiente salto en la caché.

Los paquetes posteriores con el mismo destino pueden reenviarse utilizando esa información almacenada, sin necesidad de que la CPU procese cada uno nuevamente, lo que acelera considerablemente el reenvío.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502123854.png]]

- *CEF*

Cisco Express Forwarding (CEF) es el mecanismo de reenvío de paquetes más moderno y predeterminado en dispositivos Cisco.

CEF utiliza una Base de Información de Reenvío (FIB) y una tabla de adyacencia para almacenar de forma anticipada toda la información necesaria para reenviar paquetes.

A diferencia del switching rápido, estas tablas se actualizan cuando ocurren cambios en la topología de red, no cuando llegan paquetes. Esto permite que, una vez que la red converge, el router ya tenga preparada toda la información de reenvío, logrando un procesamiento mucho más rápido y eficiente en el plano de datos.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502124618.png]]

Una forma sencilla de entender los mecanismos de reenvío de paquetes es mediante esta analogía:

- El switching de procesos resuelve cada problema desde cero, realizando todos los cálculos cada vez.

- La conmutación rápida realiza el cálculo una sola vez para un problema y luego reutiliza esa solución cuando aparecen problemas iguales.

- CEF, en cambio, prepara previamente todas las posibles soluciones, de modo que puede responder de inmediato cuando surge cualquier situación.

---

## Configuración básica de un router

Antes de analizar en detalle la tabla de enrutamiento IP, es importante comprender las tareas básicas de configuración y verificación de un router.

Estas tareas permiten preparar correctamente el dispositivo para el enrutamiento y sirven como base para entender posteriormente cómo el router decide dónde enviar los paquetes dentro de la red.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502130836.png]]

---

### Comandos de Configuración

Los siguientes ejemplos muestran la configuración completa de R1.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502130918.png]]

---

### Comandos de verificación

Algunos comandos de verificación comunes incluyen los siguientes:

- `show ip interface brief`
- `show running-config interface interface-type number`
- `show interfaces`
- `show ip interface`
- `show ip route`
- `ping`

En cada caso, `ip` reemplace `ipv6` por la versión IPv6 del comando. La figura muestra de nuevo la topología para facilitar la referencia.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131139.png]]

- *show ip interface brief*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131203.png]]

- *show ipv6 interface brief*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131235.png]]

- *show running-config interface*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131309.png]]

- *show interfaces*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131327.png]]

- *show ip interface*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131343.png]]

- *show ipv6 interface*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131434.png]]

- *show ip route*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131455.png]]

- *show ipv6 route*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131512.png]]

- *ping*

El siguiente `ping` resultado asume que la interfaz S0/1/0 en R2 esta configurada y activa.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131537.png]]

---

### Salida del comando de filtro

El filtrado de resultados en la CLI permite mostrar información específica dentro de la salida de comandos `show`, facilitando la administración y análisis.

Para usarlo, se agrega una barra vertical (`|`) seguida del parámetro de filtrado y la expresión deseada.

Los principales filtros son:

**section:** muestra una sección completa relacionada.  
**include:** muestra solo las líneas que coinciden.  
**exclude:** omite las líneas coincidentes.  
**begin:** muestra resultados desde una coincidencia en adelante.

Esta función mejora significativamente la búsqueda de información relevante dentro de configuraciones extensas.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131716.png]]

Estos ejemplos demuestran algunos de los usos más comunes de los parámetros de filtrado.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502131817.png]]

---

## Tabla de routing IP

### Origen de la ruta

Un router determina a dónde enviar paquetes mediante su tabla de enrutamiento, la cual contiene las rutas hacia redes conocidas.

Esta información puede obtenerse de tres fuentes principales:

Las redes conectadas directamente a sus interfaces, las rutas estáticas configuradas manualmente y los protocolos de enrutamiento dinámico, como OSPF, que permiten intercambiar información de rutas con otros routers.

Con esta tabla, el router puede seleccionar la mejor ruta para reenviar cada paquete hacia su destino.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502132227.png]]

- *Tabla de routing de R1*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502132248.png]]

- *Tabla de routing de R2*

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502132309.png]]

En la tabla de enrutamiento, cada ruta incluye un código que indica cómo fue aprendida o configurada.

Algunos códigos comunes son:

**L:** dirección IP asignada directamente a una interfaz del router.  
**C:** red conectada directamente.  
**S:** ruta estática configurada manualmente.  
**O:** ruta aprendida dinámicamente mediante OSPF.  
***:** indica que la ruta puede utilizarse como ruta predeterminada.

Estos códigos ayudan a identificar rápidamente el origen de cada entrada en la tabla de enrutamiento.

---

### Principios de la tabla de enrutamiento

Existen tres principios fundamentales de la tabla de enrutamiento que garantizan una comunicación correcta entre redes.

Estos principios se relacionan con la necesidad de que los routers conozcan rutas adecuadas hacia las redes de destino y de retorno, lo cual se logra mediante una configuración correcta de rutas estáticas o protocolos de enrutamiento dinámico en todos los dispositivos involucrados.

| Principio de la tabla de enrutamiento                            | Ejemplo                                                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Cada router decide por su cuenta usando solo su propia tabla.    | R1 solo usa su propia tabla para reenviar paquetes. No sabe lo que otros routers (como R2) tienen en sus tablas. |
| Las tablas de diferentes routers pueden ser diferentes.          | Que R1 tenga una ruta hacia Internet pasando por R2 no significa que R2 también sepa llegar a esa misma red.     |
| Saber cómo ir hacia un destino no significa saber cómo regresar. | R1 sabe enviar un paquete de PC3 a PC1, pero eso no garantiza que sepa enviar un paquete de vuelta de PC1 a PC3. |

---

### Entradas de la tabla de routing

Como administrador de red, es fundamental interpretar correctamente las entradas de las tablas de enrutamiento IPv4 e IPv6.

Cada entrada muestra la red de destino, su longitud de prefijo y el origen de la ruta. En este caso, las rutas hacia las redes remotas 10.0.4.0/24 y 2001:db8:acad:4::/64 fueron aprendidas dinámicamente mediante el protocolo OSPF.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502133400.png]]

---

### Redes conectadas directamente

Para que un router aprenda sobre redes, primero debe tener interfaces activas configuradas con direcciones IP y máscaras de subred.

Cuando esto ocurre, el router agrega automáticamente una red conectada directamente a su tabla de enrutamiento, identificada con el código C.

Además, crea una ruta local para cada dirección IP asignada a sus interfaces, identificada con el código L. Esta ruta representa la propia dirección del router en esa red y le permite reconocer si un paquete está destinado a él mismo o si debe reenviarlo.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502133649.png]]

---

### Rutas estáticas

Después de configurar las interfaces de red, se puede usar routing estático o dinámico.

**Routing estático:**
Se configura manualmente y define rutas específicas entre routers. Sus ventajas son mayor seguridad, menor consumo de ancho de banda y menos uso de CPU. Su desventaja principal es que no se actualiza automáticamente si cambia la topología de la red.

**Usos principales del routing estático:**

- Administrar redes pequeñas y estables.
- Configurar rutas predeterminadas hacia redes externas.
- Conectar redes internas tipo stub (redes con una sola salida).

**Red stub:**
Es una red que solo tiene una ruta posible hacia otros destinos. En este caso, R1 actúa como router stub para las redes 10.0.1.0/24 y 10.0.2.0/24.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502134036.png]]

En esta red, R2 puede usar una ruta estática para llegar a las redes conectadas a R1. Por su parte, como R1 solo tiene una salida hacia otras redes, se configura una ruta estática predeterminada apuntando a R2 como siguiente salto para enviar todo el tráfico externo.

---

### Rutas estáticas en la tabla de enrutamiento IP

Para explicar el enrutamiento estático, la topología se simplifica mostrando una sola LAN por router. En este ejemplo, R1 tiene configuradas rutas estáticas IPv4 e IPv6 para llegar a las redes de R2 (10.0.4.0/24 y 2001:db8:acad:4::/64). Los comandos mostrados son solo demostrativos.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502134240.png]]

La salida de R1 muestra rutas estáticas IPv4 e IPv6 hacia las redes de R2 (10.0.4.0/24 y 2001:db8:acad:4::/64). Ambas aparecen con el código S, que indica que fueron aprendidas mediante enrutamiento estático, e incluyen la dirección IP del siguiente salto. El parámetro static permite visualizar únicamente las rutas estáticas.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502134353.png]]

---

### Protocolos de routing dinámico

Los protocolos de enrutamiento dinámico permiten que los routers compartan información sobre redes remotas, descubran nuevas rutas automáticamente y mantengan actualizadas sus tablas de enrutamiento.

- Seleccionan la mejor ruta disponible.
- Se adaptan automáticamente a cambios en la topología.
- Descubren redes remotas sin configuración manual.

En este proceso, routers como R1 y R2 usan un protocolo común para intercambiar información de red y actualizar sus rutas automáticamente.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502134509.png]]

---

### Rutas dinámicas en la tabla de enrutamiento IP

Las rutas estáticas hacia las redes 10.0.4.0/24 y 2001:db8:acad:4::/64 fueron reemplazadas por OSPF, permitiendo que R1 aprenda dinámicamente las redes conectadas a R2. En la tabla de enrutamiento, estas rutas aparecen con el código O, indicando que fueron aprendidas mediante OSPF, e incluyen la dirección IP del siguiente salto. En IPv6, se utiliza la dirección local de enlace del router vecino como siguiente salto.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502135124.png]]

---

### Ruta predeterminada

La ruta predeterminada funciona como la “salida general” de un router, similar al gateway predeterminado en un computador. Se utiliza cuando no existe una ruta específica en la tabla de enrutamiento para llegar a una red de destino.

- En IPv4 se representa como 0.0.0.0/0
- En IPv6 como ::/0

Esto significa que cualquier destino desconocido será enviado al siguiente salto configurado.

- **Importancia:**

- Reduce el tamaño de la tabla de enrutamiento
- Simplifica la configuración
- Permite enviar tráfico hacia redes externas como Internet

- *Ejemplo:*

En una red donde R1 y R2 usan OSPF para compartir sus redes internas, R2 tiene además una ruta predeterminada hacia el ISP.  
Así, si un paquete va hacia una red no conocida (como Internet), R2 lo envía automáticamente al proveedor de servicios.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502135343.png]]

R2 comparte su ruta predeterminada con R1 mediante OSPF, permitiendo que R1 aprenda dinámicamente una ruta de último recurso.

De esta forma, cuando R1 recibe paquetes cuyo destino no coincide con rutas específicas de su tabla, los reenvía a R2, que actúa como salida hacia otras redes o hacia Internet.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502135459.png]]

---

### Estructura de una tabla de enrutamiento IPv4

La tabla de enrutamiento IPv4 conserva una estructura basada en el antiguo sistema de direccionamiento por clases, utilizado cuando IPv4 fue estandarizado.

Por esta razón, en la salida del comando `show ip route`, algunas rutas aparecen alineadas de forma distinta. Aunque el enrutamiento moderno utiliza coincidencia más larga y ya no depende de clases, la organización visual de la tabla mantiene ese formato histórico.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502135611.png]]

En la tabla de enrutamiento IPv4, algunas entradas aparecen con sangría porque representan rutas secundarias, es decir, subredes de una red principal con clase.

La ruta principal muestra la red base, mientras que las rutas secundarias contienen información más específica sobre subredes individuales, incluyendo el origen de la ruta y datos de reenvío.

Las redes conectadas directamente suelen aparecer como rutas secundarias, ya que incluyen configuraciones más precisas asociadas a interfaces específicas del router.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502135800.png]]

---

### Estructura de una tabla de enrutamiento IPv6

El concepto de direccionamiento con clase nunca formaba parte de IPv6, por lo que la estructura de una tabla de enrutamiento con IPv6 es muy simple. Cada entrada de ruta IPv6 esta formateada y alineada de la misma manera.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502140017.png]]

---

### Distancia administrativa

Un router puede aprender la misma red de destino desde diferentes fuentes, como rutas estáticas o varios protocolos de enrutamiento dinámico.

Para decidir cuál utilizar, Cisco IOS emplea la distancia administrativa (AD), que mide la confiabilidad de cada fuente de ruta.

Mientras menor sea el valor de AD, mayor será la prioridad de esa ruta.

Por ejemplo:

- Redes conectadas directamente: AD 0
- Rutas estáticas: AD 1
- EIGRP: AD 90
- OSPF: AD 110

Si varias rutas llevan al mismo destino, el router instalará en su tabla la que tenga la distancia administrativa más baja. Esto permite seleccionar automáticamente la fuente considerada más confiable.

| Origen de la ruta               | Distancia administrativa |
|---------------------------------|--------------------------|
| Conectado directamente          | 0                        |
| Ruta estática                   | 1                        |
| Ruta resumida del protocolo EIGRP | 5                      |
| BGP externo                     | 20                       |
| EIGRP interno                   | 90                       |
| OSPF                            | 110                      |
| IS-IS                           | 115                      |
| RIP                             | 120                      |
| EIGRP externo                   | 170                      |
| BGP interno                     | 200                      |

---

## Enrutamiento estático y dinámico

### ¿Estático o dinámico?

El enrutamiento estático y dinámico se complementan en una red.

#### Rutas estáticas:

Se configuran manualmente y se usan cuando:

- Se necesita una ruta predeterminada hacia un proveedor de servicios.
- Se requiere mayor control o seguridad.
- Hay redes pequeñas o redes de extremo (stub).
- El administrador quiere definir rutas específicas.

*Ventajas:*

- Más seguras
- Menor uso de recursos
- Control total

*Desventajas:*

- Poco escalables
- Requieren mantenimiento manual

#### Protocolos de enrutamiento dinámico:

Aprenden rutas automáticamente y se usan cuando:

- Hay múltiples routers.
- La topología cambia con frecuencia.
- La red crece constantemente.

*Ventajas:*

- Escalables
- Ajuste automático ante cambios
- Menor administración manual

*Desventajas:*

- Mayor consumo de recursos
- Configuración más compleja

| Característica                  | Routing dinámico                                     | Routing estático                             |
| ------------------------------- | ---------------------------------------------------- | -------------------------------------------- |
| Complejidad de la configuración | Independiente del tamaño de la red                   | Aumenta con el tamaño de la red              |
| Cambios de topología            | Se adapta automáticamente a los cambios de topología | Requiere intervención del administrador      |
| Escalabilidad                   | Adecuado para topologías complejas                   | Adecuado para topologías simples             |
| Seguridad                       | La seguridad debe ser configurada                    | La seguridad es inherente                    |
| Uso de recursos                 | Usa CPU, memoria y ancho de banda de enlaces         | No requiere recursos adicionales             |
| Predictibilidad de ruta         | La ruta depende de la topología y el protocolo usado | Definida explícitamente por el administrador |

---

### Evolución del protocolo de routing dinámico

Los protocolos de enrutamiento dinámico comenzaron con RIP, basado en algoritmos usados desde ARPANET en 1969 y lanzado formalmente como RIPv1 en 1988. Con el crecimiento y mayor complejidad de las redes, surgió RIPv2, aunque su escalabilidad seguía siendo limitada para redes grandes. Para cubrir estas nuevas necesidades se desarrollaron protocolos más avanzados como OSPF, IS-IS, IGRP y EIGRP, capaces de manejar infraestructuras más extensas. Posteriormente, para permitir la comunicación entre diferentes organizaciones e ISP, se implementó BGP, que actualmente es el principal protocolo de enrutamiento entre grandes redes y proveedores de Internet.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502154426.png]]

Para soportar IPv6, se crearon versiones actualizadas de los protocolos de enrutamiento IP. Estos protocolos se dividen en IGP y EGP: los IGP se usan dentro de una misma organización para intercambiar rutas internas, mientras que BGP es el único EGP y se utiliza entre diferentes sistemas autónomos, como proveedores de Internet. Además, los protocolos se clasifican según su algoritmo de enrutamiento en vector de distancia, estado de vínculo y vector de ruta, cada uno con diferentes métodos para calcular la mejor ruta.

|      | Protocolos de gateway interior | ----------------------------     | -------------------  | ----------------------------------------------------     | Protocolos de gateway exterior |
| ---- | ------------------------------ | -------------------------------- | -------------------- | -------------------------------------------------------- | ------------------------------ |
|      | **Vector distancia**           | **----------------------------** | **Estado de enlace** | **----------------------------------------------------** | **Vector ruta**                |
| IPv4 | RIPv2                          | EIGRP                            | OSPFv2               | Sistema intermedio a sistema intermedio (IS-IS)          | BGP-4                          |
| IPv6 | RIPng                          | EIGRP para IPv6                  | OSPFv3               | IS-IS para IPv6                                          | BGP-MP                         |

---

### Conceptos de Protocolos de routing dinámico

Es un conjunto de procesos, algoritmos y mensajes utilizados para intercambiar información de routing entre routers, completar las tablas de enrutamiento y elegir automáticamente los mejores caminos hacia redes de destino. Sus objetivos principales son:

- Detectar redes remotas.
- Mantener la información de routing constantemente actualizada.
- Elegir la mejor ruta hacia las redes de destino.
- Encontrar automáticamente nuevas rutas cuando la ruta actual deja de estar disponible.

Los componentes principales de los protocolos de routing dinámico incluyen los siguientes:

- **Estructuras de datos:** Utilizan tablas o bases de datos almacenadas en la memoria RAM para guardar información de routing necesaria para su funcionamiento.
- **Mensajes del protocolo de routing:** Permiten descubrir routers vecinos, intercambiar información de rutas, descubrir redes y conservar información precisa y actualizada sobre la red.
- **Algoritmos:** Consisten en una serie finita de pasos que procesan la información de routing para determinar y seleccionar el mejor camino.

Estos protocolos permiten a los routers compartir información de forma dinámica sobre redes remotas y actualizar automáticamente sus propias tablas de routing, garantizando una administración más eficiente, adaptable y confiable del enrutamiento en la red.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502155450.png]]

Los protocolos de routing seleccionan la mejor ruta para cada red y la incorporan a la tabla de routing según su distancia administrativa. Su principal ventaja es que actualizan automáticamente la información de routing ante cambios en la topología, permitiendo detectar nuevas redes y encontrar rutas alternativas cuando ocurre una falla en la red.

---

### El mejor camino

Antes de incorporar una ruta a la tabla de enrutamiento, un protocolo de routing dinámico evalúa todas las rutas disponibles hacia una red remota para seleccionar la más óptima o corta. Si existen varias rutas al mismo destino, cada una puede utilizar diferentes interfaces de salida.

La selección de la mejor ruta se basa en una métrica, que es un valor cuantitativo utilizado para medir la distancia o costo hacia una red. La ruta preferida será siempre aquella con la métrica más baja.

Cada protocolo de enrutamiento dinámico utiliza sus propias reglas, algoritmos y métricas para construir y actualizar las tablas de routing. Estas métricas pueden calcularse usando una sola característica o múltiples factores combinados, permitiendo una selección de rutas más eficiente según las condiciones de la red.

| Protocolo de enrutamiento | Métrica |
|---|---|
| RIP (Routing Information Protocol) | • La métrica es el "recuento de saltos".<br>• Cada router suma 1 salto al recorrer la ruta.<br>• Máximo permitido: 15 saltos. |
| OSPF (Open Shortest Path First) | • La métrica es el "costo", basado en el ancho de banda acumulado de origen a destino.<br>• Los enlaces más rápidos tienen menor costo; los más lentos, mayor costo. |
| EIGRP (Enhanced Interior Gateway Routing Protocol) | • Calcula una métrica basada en el ancho de banda más lento y el retardo acumulado.<br>• También puede incluir carga y fiabilidad en el cálculo. |

La ruta seleccionada puede variar según la métrica utilizada por el protocolo de enrutamiento. Si la mejor ruta falla, el protocolo dinámico detecta el cambio y selecciona automáticamente una nueva mejor ruta disponible, garantizando la continuidad de la comunicación en la red.

---

### Balance de carga

Cuando una tabla de routing tiene dos o más rutas hacia la misma red de destino con métricas idénticas, el router utiliza todas esas rutas de manera equitativa mediante balanceo de carga de mismo costo.

Esto permite:

- Reenviar paquetes por múltiples interfaces de salida.
- Mejorar la eficiencia y el rendimiento de la red.
- Distribuir el tráfico entre rutas equivalentes.

Los protocolos de routing dinámico implementan este proceso automáticamente cuando detectan rutas de igual costo. En rutas estáticas, también puede configurarse si existen múltiples rutas hacia el mismo destino con diferentes siguientes saltos.

Como dato importante, solo EIGRP permite además balanceo de carga con distinto costo.

![[Telemática II/Curso de Cisco II/Módulo 14/ANEXOS/Pasted image 20260502160034.png]]

---