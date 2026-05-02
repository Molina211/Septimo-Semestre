# Módulo 10: Conceptos de seguridad de LAN

---

## Contenido

- **Seguridad de punto terminal:** Explica cómo usar la seguridad de punto terminal para mitigar los ataques.

- **Control de acceso:** Explica cómo se utiliza AAA y 802.1x para autenticar los terminales y los punto terminal LAN y dispositivos.

- **Amenazas a la seguridad de Capa 2:** Identifica vulnerabilidades de la Capa 2.

- **Ataque de tablas de direcciones MAC:** Explica cómo un ataque de tablas de direcciones MAC compromete la seguridad de LAN.

- **Ataques a la LAN:** Explica cómo los ataques a la LAN comprometen la seguridad de LAN.

---

## Seguridad de Punto Terminal

Los ataques de red más comunes que afectan a empresas son:

- **DDoS (Negación de Servicio Distribuido):** muchos dispositivos atacan al mismo tiempo para colapsar un sitio web o servicio y dejarlo inaccesible.
- **Filtración de datos:** los atacantes acceden a sistemas para robar información confidencial.
- **Malware:** software malicioso que infecta equipos; por ejemplo, ransomware como WannaCry que bloquea los datos hasta pagar un rescate.

En general, estos ataques buscan interrumpir servicios, robar información o dañar sistemas.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427095849.png]]

---

### Dispositivos de Seguridad de Red

Se utilizan varios dispositivos para proteger el perímetro de una red, como:

- Router con VPN
- Firewall de Siguiente Generación (NGFW)
- Dispositivo de Acceso a la Red (NAC)

Estos ayudan a proteger la red del acceso exterior.

1. **Router habilitado con VPN**

Una VPN (Red Privada Virtual) permite a usuarios remotos conectarse de forma segura a la red empresarial a través de una red pública, y puede estar integrada en el firewall.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427100423.png]]

2. **NGFW**

El Firewall de Siguiente Generación (NGFW) ofrece inspección de paquetes con estado, control y visibilidad de aplicaciones, incluye NGIPS, protección contra malware (AMP) y filtrado de URL.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427100508.png]]

3. **NAC**

Un dispositivo NAC incluye autenticación, autorización y registro (AAA), y permite administrar políticas de acceso para distintos usuarios y dispositivos. Un ejemplo es Cisco Identity Services Engine (ISE).

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427100559.png]]

---

### Protección de terminales

Los dispositivos LAN como switches, WLC y AP conectan los equipos, pero son vulnerables a ataques. Muchos ataques pueden originarse dentro de la red si un atacante compromete un host interno.

Los puntos terminales (computadores, servidores, teléfonos IP y BYOD) son especialmente vulnerables a malware. Para protegerlos se usan herramientas como antivirus, firewalls y HIPS, y actualmente también NAC, AMP, dispositivos de seguridad de correo (ESA) y web (WSA), como Cisco Advanced Malware Protection (AMP).

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427100758.png]]

---

### Dispositivo de Seguridad de Correo Electrónico Cisco (ESA)

Los dispositivos de seguridad de contenido controlan el correo y la navegación web para proteger a los usuarios.

Muchos ataques provienen del correo electrónico, especialmente el phishing y spear phishing, que buscan engañar a usuarios para obtener acceso.

El Cisco Email Security Appliance (ESA) monitorea el correo (SMTP), se actualiza con inteligencia de amenazas y permite bloquear amenazas, eliminar correos maliciosos, prevenir malware y proteger la información mediante cifrado.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427100953.png]]

---

### Dispositivos de Seguridad de la Red de Cisco (WSA)

El Cisco Web Security Appliance (WSA) es una tecnología que protege frente a amenazas web y permite controlar el tráfico de Internet en la organización.

Además de ofrecer protección contra malware y visibilidad del uso, permite definir políticas sobre cómo los usuarios acceden a Internet. Por ejemplo, aplicaciones como chat, video o mensajería pueden permitirse, limitarse (por tiempo o ancho de banda) o bloquearse según las reglas de la empresa.

También incluye funciones como filtrado y categorización de URL, listas negras, control de aplicaciones web y manejo del tráfico mediante cifrado y descifrado, ayudando a restringir el acceso a sitios no permitidos.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427101158.png]]

---

## Control de Acceso

El NAC utiliza servicios AAA (autenticación, autorización y registro) para controlar el acceso.

Existen varios métodos de autenticación en redes. El más básico es usar usuario y contraseña en consola, líneas VTY o puertos auxiliares. Sin embargo, es el menos seguro porque la contraseña se envía en texto plano y cualquiera que la tenga puede acceder al dispositivo.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427101338.png]]

SSH es un método de acceso remoto más seguro porque utiliza usuario y contraseña encriptados durante la transmisión.

Permite autenticación mediante una base de datos local y ofrece mayor control, ya que registra el nombre de usuario cuando alguien inicia sesión.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427101453.png]]

El método de base de datos local tiene limitaciones: los usuarios deben configurarse en cada dispositivo, lo que es lento en redes grandes, y no ofrece un respaldo de autenticación si se olvidan las credenciales.

Por eso, es mejor usar un servidor central donde todos los dispositivos consulten la misma base de datos de usuarios y contraseñas.

---

### Componentes AAA

AAA (Autenticación, Autorización y Registro) es un modelo para controlar el acceso a una red:

- **Autenticación:** verifica quién accede.
- **Autorización:** define qué puede hacer el usuario.
- **Registro (Accounting):** guarda lo que el usuario hace.

Funciona como una tarjeta de crédito: identifica al usuario, limita lo que puede hacer y registra sus acciones.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427101746.png]]

---

### Autenticación

La autenticación AAA puede ser local o basada en servidor.

- *Autenticación local*

La AAA local guarda los usuarios y contraseñas directamente en el dispositivo (como un router) y autentica contra esa base de datos. Es ideal para redes pequeñas.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427101852.png]]

- *Autenticación basada en servidor*

En la AAA basada en servidor, el router consulta un servidor central que contiene todos los usuarios y contraseñas.

Se comunica mediante protocolos como TACACS+ o RADIUS, y es más adecuada para redes grandes con muchos dispositivos.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427102025.png]]

---

### Autorización

La autorización ocurre automáticamente después de la autenticación y define qué puede o no hacer un usuario en la red.

Se basa en atributos que el servidor AAA usa para asignar privilegios y restricciones al usuario.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427102153.png]]

---

### Registro

El registro (accounting) de AAA recopila y reporta datos de uso como horas de conexión, comandos ejecutados y cantidad de datos.

Se usa junto con la autenticación para llevar un control detallado de las acciones del usuario (nombre, fecha, comandos), útil para auditorías, solución de problemas y evidencia ante actividades maliciosas.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427102432.png]]

---

### 802.1x

El estándar IEEE 802.1X define un control de acceso basado en puertos que evita que dispositivos no autorizados se conecten a la red.

Antes de permitir acceso, un servidor de autenticación verifica cada equipo conectado al switch, asegurando que solo dispositivos autorizados puedan usar la red.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427102601.png]]

En IEEE 802.1X participan tres roles:

- **Cliente (suplicante):** dispositivo que solicita acceso a la red.
- **Switch (autenticador):** intermediario que comunica al cliente con el servidor.
- **Servidor de autenticación:** valida al cliente y decide si puede acceder a la red.

---

## Amenazas a la seguridad de Capa 2

### Capa 2 Vulnerabilidades

La seguridad en la Capa 2 (Enlace de datos) es crítica dentro del Modelo OSI porque es la base sobre la que funcionan las demás capas.

Aunque los administradores suelen proteger desde la Capa 3 hasta la 7 con herramientas como VPN, firewalls e IPS, si un atacante logra acceso interno y compromete la Capa 2 (por ejemplo, capturando tramas), puede evadir esas protecciones. Esto hace que la seguridad de las capas superiores pierda efectividad y permite al atacante causar daños importantes en la red LAN.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427103106.png]]

---

### Categorías de Ataques a Switches

La seguridad de una red depende de su punto más débil, y la Capa 2 suele serlo dentro del Modelo OSI.

Antes se confiaba en los dispositivos de la LAN, pero con BYOD y ataques más avanzados, esta capa es más vulnerable. Por eso, además de proteger capas superiores, también se deben mitigar ataques en la infraestructura de Capa 2.

El primer paso es entender cómo funciona esta capa y conocer sus amenazas.

| Categoría                              | Ejemplos                                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Ataques a la tabla MAC                 | Incluye ataques de saturación de direcciones MAC.                                                                 |
| Ataques de VLAN                        | Incluye ataques VLAN Hopping y VLAN Double-Tagging. También incluye ataques entre dispositivos en una misma VLAN. |
| Ataques de DHCP                        | Incluye ataques de agotamiento y suplantación DHCP.                                                               |
| Ataques ARP                            | Incluye la suplantación de ARP y los ataques de envenenamiento de ARP.                                            |
| Ataques de Suplantación de Direcciones | Incluye los ataques de suplantación de direcciones MAC e IP.                                                      |
| Ataque de STP                          | Incluye ataques de manipulación al Protocolo de Árbol de Extensión.                                               |

---

### Técnicas de Mitigación en el Switch

La tabla provee una visión general de soluciones Cisco para mitigar ataques en Capa 2.

| Solución                              | Descripción                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Seguridad de Puertos                  | Previene muchos tipos de ataques, incluyendo ataques MAC address flooding y ataque por agotamiento del DHCP. |
| DHCP Snooping                         | Previene ataques de suplantación de identidad y de agotamiento de DHCP.     |
| Inspección ARP dinámica (DAI)         | Previene la suplantación de ARP y los ataques de envenenamiento de ARP.     |
| Protección de IP de origen (IPSG)     | Impide los ataques de suplantación de direcciones MAC e IP.                 |

Las soluciones de Capa 2 no son efectivas si los protocolos de administración son inseguros (como Telnet, SNMP, TFTP o FTP).

Por ello se recomienda:

- Usar protocolos seguros como SSH, SCP, SFTP y TLS.
- Implementar una red de administración separada o una VLAN dedicada.
- Filtrar accesos con ACL.

Estas medidas ayudan a proteger la administración de la red.

---

## Ataque de Tablas de Direcciones MAC

### Revisar la Operación del Switch

En los switches de Capa 2, se utiliza una tabla de direcciones MAC para tomar decisiones de reenvío.

Esta tabla se construye con las direcciones MAC de origen de las tramas recibidas, se almacena en memoria y permite enviar los datos de forma más eficiente. Además, estas tablas pueden ser vulnerables a ataques.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427104404.png]]

---

### Saturación de Tablas de Direcciones MAC

Las tablas MAC de los switches tienen un tamaño fijo, lo que las hace vulnerables a ataques de saturación. En este tipo de ataque, el switch es bombardeado con múltiples direcciones MAC falsas hasta llenar completamente su tabla.

Cuando esto ocurre, el switch ya no puede usar su tabla para reenviar correctamente y comienza a tratar el tráfico como desconocido, enviándolo por todos los puertos de la misma VLAN (flooding). Esto permite que un atacante intercepte las tramas que circulan entre otros dispositivos.

Este ataque solo afecta la LAN o VLAN donde está el atacante, pero aun así puede comprometer la confidencialidad de la información. Herramientas como macof pueden utilizarse para provocar este desbordamiento.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427104636.png]]

Si el atacante detiene la ejecución de macof o si es descubierto y detenido, el switch eventualmente elimina las entradas mas viejas de direcciones MAC de la tabla y empieza a funcionar nuevamente como un switch.

---

### Mitigación de Ataques a la Tabla de Direcciones MAC

Herramientas como macof son peligrosas porque pueden saturar muy rápido la tabla MAC de un switch.

Por ejemplo, un Cisco Catalyst 6500 puede almacenar hasta 132,000 direcciones MAC, pero macof puede generar hasta 8,000 tramas falsas por segundo, llenando la tabla en pocos segundos.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427111358.png]]

Los ataques de saturación de tabla MAC no solo afectan un switch, sino también a otros switches de Capa 2 conectados, ya que el tráfico se desborda por todos los puertos.

Para mitigarlos, se usa port security, que limita la cantidad de direcciones MAC que un puerto puede aprender, ayudando a prevenir este tipo de ataques.

---

## Ataques a la LAN

El VLAN Hopping permite a un atacante acceder a otras VLAN sin pasar por un router, aprovechando configuraciones por defecto del switch.

El atacante hace que su equipo se comporte como un switch y falsifica protocolos como IEEE 802.1Q y Dynamic Trunking Protocol (DTP) para que el switch establezca un enlace troncal.

Una vez logrado, el atacante puede moverse entre VLANs, viendo y enviando tráfico de diferentes redes dentro del mismo switch.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427113517.png]]

---

### Ataque de VLAN Double-Tagging

En algunos casos de VLAN Hopping, un atacante puede insertar una etiqueta adicional de IEEE 802.1Q dentro de una trama que ya está etiquetada.

Esto permite que la trama sea redirigida a otra VLAN distinta a la indicada por la etiqueta externa.

1. *Paso 1*

En el ataque de doble etiquetado (double tagging), el atacante envía una trama con dos etiquetas IEEE 802.1Q.

La etiqueta externa corresponde a la VLAN del atacante (igual a la VLAN nativa, por ejemplo VLAN 10), y la etiqueta interna indica la VLAN objetivo (por ejemplo VLAN 20). Esto permite que la trama llegue a la VLAN víctima.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427114817.png]]

2. *Paso 2*

La trama llega al primer switch, que revisa la etiqueta externa de IEEE 802.1Q (VLAN 10, nativa).

El switch elimina esa etiqueta y reenvía la trama dentro de la VLAN 10 sin volver a etiquetarla. La etiqueta interna (VLAN 20) permanece intacta y no es analizada en este punto.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427114912.png]]

3. *Paso 3*

La trama llega al segundo switch sin la etiqueta externa (por ser VLAN nativa).  
Este switch solo analiza la etiqueta interna de IEEE 802.1Q (VLAN 20) y la toma como destino.

Entonces reenvía la trama hacia la VLAN víctima (o la inunda si no tiene la MAC), permitiendo que el ataque funcione.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427115021.png]]

El ataque de VLAN Double-Tagging es unidireccional y permite a un atacante enviar tráfico a otra VLAN (normalmente restringida) si está en la misma VLAN que la VLAN nativa. Esto puede permitir comunicación con dispositivos de esa VLAN.

Para mitigar ataques como VLAN Hopping y Double-Tagging:

- Deshabilitar el troncal en puertos de acceso.
- Desactivar el entroncamiento automático (como Dynamic Trunking Protocol (DTP)).
- Usar la VLAN nativa solo en enlaces troncales.

---

### Mensajes DHCP

Los servidores DHCP asignan automáticamente a los clientes la configuración de red (IP, máscara, gateway, DNS, etc.).

Esto se realiza mediante un intercambio de mensajes entre cliente y servidor durante el proceso de asignación.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427120212.png]]

---

### Ataques de DHCP

Hay dos ataques principales contra DHCP:

- **Agotamiento DHCP:** el atacante usa herramientas como Gobbler para enviar muchas solicitudes con direcciones MAC falsas, ocupando todas las IP disponibles y dejando sin servicio a nuevos clientes (DoS).
- **Suplantación DHCP:** un servidor falso entrega configuraciones incorrectas (gateway, DNS o IP). Esto puede redirigir el tráfico, interceptar datos (MITM) o impedir la conexión.

Ambos ataques afectan la disponibilidad y seguridad de la red, y se pueden mitigar usando DHCP snooping, que controla qué dispositivos pueden ofrecer servicios DHCP.

1. *Paso 1 - El atacante se conecta a un servidor DHCP dudoso*

Un atacante puede conectar un servidor DHCP no autorizado en la misma red para entregar configuraciones IP falsas a los clientes.

El objetivo es engañar a los dispositivos para controlar o afectar su conexión.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427121549.png]]

2. *Paso 2 - El cliente transmite mensajes DHCP DISCOVER, tipo broadcast*

Un cliente legítimo envía un DHCP DISCOVER en broadcast para obtener configuración IP.

Tanto el servidor DHCP legítimo como el no autorizado reciben la solicitud y responden.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427121655.png]]

3. *Paso 3 - Respuesta DHCP legítima y no autorizada*

El servidor DHCP legítimo y el no autorizado envían ofertas al cliente.

El cliente acepta la primera respuesta que recibe, que puede ser la del atacante con configuración IP falsa.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427121757.png]]

4. *Paso 4 - El cliente acepta la oferta del servidor DHCP no autorizado*

Si la oferta maliciosa llega primero, el cliente envía un DHCP REQUEST aceptando esos parámetros.

Tanto el servidor legítimo como el no autorizado reciben esta solicitud.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427121848.png]]

5. *Paso 5 - El servidor malicioso confirma que recibió la solicitud*

Solamente el servidor no autorizado emite una respuesta individual al cliente para acusar recibo de su solicitud. El servidor legítimo dejará de comunicarse con el cliente.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427121947.png]]

---

### Ataques ARP

El protocolo ARP permite asociar direcciones IP con direcciones MAC, pero no valida si la información es legítima. Por eso, un atacante puede enviar ARP gratuitos falsos para engañar a otros dispositivos y hacer que actualicen sus tablas con datos incorrectos.

Esto permite redirigir el tráfico hacia el atacante (ataque MITM), especialmente si suplanta la IP de la puerta de enlace. Herramientas como dsniff, Cain & Abel o Ettercap facilitan este tipo de ataques.

Para evitarlo, se usa DAI, que verifica las respuestas ARP y evita que se acepten asociaciones IP-MAC falsas.

- *Paso 1 - Estado normal con una tabla MAC convergida*

Cada dispositivo tiene una tabla MAC actualizada con la dirección IP y MAC correctas de cada dispositivo en la red.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427123634.png]]

- *Paso 2 - Ataque por suplantación ARP*

El atacante envía respuestas falsas de ARP (ARP gratuito) para engañar a los dispositivos de la red.

Con estos mensajes, intenta asociar su dirección MAC con una dirección IP válida, haciendo que los equipos actualicen sus tablas ARP y redirijan el tráfico hacia él.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427123732.png]]

- *Paso 3 - Ataque de envenenamiento ARP con ataque MITM*

Los dispositivos reemplazan las direcciones MAC correctas por la del atacante en sus tablas de ARP.

Esto provoca envenenamiento ARP, permitiendo ataques MITM donde el atacante intercepta el tráfico, representando una grave amenaza para la red.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427123827.png]]

---

### Ataque de Suplantación de Dirección

La suplantación de identidad (spoofing) ocurre cuando un atacante usa una dirección IP o MAC de otro dispositivo para hacerse pasar por él.

En este caso:

- El atacante cambia la dirección MAC de su equipo para que coincida con la de un host legítimo.
- Envía tráfico a la red con esa MAC falsa.
- El switch, al recibir la trama, actualiza su tabla MAC pensando que esa dirección ahora está en otro puerto.

Como resultado, el switch empieza a enviar el tráfico destinado al dispositivo real hacia el atacante, permitiéndole interceptar la información.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427123953.png]]

El switch puede corregir la tabla MAC cuando el host legítimo envía tráfico, pero el atacante puede evitarlo enviando tramas constantemente para mantener la información falsa.

Como en Capa 2 no hay verificación de direcciones MAC, esto facilita la suplantación. Para mitigarlo se utiliza IPSG (IP Source Guard), que ayuda a validar las direcciones IP/MAC.

---

### Ataque de STP

Un atacante puede manipular el protocolo Spanning Tree Protocol (STP) para hacerse pasar por el root bridge y cambiar la topología de la red.

Para lograrlo, envía mensajes BPDU falsos con una prioridad de puente más baja, forzando a los switches a recalcular el árbol y elegir al atacante como raíz. Así, el atacante puede interceptar el tráfico del switch cercano.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427124143.png]]

Si tiene éxito, el host atacante se convierte en el puente raíz, como se muestra en la figura, y ahora puede capturar una variedad de frames, que de otro modo no serían accesibles.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427124214.png]]

Este ataque STP es mitigado implementando BPDU Guard en todos los puertos de acceso. BPDU Guard se discute con detalle más adelante en el curso.

---

### Reconocimiento CDP

Cisco Discovery Protocol (CDP) es un protocolo de Capa 2 usado para detectar y configurar automáticamente dispositivos Cisco, y viene habilitado por defecto.

CDP envía información sin cifrar como IP, versión de IOS, plataforma y VLAN nativa, lo que ayuda en la administración y solución de problemas de red.

Sin embargo, esta misma información puede ser usada por atacantes para identificar dispositivos y versiones de software, y así buscar posibles vulnerabilidades en la red.

![[Telemática II/Curso de Cisco II/Módulo 10/ANEXOS/Pasted image 20260427124400.png]]

Cisco Discovery Protocol (CDP) es un protocolo que envía información sin cifrado ni autenticación, lo que permite que un atacante pueda enviar mensajes falsos a dispositivos Cisco para engañar o recopilar información de la red.

En este caso:

- Un atacante puede inyectar tramas CDP falsas en dispositivos conectados.
- Esto puede usarse para interferir o realizar reconocimiento de la red.
- El riesgo aumenta porque la información viaja sin protección.

Para mitigarlo:

- Se debe deshabilitar CDP globalmente con `no cdp run` o habilitarlo con `cdp run`.
- También se puede desactivar por interfaz con `no cdp enable` o activarlo con `cdp enable`.
- Además, se recomienda deshabilitar Link Layer Discovery Protocol (LLDP) donde no sea necesario, usando `no lldp run`, `no lldp transmit` y `no lldp receive`.

---