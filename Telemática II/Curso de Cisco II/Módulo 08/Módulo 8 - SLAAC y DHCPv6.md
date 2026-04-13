# Módulo 8: SLAAC y DHCPv6

---

## Contenido

- **Asignación de direcciones de unidifusión global IPv6:** Explica cómo un host IPv6 puede adquirir su configuración IPv6.

- **SLAAC:** Explica el funcionamiento de SLAAC.

- **DHCPv6:** Explica el funcionamiento de DHCPv6.

- **Configurar un servidor DHCPv6:** Configura un servidor DHCPv6 stateful y stateless.

---

## Asignación de direcciones de unidifusión global IPv6

Para usar la configuración automática de direcciones IPv6 (ya sea mediante SLAAC o DHCPv6), primero es necesario comprender dos tipos de direcciones clave:

1. **Direcciones globales de unidifusión (GUA)**
    
2. **Direcciones link-local (LLA)**

En un router:

- La GUA se configura manualmente con el comando:

    `ipv6 address ipv6-address/prefix-length`

En un host Windows:

- También es posible configurar manualmente una dirección IPv6 GUA como se muestra en una figura:

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412204400.png]]

Introducir manualmente una GUA IPv6 puede llevar mucho tiempo y ser algo propenso a errores. Por lo tanto, la mayoría de los hosts de Windows están habilitados para adquirir dinamicamente una configuración GUA IPv6, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412204437.png]]

---

### IPv6 Host Link-Local Address

Cuando un dispositivo (host) utiliza direccionamiento IPv6 automático, significa que intenta configurarse por sí mismo sin necesidad de que alguien le asigne manualmente una dirección IP. Para lograr esto, se apoya en el protocolo ICMPv6, específicamente en los mensajes llamados Router Advertisement (RA):

1. Al encenderse, el host activa su interfaz de red (por ejemplo, Ethernet).
2. En ese momento, genera automáticamente una dirección IPv6 local, llamada link-local (LLA).
    - Esta dirección sirve solo para comunicarse dentro de la red local.
    - No depende de ningún router, siempre se crea.
3. Luego, el host escucha mensajes RA enviados por un router IPv6 en la red.
    - Estos mensajes le indican cómo debe configurarse:
        - Si puede autogenerar su dirección global.
        - Si debe usar DHCPv6.
        - Qué prefijo de red utilizar.

#### ¿Qué pasa si NO hay router?

Si en la red no existe un router que envíe mensajes RA, el host:

- No puede crear una dirección global (GUA).
- Solo se queda con su dirección link-local (LLA).
- Esto limita la comunicación únicamente a la red local.

*Nota: A veces verás una dirección link-local con algo como:

`fe80::1%12`

*Ese “%12” es un identificador de zona.  
El sistema operativo lo usa para saber a qué interfaz de red pertenece esa dirección, especialmente cuando hay varias interfaces.*

*Además del RA, existe DHCPv6 (definido en el RFC 3315), que permite:*

- *Asignar direcciones IPv6 automáticamente.*
- *Proporcionar más información (DNS, etc.).*

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412205011.png]]

---

### IPv6 GUA Assignment

IPv6 fue diseñado para permitir que los hosts se configuren automáticamente. Para ello, los routers IPv6 envían mensajes RA (Router Advertisement) que proporcionan la información necesaria para que el host obtenga su configuración.

Las direcciones IPv6 globales (GUA) pueden asignarse dinámicamente de dos formas:

- **Stateless (sin estado)**: el host genera su propia dirección.
- **Stateful (con estado)**: un servidor (como DHCPv6) asigna la dirección.

En ambos casos, los mensajes RA de ICMPv6 indican al host cómo debe configurarse. Sin embargo, la decisión final siempre depende del sistema operativo del host.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412213617.png]]

---

### Tres flags de mensajes RA

La forma en que un host obtiene una dirección IPv6 global (GUA) depende de la configuración indicada en los mensajes RA (Router Advertisement).

Estos mensajes incluyen tres flags (indicadores) que le dicen al host qué método usar:

- **Flag A (Autonomous)**:  
    Indica que el host puede usar SLAAC para generar automáticamente su dirección IPv6 (método stateless).
- **Flag O (Other)**:  
    Indica que el host debe obtener información adicional (como DNS) desde un DHCPv6 stateless.
- **Flag M (Managed)**:  
    Indica que el host debe usar DHCPv6 stateful para obtener su dirección IPv6 completa.

Según la combinación de estos flags (A, O y M), el router le informa al host qué opciones de configuración dinámica están disponibles.

Los mensajes RA no solo dan información, sino que guían al host sobre cómo obtener su dirección IPv6 y otros datos de red.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412214213.png]]

---

## SLAAC

### Descripción general de SLAAC

No todas las redes cuentan con un servidor DHCPv6, pero los dispositivos igualmente necesitan una dirección IPv6 global (GUA). Para esto existe SLAAC (Stateless Address Autoconfiguration), que permite a los hosts generar su propia dirección automáticamente sin depender de un servidor.

SLAAC es un método stateless (sin estado), lo que significa que:

- No hay un servidor que controle qué direcciones están en uso.
- Cada host se configura por sí mismo.

Para funcionar, SLAAC utiliza mensajes RA (Router Advertisement) enviados por routers mediante ICMPv6, los cuales proporcionan:

- El prefijo de red.
- Información necesaria para que el host construya su dirección.

Estos mensajes se envían periódicamente (aprox. cada 200 segundos), pero el host también puede solicitar uno enviando un RS (Router Solicitation).

Finalmente, SLAAC puede usarse de dos formas:

- **Solo SLAAC** → el host obtiene toda su configuración automáticamente.
- **SLAAC + DHCPv6** → el host genera su dirección, pero usa DHCPv6 para obtener información adicional.

---

### Activación de SLAAC

Consulte la topología siguiente para ver cómo esta habilitado SLAAC para proporcionar asignación GUA dinámica stateless.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412214827.png]]

1. **Verificar direcciones IPv6**

El resultado del `show ipv6 interface` comando muestra la configuracion actual en la interfaz G0/0/1.

Como se destaca, a R1 se le han asignado las siguientes direcciones IPv6:

- Link-local IPv6 address - `fe80::1`
- GUA and subnet - `2001:db8:acad:1::1` y `2001:db8:acad:1::/64`
- IPv6 all-nodes group - `ff02::1`

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412215039.png]]

2. **Habilitar enrutamiento IPv6**

El router puede tener IPv6 configurado, pero no enviará mensajes RA (Router Advertisement) hasta que se habilite explícitamente el enrutamiento IPv6.

Para permitir que los hosts usen SLAAC y se autoconfiguren, es necesario ejecutar el comando global:

- `ipv6 unicast-routing`

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412215340.png]]

3. **Verificar que SLAAC esté habilitado**

El grupo de todos los routers IPv6 utiliza la dirección de multidifusión `ff02::2`. Puedes verificar si IPv6 está habilitado en una interfaz con el comando:

- `show ipv6 interface`

Cuando un router Cisco tiene IPv6 habilitado:

- Envía mensajes RA (Router Advertisement) a la dirección de todos los nodos IPv6 (`ff02::1`).
- Lo hace automáticamente cada 200 segundos.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412221026.png]]

---

### Método solo SLAAC

Cuando se habilita el comando `ipv6 unicast-routing`, por defecto se activa el método SLAAC solamente.

En este caso, los routers envían mensajes RA con los siguientes flags:

- **A = 1** → indica que el host debe generar su propia dirección IPv6 (GUA) usando el prefijo recibido.
- **O = 0** y **M = 0** → indican que no se usará DHCPv6, por lo que toda la información vendrá solo del RA.

El host crea su dirección IPv6 combinando:

- El prefijo anunciado por el router.
- Un ID de interfaz, que puede generarse mediante:
    - EUI-64
    - Un valor aleatorio.

Además, el mensaje RA proporciona toda la configuración necesaria:

- Prefijo de red
- Longitud de prefijo
- Servidor DNS
- MTU
- Puerta de enlace predeterminada

Entonces, con SLAAC solamente, el host se configura completamente por sí mismo usando solo la información del router, sin necesidad de DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412223529.png]]

En este caso, PC1 está configurada para obtener su dirección IPv6 automáticamente. Debido a la configuración de los flags:

- **A = 1**
- **O = 0**
- **M = 0**

PC1 utiliza solo SLAAC, es decir, se configura únicamente con la información del mensaje RA enviado por el router (R1).

La puerta de enlace predeterminada (default gateway):

- Se obtiene automáticamente desde la dirección de origen del mensaje RA.
- Esta dirección corresponde a la link-local (LLA) del router R1.

*Nota: Un servidor DHCPv6 NO proporciona el default gateway, esta información solo se obtiene mediante los mensajes RA.*

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412223906.png]]

---

### ICMPv6 RS Messages

Un router IPv6 envía mensajes RA (Router Advertisement) de forma periódica (aprox. cada 200 segundos), pero también puede enviarlos de inmediato si recibe una solicitud de un host.

Cuando un dispositivo está configurado para obtener su dirección automáticamente, al iniciarse:

- Envía un mensaje RS (Router Solicitation).
- Este mensaje se envía a la dirección de multidifusión `ff02::2` (todos los routers).

Al recibir el RS, el router responde con un RA, que contiene la información necesaria para que el host se configure usando SLAAC.

Significa que el host no siempre espera el RA; puede solicitarlo activamente con un RS, acelerando así su configuración automática en IPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412224202.png]]

---

### Proceso de host para generar ID de interfaz

Con SLAAC, el host obtiene del router (mensaje RA) el prefijo de red de 64 bits, pero debe generar por sí mismo los otros 64 bits, llamados identificador de interfaz (ID).

Existen dos formas principales de generar ese ID:

- **Generación aleatoria**
    El sistema operativo crea un ID único de forma aleatoria.  
    Es el método más usado actualmente (por ejemplo, en Windows 10) porque mejora la privacidad.
- **EUI-64**
    El host usa su dirección MAC (48 bits) y:
    - Inserta FFFE en el medio.
    - Forma así el ID de interfaz de 64 bits.  
        Puede afectar la privacidad, ya que la MAC identifica al dispositivo.

Los sistemas operativos modernos (Windows, Linux, Mac) permiten elegir entre:

- ID aleatorio (más seguro)
- EUI-64 (más tradicional)

En el ejemplo mencionado, el host (PC1) usa el prefijo del router y genera aleatoriamente su ID de interfaz, completando así su dirección IPv6.

Entonces, SLAAC divide la dirección en dos partes:

- El router da el prefijo
- El host genera el identificador, normalmente de forma aleatoria para mayor privacidad.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412224453.png]]

---

### Detección de direcciones duplicadas

Cuando un host crea una dirección IPv6 con SLAAC, no hay garantía inmediata de que sea única en la red. Por eso se utiliza el proceso DAD (Detección de Direcciones Duplicadas).

El host envía un mensaje ICMPv6 NS (Neighbor Solicitation) a una dirección especial de multidifusión llamada “nodo solicitado”, que se construye usando los últimos 24 bits de la dirección IPv6 generada.

Posibles resultados:

- Si ningún dispositivo responde, la dirección es única y se puede usar.
- Si otro dispositivo responde con un mensaje NA (Neighbor Advertisement), la dirección ya está en uso y el host debe generar una nueva.

DAD evita conflictos de direcciones en la red. Es recomendado por la Internet Engineering Task Force (IETF) para todas las direcciones IPv6, ya sean obtenidas por SLAAC, DHCPv6 o configuradas manualmente.

*Nota: Aunque no es obligatorio (debido a la enorme cantidad de combinaciones posibles), la mayoría de los sistemas operativos ejecutan DAD automáticamente.*

---

## DHCPv6

En IPv6 existen dos formas de usar DHCPv6:

- **DHCPv6 stateless**: trabaja junto con SLAAC. El host genera su dirección IPv6, pero usa DHCPv6 para obtener información adicional (como DNS).
- **DHCPv6 stateful**: el servidor asigna completamente la dirección IPv6 al host, sin necesidad de SLAAC.

Aunque DHCPv6 es similar a DHCPv4, ambos funcionan de manera independiente.

El uso de DHCPv6 se indica mediante los mensajes RA del router. Una vez el host sabe qué método usar, inicia la comunicación con el servidor DHCPv6.

- *Puertos:*

- Cliente → servidor: UDP 547
- Servidor → cliente: UDP 546

A diferencia de IPv4 que usa:

- Cliente → servidor: UDP 67
- Servidor → cliente: UDP 68

### *Proceso de funcionamiento:*

1. **El host envía un mensaje RS**

PC1 envía un mensaje RS a todos los routers habilitados para IPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230026.png]]

2. **El router responde con un RA indicando el método de configuración**

R1 recibe el RS y responde con un RA indicando que el cliente debe iniciar la comunicación con un servidor DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230101.png]]

3. **El host envía un mensaje SOLICIT al servidor DHCPv6**

Cuando un host actúa como cliente DHCPv6, necesita encontrar un servidor en la red. Para hacerlo, envía un mensaje SOLICIT a una dirección especial de multidifusión IPv6:

`ff02::1:2` → dirección reservada para todos los servidores DHCPv6.

Esta dirección tiene alcance link-local, lo que significa que:

- El mensaje solo se envía dentro de la red local.
- Los routers no lo reenvían a otras redes.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230257.png]]

4. **El servidor responde con ADVERTISE**

Uno o mas servidores DHCPv6 responden con un mensaje unidifusión DHCPv6 ADVERTISE. EI mensaje ADVERTISE le informa al cliente DHCPv6 que el servidor se encuentra disponible para el servicio DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230409.png]]

5. **El host responde solicitando la configuración**

La respuesta de un host (como PC1) depende del tipo de DHCPv6 que esté utilizando:

- **DHCPv6 Stateless**  
    El cliente:
    - Genera su propia dirección IPv6 usando SLAAC (prefijo del RA + ID de interfaz).
    - Luego envía un mensaje INFORMATION-REQUEST para obtener solo información adicional, como el DNS.
- **DHCPv6 Stateful**  
    El cliente:
    - No genera su dirección por sí mismo.
    - Envía un mensaje REQUEST al servidor DHCPv6.
    - El servidor le asigna la dirección IPv6 completa y otros parámetros de configuración.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230526.png]]

6. **El servidor envía un mensaje REPLY con la información final**

El servidor envía un mensaje de unidifusión DHCPv6 REPLY al cliente. El contenido del mensaje varia en función de si responde a un mensaje REQUEST o INFORMATION-REQUEST

*Note: El cliente usara la dirección IPv6 link-local de origen del RA como su dirección default gateway. Un servidor DHCPv6 no proporciona esta información.*

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230629.png]]

---

### Operación DHCPv6 stateless

La opción DHCPv6 stateless indica al cliente que use la información del mensaje RA para crear su dirección IPv6, pero que también hay parámetros adicionales disponibles desde un servidor DHCPv6.

Este método se llama stateless (sin estado) porque:

- El servidor no guarda información sobre los clientes.
- No lleva registro de direcciones asignadas.

En este caso, el servidor DHCPv6:

- No asigna direcciones IPv6.
- Solo proporciona información adicional, como DNS u otros parámetros de configuración.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412230820.png]]

---

### Habilitar DHCPv6 stateless en una interfaz

El DHCPv6 stateless se habilita en un router usando el comando `ipv6 nd other-config-flag`, lo que hace que el flag O = 1.

Cuando esto ocurre, los mensajes RA indican al host que:

- **A = 1** → debe usar SLAAC para generar su dirección IPv6.
- **O = 1** → debe contactar un servidor DHCPv6 para obtener información adicional (como DNS).

Es decir, el host:

- Se asigna su propia dirección.
- Pero obtiene otros parámetros desde DHCPv6.

Si se usa el comando `no ipv6 nd other-config-flag`, entonces:

- **O = 0**
- Se vuelve al modo SLAAC solamente, sin DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412231004.png]]

---

### Operaciones de DHCPv6 stateful

La opción DHCPv6 stateful es la más similar a DHCPv4. En este caso, el mensaje RA indica al host que obtenga toda su configuración desde un servidor DHCPv6.

Esto incluye:

- Dirección IPv6 (GUA)
- DNS
- Otros parámetros de red

Sin embargo, el default gateway no lo proporciona DHCPv6, sino que se obtiene del mensaje RA, específicamente de la dirección link-local del router.

Se llama stateful (con estado) porque el servidor:

- Mantiene un registro de las direcciones IPv6 asignadas.
- Controla qué direcciones están disponibles y cuáles están en uso.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412231133.png]]

*Nota: Si A=1 y M=1, algunos sistemas operativos como Windows crearan una dirección IPv6 mediante SLAAC y obtendrán una dirección diferente del servidor DHCPv6 stateful. En la mayoría de los casos, se recomienda establecer manualmente el flag A en 0.*

---

### Habilitar DHCPv6 stateful en una interfaz

DHCPv6 Stateful es habilitado en una interfaz de router mediante el comando `ipv6 nd managed-config-flag` interface configuration. Esto establece el flag M en 1.

El resultado resaltado en el ejemplo confirma que RA indicara al host que obtenga toda la información de configuracion IPv6 de un servidor DHCPv6 (flag M = 1).

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412231349.png]]

---

## Configure DHCPv6 Server

### Roles de router DHCPv6

Los routers Cisco IOS pueden cumplir varios roles en DHCPv6, por lo que en redes pequeñas no es necesario tener dispositivos separados.

Un router puede configurarse como:

- **Servidor DHCPv6**  
    Proporciona direcciones y/o parámetros de configuración a los hosts, ya sea en modo stateless o stateful.
- **Cliente DHCPv6**
    El propio router puede obtener su configuración IPv6 desde otro servidor DHCPv6.
- **Agente de retransmisión (relay)**  
    Reenvía mensajes DHCPv6 entre clientes y servidores cuando están en redes diferentes, permitiendo la comunicación entre ellos.

---

### Configurar un servidor DHCPv6 stateless

En DHCPv6 stateless, el router envía en los mensajes RA la información básica de direccionamiento (prefijo) para que el host genere su propia dirección IPv6 usando SLAAC.

Sin embargo, el cliente aún necesita contactar a un servidor DHCPv6 para obtener datos adicionales como DNS u otros parámetros.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260412232325.png]]

En este caso, el router R1 proporcionará:

- **SLAAC** para que los hosts generen su dirección IPv6.
- **DHCPv6 stateless** para entregar información adicional (como DNS).

Para configurar un router como servidor DHCPv6 stateless, se siguen cinco pasos:

1. **Habilitar IPv6**  

El `ipv6 unicast-routing` comando es requerido para habilitar el enrutamiento IPv6 Este comando no es necesario para que el router sea un servidor de DHCPv6 stateless, pero se requiere para que el router origine los mensajes RA ICMPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034151.png]]

2. **Definir un grupo DHCPv6**  

Para configurar DHCPv6 en un router, primero se debe crear un grupo (pool) usando el comando:

`ipv6 dhcp pool POOL-NAME`

Esto lleva al modo de configuración específico del grupo, identificado como:  

`Router(config-dhcpv6)#`

En este modo es donde se definen los parámetros que el servidor DHCPv6 entregará a los clientes (como DNS, dominio, etc.).

*Nota: El nombre del grupo puede escribirse en minúsculas o mayúsculas, pero se recomienda usar mayúsculas para facilitar su identificación en la configuración.*

3. **Configurar el grupo**  

R1 se configurara para proporcionar información DHCP adicional, incluida la dirección del servidor DNS y el nombre de dominio, como se muestra en el resultado del comando.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034323.png]]

4. **Asociar el grupo a una interfaz**  

Para que el router funcione como servidor DHCPv6 stateless, el grupo creado debe asociarse a una interfaz con el comando:

`ipv6 dhcp server POOL-NAME`

Esto permite que el router responda a las solicitudes DHCPv6 de los hosts conectados a esa interfaz, usando la información configurada en el pool.

Además, es necesario configurar:

- **ipv6 nd other-config-flag** → establece el flag O = 1

Esto indica a los hosts que:

- Hay información adicional disponible en un servidor DHCPv6.

Por defecto:

- **Flag A = 1** → los hosts usan SLAAC para generar su dirección IPv6.

Entonces, el comportamiento final es:

- El host crea su dirección con SLAAC.
- Luego consulta al DHCPv6 para obtener información extra (como DNS).

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034439.png]]

5. **Verificar**  

Para verificar DHCPv6 stateless en un host Windows, se usa el comando:

`ipconfig /all`

En el resultado se puede observar que:

- El host (PC1) generó su dirección IPv6 (GUA) usando el prefijo recibido del router (por ejemplo, `2001:db8:acad:1::/64`), lo que confirma el uso de SLAAC.
- El default gateway corresponde a la dirección link-local del router (R1), lo que indica que esta información proviene del mensaje RA.
- Además, el host obtuvo el nombre de dominio y la dirección del servidor DNS desde un servidor DHCPv6 stateless.
![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034527.png]]

---

### Configurar un cliente DHCPv6 stateless

Un router tambien puede ser un cliente DHCPv6 y obtener una configuracion IPv6 de un servidor DHCPv6, como un router que funcione como servidor DHCPv6. En la figura, R1 es un servidor DHCPv6 stateless.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034631.png]]

Para configurar y verificar un router como cliente DHCPv6 stateless, se siguen cinco pasos:

1. **Habilitar IPv6**  

El router cliente DHCPv6 debe estar ipv6 unicast-routing habilitado.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034727.png]]

2. **Crear la dirección link-local (LLA)**  

Un router cliente necesita tener una dirección link-local (LLA) para poder comunicarse en IPv6.

Esta dirección puede generarse de dos formas:

- Automáticamente cuando se configura una dirección IPv6 global (GUA) en la interfaz.
- O manualmente usando el comando `ipv6 enable`, incluso sin configurar una GUA.

Cuando se usa este comando, el router:

- Genera automáticamente la dirección link-local.
- Utiliza el método EUI-64 para crear el identificador de interfaz.

En el ejemplo, el comando `ipv6 enable` se aplica en la interfaz GigabitEthernet 0/0/1 del router R3, lo que permite que esa interfaz tenga su dirección link-local.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034838.png]]

3. **Usar SLAAC**  

El router cliente debe configurarse para usar SLAAC para crear una configuracion IPv6. El `ipv6 address autoconfig` comando habilita la configuracion automática del direccionamiento IPv6 mediante SLAAC.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413034931.png]]

4. **Verificar la GUA**  

Utilice el show ipv6 interface brief comando para verificar la configuracion del host como se muestra. El resultado confirma que a la interfaz G0/0/1 en R3 se le asignó una GUA válida.

*Nota: la interfaz puede tardar unos segundos en completar el proceso.*

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035011.png]]

5. **Verificar información adicional**  

El show ipv6 dhcp interface g0/0/1 comando confirma que R3 tambien aprendió el DNS y los nombres de dominio.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035031.png]]

---

### Configurar un servidor DHCPv6 stateful

El DHCPv6 stateful requiere que el router indique a los hosts que deben obtener toda su configuración IPv6 desde un servidor DHCPv6.

En este caso:

- El router (R1) proporciona servicios DHCPv6 stateful a los dispositivos de la red.
- La configuración es similar a la de DHCPv6 stateless.

La diferencia principal es que:

- En stateful, el servidor asigna directamente la dirección IPv6 (GUA) y demás parámetros.
- En stateless, el servidor solo da información adicional (no la dirección).

Este comportamiento es muy parecido a DHCPv4, donde el servidor controla y asigna las direcciones IP.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035232.png]]

Hay 5 pasos para configurar un router como servidor DHCPv6 stateless:

1. **Activar el enrutamiento IPv6 en el router.**

El ipv6 unicast-routing comando es requerido para habilitar el enrutamiento IPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035344.png]]

2. **Crear un nombre para el pool (grupo) DHCPv6.**

Cree el grupo DHCPv6 mediante el comando `ipv6 dhcp pool POOL-NAME` global config.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035416.png]]

3. **Configurar el pool con la información necesaria (DNS, dominio, etc.).**

R1 se configura para asignar direcciones IPv6 y también otros parámetros como DNS y nombre de dominio. En DHCPv6 stateful, el servidor entrega toda la configuración de red al cliente. El comando `address prefix` define el rango de direcciones que el servidor puede asignar. Además, el servidor puede incluir información como el DNS (por ejemplo, el de Google) y el nombre de dominio.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035510.png]]

4. **Asociar el pool a una interfaz del router.**

En la interfaz GigabitEthernet 0/0/1 de R1 se configura DHCPv6 en modo stateful, vinculando el pool mediante el comando:

- `ipv6 dhcp server POOL-NAME`

Además, se ajustan los flags de Neighbor Discovery:

- **M flag (Managed)** → se activa (`1`) con
    `ipv6 nd managed-config-flag`  
    ➜ Indica que los clientes deben obtener su dirección IPv6 desde el servidor DHCPv6.
- **A flag (Autoconfig)** → se desactiva (`0`) con  
    `ipv6 nd prefix default no-autoconfig`  
    ➜ Evita que los clientes generen direcciones automáticamente usando SLAAC.

Esto es importante porque algunos sistemas (como Windows) podrían crear dos direcciones IPv6:  
una por SLAAC y otra por DHCPv6.

Finalmente:

- El comando `ipv6 dhcp server` permite que el router responda solicitudes DHCPv6.
- Los comandos `no ipv6 nd managed-config-flag` y `no ipv6 nd prefix default no-autoconfig` restauran los valores por defecto (M=0 y A=1).

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035624.png]]

5. **Verificar en los hosts que hayan recibido la configuración IPv6 (como DNS y prefijo por RA).**

Para comprobar en un host de Windows, utilice el `ipconfig /all` comando para comprobar el método de configuracion DHCP stateful. El ejemplo muestra la configuracion en PC1. El resultado resaltado muestra que PC1 ha recibido su GUA IPv6 de un servidor DHCPv6 stateful.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035703.png]]

---

### Configurar un cliente DHCPv6 stateful

Un router también puede funcionar como cliente DHCPv6, no solo como servidor.

Para que esto funcione correctamente, el router debe cumplir dos requisitos básicos:

- Tener habilitado el enrutamiento IPv6:

    - `ipv6 unicast-routing`

- Contar con una dirección link-local IPv6 en la interfaz:

    - Esta dirección es necesaria para enviar y recibir mensajes DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413035814.png]]

Configurar un router como cliente DHCPv6 stateless implica:

1. **Habilitar IPv6 (`ipv6 unicast-routing`).**

El router cliente DHCPv6 debe estar ipv6 unicast-routing habilitado.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040000.png]]

2. **Asegurar una dirección link-local (LLA) en la interfaz.**

En el ejemplo, el ipv6 enable comando se configura en la interfaz R3 Gigabit Ethernet 0/0/1. Esto permite al router crear una LLA IPv6 sin necesidad de un GUA.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040029.png]]

3. **Configurar el uso de DHCPv6 para obtener información adicional.**

El ipv6 address dhcp comando configura R3 para solicitar su información de direccionamiento IPv6 de un servidor DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040055.png]]

4. **Verificar que tenga una dirección global (GUA) generada por SLAAC.**

Utilice el show ipv6 interface brief comando para verificar la configuracion del host como se muestra.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040116.png]]

5. **Confirmar que recibió datos como DNS u otros parámetros desde el servidor.**

El show ipv6 dhcp interface g0/0/1 comando confirma que R3 aprendió el DNS y los nombres de dominio.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040135.png]]

---

### Comandos de verificación del servidor DHCPv6

Utilice los `show ipv6 dhcp pool` comandos `show ipv6 dhcp binding` y para verificar el funcionamiento DHCPv6 en un router.


- **show ipv6 dhcp pool**

El comando **`show ipv6 dhcp pool`** permite verificar:

- El nombre del pool DHCPv6 y sus parámetros.
- La cantidad de clientes activos usando ese pool.

En el ejemplo, el pool IPV6-STATEFUL tiene 2 clientes (PC1 y R3), que están recibiendo su dirección IPv6 global desde el servidor.

Además, cuando un router actúa como servidor DHCPv6 stateful, mantiene una base de datos de las direcciones IPv6 asignadas a los clientes.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040337.png]]

- **show ipv6 dhcp binding**

El comando **`show ipv6 dhcp binding`** muestra:

- La dirección link-local (LLA) del cliente.
- La *dirección global (GUA) asignada por el servidor.

En el ejemplo, aparecen dos clientes:

- PC1
- R3

Esta información refleja los enlaces activos y es almacenada por un servidor DHCPv6 stateful.

Un servidor DHCPv6 stateless no guarda esta información, ya que no asigna direcciones, solo proporciona datos adicionales.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040435.png]]

---

### Configuración del agente de retransmisión DHCPv6

Si el servidor DHCPv6 está en otra red, se necesita un agente de retransmisión (relay).

- El router (R1) se configura como agente DHCPv6 para reenviar las solicitudes del cliente.
- Esto es similar al funcionamiento de DHCPv4 relay.

En el ejemplo:

- R3 actúa como servidor DHCPv6 stateful.
- PC1 (en la red `2001:db8:acad:2::/64`) necesita obtener su configuración IPv6.
- R1 funciona como relay, enviando las solicitudes de PC1 hacia R3.

Entonces, el relay permite que clientes y servidor DHCPv6 se comuniquen aunque estén en redes diferentes.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040627.png]]

La sintaxis del comando para configurar un router como agente de retransmisión DHCPv6 es la siguiente:

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040642.png]]

Este comando se configura en la interfaz que frente a los clientes DHCPv6 y especifica la dirección del servidor DHCPv6 y la interfaz de salida para llegar al servidor, como se muestra en el ejemplo. La interfaz de salida sólo es necesaria cuando la dirección de salto siguiente es una LLA.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040705.png]]

---

### Verificar el agente de retransmisión de DHCPv6

Compruebe que el agente de retransmisión DHCPv6 este operativo con los `show ipv6 dhcp interface` comandos `show ipv6 dhcp binding`. Compruebe que los hosts de Windows recibieron información de direccionamiento IPv6 con el `ipconfig/all` comando.


- **show ipv6 dhcp interface**

El agente de retransmisión DHCPv6 se puede verificar mediante el show ipv6 dhcp interface comando. Esto verificara que la interfaz G0/0/1 esté en modo de retransmisor.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413040919.png]]

- **show ipv6 dhcp binding**

En R3, utilice el `show ipv6 dhcp binding` command para comprobar si se ha asignado una configuracion IPv6 a alguno de los hosts.

Observe que a una dirección link-local de cliente se le ha asignado un GUA IPv6. Podemos suponer que esto es PC1.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413041003.png]]

- **ipconfig /all**

Por ultimo, utilice `ipconfig /all` en PC1 para confirmar que se le ha asignado una configuracion IPv6. Como puede ver, PC1 ha recibido su configuracion IPv6 del servidor DHCPv6.

![[Telemática II/Curso de Cisco II/Módulo 08/ANEXOS/Pasted image 20260413041050.png]]

---





