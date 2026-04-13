# Módulo 7: DHCPv4

---

## Contenido

- **Conceptos DHCPv4:** Explica la forma en la que funciona DHCPv4 en la red de una pequeña o mediana empresa.

- **Configurar un servidor DHCPv4 del IOS de Cisco:** Configura un router como servidor DHCPv4.

- **Configurar un cliente DHCPv4:** Configura un router como cliente DHCPv4.

---

## Conceptos DHCPv4

### Servidor y cliente DHCPv4

DHCPv4 permite asignar direcciones IPv4 y configuración de red de forma automática, lo que facilita la administración, especialmente en redes con muchos equipos.

Un servidor DHCP dedicado es más escalable, pero en redes pequeñas (como sucursales o SOHO), un router Cisco puede cumplir esta función sin necesidad de un servidor adicional.

El servidor DHCP presta (arrienda) direcciones IP desde un conjunto disponible por un tiempo limitado. Este tiempo lo define el administrador y suele ir desde 24 horas hasta una semana o más.

Cuando el arrendamiento vence, el cliente debe solicitar una nueva dirección, aunque normalmente recibe la misma IP nuevamente.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014004.png]]

---

### Funcionamiento DHCPv4

DHCPv4 funciona bajo un modelo cliente/servidor: el servidor asigna (arrienda) una dirección IPv4 al cliente, quien la usa mientras dure el tiempo de arrendamiento.

El cliente debe comunicarse periódicamente con el servidor para renovar ese arrendamiento. Esto permite que las direcciones IP no se queden ocupadas innecesariamente.

Cuando el arrendamiento expira, la dirección se libera y vuelve al conjunto disponible, pudiendo ser asignada a otro dispositivo.

---

### Pasos para obtener un arrendamiento

Cuando el cliente arranca (o quiere unirse a una red), comienza un proceso de cuatro pasos para obtener un arrendamiento:

1. **Detección de DHCP (DHCPDISCOVER)**

El proceso inicia cuando el cliente envía un mensaje DHCPDISCOVER en difusión, incluyendo su dirección MAC, para buscar servidores DHCP disponibles.

Como aún no tiene una dirección IPv4 válida, usa broadcast en capa 2 y capa 3 para poder comunicarse.

El objetivo de este mensaje es localizar servidores DHCPv4 en la red que puedan asignarle una dirección IP.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014400.png]]

2. **Oferta de DHCP (DHCPOFFER)**

Cuando el servidor DHCPv4 recibe el mensaje DHCPDISCOVER, selecciona una dirección IPv4 disponible y la reserva para el cliente.

Además, crea una entrada ARP asociando la dirección MAC del cliente con la IP asignada.

Luego, envía un mensaje DHCPOFFER al cliente, ofreciéndole esa dirección IPv4 para su uso.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014452.png]]

3. **Solicitud de DHCP (DHCPREQUEST)**

Cuando el cliente recibe un DHCPOFFER, responde con un mensaje DHCPREQUEST para aceptar la oferta.

Este mensaje cumple dos funciones:

- Aceptar formalmente la configuración del servidor elegido
- Rechazar implícitamente las ofertas de otros servidores

Además, se envía en difusión (broadcast) para que todos los servidores DHCP sepan cuál oferta fue aceptada.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014548.png]]

4. **Acuse de recibo de DHCP (DHCPACK)**

Cuando el servidor recibe el DHCPREQUEST, primero verifica que la dirección IP no esté en uso mediante un ping ICMP. Luego crea la entrada ARP correspondiente y responde con un DHCPACK, confirmando el arrendamiento.

El cliente, al recibir el DHCPACK, guarda la configuración y realiza una verificación ARP.  
Si no hay respuesta, confirma que la IP es válida y comienza a usarla.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014649.png]]

---

### Pasos para renovar un contrato de arrendamiento

Antes de que expire el arrendamiento, el cliente intenta renovarlo en dos pasos:

1. **DHCPREQUEST**
    El cliente envía un mensaje directamente al servidor que le asignó la IP.  
    Si no recibe respuesta, lo envía en difusión para que otro servidor pueda renovarlo.
2. **DHCPACK**
    El servidor responde confirmando la renovación del arrendamiento.

*Nota: Los mensajes como DHCPOFFER y DHCPACK pueden enviarse por unicast o broadcast según la RFC 2131.*

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014816.png]]

---

## Configure un servidor DHCPv4 del IOS de Cisco

### Servidor Cisco IOS DHCPv4

Ahora que se entiende cómo funciona DHCPv4, se puede usar un router Cisco con IOS como servidor DHCP si no se dispone de uno dedicado.

Este router puede asignar y administrar direcciones IPv4 tomando direcciones de un conjunto configurado dentro del propio dispositivo y entregándolas a los clientes de la red.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408014945.png]]

---

### Pasos para configurar un servidor DHCPv4 del IOS de Cisco

Para configurar un servidor DHCPv4 en un router Cisco IOS se siguen tres pasos:

1. **Excluir direcciones IPv4**

Se reservan direcciones que no deben asignarse automáticamente, como las de routers, servidores o impresoras.

Comando:

`ip dhcp excluded-address [low-address] [high-address]`

Puede excluirse una sola IP o un rango, y el comando se puede repetir varias veces.


2. **Definir el grupo (pool) DHCP**

Se crea el conjunto de direcciones que el router va a administrar:

`ip dhcp pool {nombre} | {vlan_id}`

Esto inicia el modo de configuración DHCP (`Router(dhcp-config)#`).


3. **Configurar el pool DHCP**

Se definen los parámetros principales:

- **Rango de direcciones:**

`network {direccion} {mascara}`

- **Gateway predeterminado:**

Desactive el servidor DHCPv4 del IOS de Cisco

`default-router {direccion}`

Opcionales:

- DNS → `dns-server`
- Dominio → `domain-name`
- Tiempo de arrendamiento → `lease`
- Servidor WINS → `netbios-name-server`

En esencia: primero reservas IPs, luego creas el pool y finalmente defines cómo se asignarán las direcciones a los clientes.

| Tarea                                       | Comando de IOS                                       |
| ------------------------------------------- | ---------------------------------------------------- |
| Definir el conjunto de direcciones.         | `network network-number [mask \| / prefix-Length]`   |
| Definir el router o gateway predeterminado. | `default-router address [ address2...address8]`      |
| Definir un servidor DNS.                    | `dns-server address [ address2...address8]`          |
| Definir el nombre de dominio.               | `domain-name domain`                                 |
| Definir la duración de la concesión DHCP.   | `lease {days [hours [minutes]] \| infinite]`         |
| Definir el servidor WINS con NetBIOS.       | `netbios-name-server address [ address2...address8]` |

1. `network`

Define el rango de direcciones IP (red y máscara) que el servidor DHCP puede asignar a los clientes.

Ejemplo:

`ip dhcp pool MI_POOL`
`network 192.168.1.0 /24`


 2. `default-router`

Especifica la puerta de enlace predeterminada (gateway) que el servidor DHCP entregará a los clientes para salir de la red local.

Ejemplo:

`default-router 192.168.1.1`


3. `dns-server`

Indica las direcciones de los servidores DNS que los clientes DHCP deben usar para resolver nombres de dominio.

Ejemplo:

`dns-server 8.8.8.8 8.8.4.4`


4. `domain-name`

Define el nombre de dominio que se le asigna al cliente (por ejemplo, `empresa.local`).

Ejemplo:

`domain-name miservidores.local`


5. `lease`

Establece por cuánto tiempo (días, horas, minutos) un cliente puede usar una dirección IP asignada por DHCP antes de que deba renovarla. También se puede configurar como infinita.

Ejemplo:

`lease 2 12 30   # 2 días, 12 horas, 30 minutos`

o

`lease infinite  # Sin expiración`


6. `netbios-name-server`

Indica la dirección del servidor WINS (NetBIOS Name Server), usado en redes Windows antiguas para resolver nombres NetBIOS.

Ejemplo:

`netbios-name-server 192.168.1.10`

*Nota: Microsoft recomienda no implementar WINS, en su lugar configurar DNS para la resolución de nombres de Windows y retirar WINS.*

---

### Ejemplo de configuración

La topología para el ejemplo de configuración se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408015905.png]]

El ejemplo muestra la configuración para convertir a R1 en un servidor DHCPv4 para la LAN 192.168.10.0/24.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408015915.png]]

---

### Comandos de verificación DHCPv4

Utilice los comandos de la tabla para verificar que el servidor DHCPv4 del IOS de Cisco esté funcionando.

| Comando                               | Descripción                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `show running-config \| section dhcp` | Muestra los comandos DHCPv4 configurados en el router.                                                              |
| `show ip dhcp binding`                | Muestra una lista de todos los enlaces de direcciones IPv4 a direcciones MAC proporcionados por el servicio DHCPv4. |
| `show ip dhcp server statistics`      | Muestra información de conteo con respecto a la cantidad de mensajes DHCPv4 que han sido enviados y recibidos.      |

---

### Verifique que DHCPv4 esté operando

La topología que se muestra en la figura es usada en el resultado de ejemplo. En este ejemplo, se configuró el R1 para que proporcione servicios DHCPv4. Dado que la PC1 no se encendió, no tiene una dirección IP.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408020540.png]]

- **Verificar la configuración DHCPv4**

El comando `show running-config | section dhcp` permite ver solo la parte de la configuración relacionada con DHCPv4 en el router.

El uso de `| section dhcp` filtra la salida, mostrando únicamente los comandos DHCP configurados (como pools, exclusiones, etc.), sin toda la configuración completa del equipo.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408020645.png]]

- **Verificar las asignaciones de DHCP**

El comando `show ip dhcp binding` permite verificar el funcionamiento de DHCPv4 mostrando las direcciones IP que han sido asignadas.

En la salida se observa la relación entre cada dirección IPv4 y su dirección MAC, es decir, qué dispositivo recibió cada IP mediante DHCP.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408020735.png]]

- **Verificar estadísticas DHCPv4**

El comando `show ip dhcp server statistics` permite verificar la actividad del servidor DHCP.

Muestra contadores de mensajes enviados y recibidos, lo que ayuda a confirmar que el router está procesando solicitudes DHCP correctamente.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408020844.png]]

- **Verificar el direccionamiento IPv4 recibido del cliente DHCPv4**

El comando `ipconfig /all` en la PC permite ver los parámetros TCP/IP asignados por DHCP.

En este caso, la PC conectada a la red 192.168.10.0/24 recibe automáticamente:

- Dirección IPv4
- Máscara de subred
- Gateway predeterminado
- Servidor DNS
- Sufijo DNS

No se requiere configuración adicional en el router para el cliente; si hay un pool DHCP disponible, la PC obtiene la IP automáticamente al conectarse a la red.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408020949.png]]

---

### Desactive el servidor DHCPv4 del IOS de Cisco

El servicio DHCPv4 está habilitado por defecto en el router.

- Para desactivarlo:

`no service dhcp`

- Para volver a activarlo:

`service dhcp`

Si no hay configuración previa, activarlo no tiene efecto.

*Nota: Al borrar enlaces DHCP o reiniciar el servicio, pueden aparecer direcciones IP duplicadas temporalmente en la red.*

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408021501.png]]

---

### Retransmisión DHCPv4

En redes grandes, los servidores (como DHCP) suelen estar en otra subred. El problema es que los clientes envían solicitudes DHCP como mensajes de difusión (broadcast), y los routers no reenvían broadcasts por defecto.

Por eso, en el ejemplo:

- La PC1 envía un DHCPDISCOVER
- El router R1 no lo reenvía
- El servidor DHCP, al estar en otra red, no recibe la solicitud
- Resultado: la PC no obtiene dirección IP

Para solucionarlo, el router R1 debe configurarse para reenviar los mensajes DHCP hacia el servidor (funcionando como intermediario).

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408022653.png]]

- `ipconfig /release`

PC1 es una computadora con Windows. El administrador de red libera toda la información de direccionamiento IPv4 actual mediante el comando `ipconfig /release`. Observe que se libera la dirección IPv4 y ninguna dirección aparece.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408022804.png]]

- `ipconfig /renew`

Al ejecutar `ipconfig /renew`, la PC1 envía un DHCPDISCOVER en broadcast, pero no logra encontrar el servidor DHCP.

Esto ocurre porque el router no reenvía mensajes de difusión, por lo que la solicitud no llega al servidor en otra red.

Aunque una opción sería configurar un servidor DHCP en el router R1, esto implicaría mayores costos y más administración.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408022855.png]]

- `ip helper-address`

La solución es configurar el router con `ip helper-address`, lo que permite reenviar los mensajes DHCP (broadcast) como unicast hacia el servidor.

En este caso:

- La interfaz de R1 que recibe la solicitud de la PC1 se configura con:

`ip helper-address 192.168.11.6`

- R1 toma el broadcast del cliente y lo reenvía al servidor DHCP en esa dirección
- Así, el cliente puede obtener su IP aunque el servidor esté en otra red

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023029.png]]

- `show ip interface`

Al configurar R1 como agente de retransmisión DHCP, el router recibe las solicitudes DHCP en broadcast y las envía como unicast al servidor (192.168.11.6).

Para verificar que esto esté bien configurado, se usa el comando:

`show ip interface`

Este permite comprobar si la interfaz tiene configurado correctamente el `ip helper-address`.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023123.png]]

- `ipconfig /all`

Como se muestra en la salida, PC1 ahora puede adquirir una dirección IPv4 del servidor DHCPv4 como se ha verificado con el `ipconfig /all` comando .

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023203.png]]

---

### Otras transmisiones de servicio retransmitidas

El comando `ip helper-address` no solo reenvía DHCP, sino que por defecto retransmite ocho servicios UDP:

- Puerto 37: Tiempo
- Puerto 49: TACACS
- Puerto 53: DNS
- Puerto 67: Servidor DHCP/BOOTP
- Puerto 68: Cliente DHCP/BOOTP
- Puerto 69: TFTP
- Puerto 137: NetBIOS Name Service
- Puerto 138: NetBIOS Datagram Service

Es decir, el router puede actuar como intermediario para varios servicios, no solo DHCP.

---

## Configurar un router como cliente DHCPv4

En algunos casos, un router Cisco puede funcionar como cliente DHCPv4, recibiendo automáticamente su dirección IP desde el ISP, igual que un PC.

Esto es común en redes SOHO o sucursales, donde el router se conecta a un módem (cable o DSL) y no tiene una IP fija.

Para configurarlo, se usa en la interfaz:

`ip address dhcp`

Con esto:

- El router solicita una IP al ISP
- Recibe automáticamente dirección IP, máscara, gateway, etc.
- Puede obtener una IP, por ejemplo, del rango 209.165.201.0/27

Significa que el router actúa como un cliente más dentro de la red del proveedor.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023502.png]]

---

### Ejemplo de configuración

Para configurar una interfaz Ethernet como cliente DHCP, se usa el comando:

`ip address dhcp`

Esto permite que el router obtenga automáticamente su dirección IPv4 desde el ISP, siempre que el proveedor esté configurado para asignar direcciones a sus clientes.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023551.png]]

El comando `show ip interface g0/0/1` confirma que la interfaz está activa y que la dirección fue asignada por un servidor DHCPv4.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023626.png]]

---

### Enrutador doméstico como cliente DHCPv4

Los routers domésticos suelen configurarse para obtener automáticamente su dirección IPv4 del ISP mediante DHCP. Esto facilita la conexión a Internet sin configuraciones manuales.

En estos casos, el tipo de conexión se establece como “Automatic Configuration - DHCP”, lo que permite que el router actúe como cliente DHCP al conectarse a un módem (cable o DSL).

Esta configuración es común en routers de distintos fabricantes, no solo en Packet Tracer.

![[Telemática II/Curso de Cisco II/Módulo 07/ANEXOS/Pasted image 20260408023721.png]]