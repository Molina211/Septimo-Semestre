# Módulo 13: Configuraciones de redes inalámbricas WLAN

---

## Contenido

- **Configuracion de WLAN del sitio remoto:** Configure una WLAN para admitir un sitio remoto.

- **Configure un WLC en el WLC:** Configure un WLC de red inalámbrica WLAN para que use la interfaz de administración y la autenticación WPA2 PSK.

- **Configure una red inalámbrica WLAN - WPA2 Enterprise en el WLC:** Configure un WLC de red inalámbrica WLAN para que use una interfaz VLAN, un servidor DHCP, y autenticación WPA2. Autenticación Enterprise

- **Solucion de problemas de WLAN:** Solucione problemas comunes de configuracion inalámbrica.

---

## Configuracion de WLAN del sitio remoto

### Router Inalámbrico

Los trabajadores remotos, pequeñas oficinas y redes domésticas suelen utilizar routers domésticos o de pequeñas oficinas.

Estos dispositivos también se conocen como routers integrados, ya que normalmente incluyen:

**1. Switch interno:** para conectar dispositivos por cable.  
**2. Puerto WAN:** para conectarse a Internet.  
**3. Componentes inalámbricos:** para permitir el acceso de clientes Wi-Fi.

Por ello, en este contexto se les denomina routers inalámbricos.

#### Cisco Meraki MX64W

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430213620.png]]

La próxima imagen muestra la conexión física de una laptop cableada, hacia un router inalámbrico, que a su vez se conecta a un modem DSL o cable modem para obtener conectividad a Internet.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430213758.png]]

Los routers inalámbricos suelen ofrecer varias funciones además de la conectividad Wi-Fi, entre ellas:

**1. Seguridad WLAN**  
**2. Servicios DHCP**  
**3. Traducción de Direcciones de Red (NAT)**  
**4. Calidad de Servicio (QoS)**  
**5. Otras funciones adicionales según el modelo**

La configuración del módem por cable o DSL generalmente la realiza el proveedor de servicios, ya sea directamente o mediante asistencia remota, aunque si el usuario adquiere su propio módem, deberá seguir la documentación proporcionada y contactar al proveedor para completar la conexión.

---

### Conéctese al router inalámbrico

La mayoría de los routers inalámbricos vienen preconfigurados para funcionar inmediatamente, conectarse a la red y ofrecer servicios como DHCP para asignar direcciones IP automáticamente.

Sin embargo, sus configuraciones predeterminadas, como:

**1. Dirección IP**  
**2. Nombre de usuario**  
**3. Contraseña**

pueden encontrarse fácilmente en Internet, por lo que es fundamental cambiarlas por seguridad.

Para acceder a la interfaz gráfica de configuración (GUI):

**1. Abrir un navegador web**  
**2. Ingresar la dirección IP privada predeterminada del router** (por ejemplo, 192.168.0.1)  
**3. Iniciar sesión con las credenciales predeterminadas** (frecuentemente “admin”)

Después del acceso inicial, se recomienda modificar inmediatamente estos valores predeterminados.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430214133.png]]

---

### Configuración básica de red

La configuración básica de la red incluye los siguientes pasos:

1. Iniciar sesión en el router desde un navegador web.
2. Cambie la contraseña de administrador predeterminada.
3. Iniciar sesión con la nueva contraseña administrativa.
4. Cambiar las direcciones IPv4 predeterminadas del DHCP.
5. Renovar la dirección IP.
6. Iniciar sesión en el router con la nueva direccion IP.

- *Iniciar sesión en el router desde un navegador web*

Después de iniciar sesión en el router inalámbrico, se abre una interfaz gráfica (GUI) con pestañas o menús que permiten acceder a las distintas opciones de configuración.

Al modificar parámetros, generalmente es necesario guardar los cambios antes de cambiar de ventana.

En esta etapa, se recomienda ajustar la configuración predeterminada para mejorar la seguridad del dispositivo.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430214844.png]]

- *Cambie la contraseña de administrador predeterminada*

Para cambiar la contraseña predeterminada del router, se debe acceder a la sección de Administración dentro de la GUI.

Desde allí:

**1. Ubicar la pestaña de Administración**  
**2. Cambiar la contraseña de acceso del router**

En algunos dispositivos, solo es posible modificar la contraseña, mientras que el nombre de usuario predeterminado permanece igual (por ejemplo, “admin”).

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430214938.png]]

- *Iniciar sesión con la nueva contraseña administrativa*

Una vez que usted guarde la contraseña, el router inalámbrico solicitara autorización nuevamente. Ingrese el nombre de usuario y la contraseña nueva.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430215027.png]]

- *Cambiar las direcciones IPv4 predeterminadas del DHCP*

Cambie la dirección IPv4 predeterminada del router. Una práctica recomendada es utilizar direcciones IPv4 privadas dentro de su red. En el ejemplo, se utiliza la dirección IPv4 10.10.10.1, pero podría ser cualquier dirección IPv4 privada que elija.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430215104.png]]

- *Renovar la dirección IP*

Al hacer clic en guardar, perderá temporalmente el acceso al router inalámbrico. Abra una ventana de comandos y renueve su direccion IP con el comando ipconfig/renew, como se muestra en el ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430215140.png]]

- *Iniciar sesión en el router con la nueva dirección IP*

Ingrese la nueva direccion IP del router para recuperar el acceso a la GUI de configuracion del router, como se muestra en el ejemplo. Ahora esta listo para continuar con la configuracion de acceso inalámbrico en el router.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430215221.png]]

---

### Configuración inalámbrica

La configuracion básica de la red inalámbrica incluye los siguientes pasos:

1. Ver los valores predeterminados de WLAN
2. Cambiar el modo de red.
3. Configurar el SSID
4. Configurar el canal
5. Configurar el modo de seguridad
6. Configurar la contraseña.

- *Ver los valores predeterminados de WLAN*

El router inalámbrico proporciona acceso Wi-Fi utilizando un nombre de red predeterminado llamado SSID y una contraseña predeterminada.

Para mejorar la seguridad, se deben localizar las configuraciones inalámbricas básicas del router y cambiar estos valores predeterminados.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430221126.png]]

- *Cambiar el modo de red*

Algunos routers inalámbricos permiten seleccionar el estándar 802.11 que se utilizará.

Por ejemplo:

**Modo Legacy:**  
Permite la conexión de distintos dispositivos inalámbricos compatibles con varios estándares.

**Modo mixto:**  
Generalmente admite múltiples tecnologías, como 802.11a, 802.11n y 802.11ac, facilitando la compatibilidad con diferentes tarjetas de red inalámbricas.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223029.png]]

- *Configurar el SSID*

A cada red inalámbrica (WLAN) se le asigna un SSID, que corresponde al nombre de la red.

El router inalámbrico anuncia este SSID mediante transmisiones broadcast, permitiendo que los dispositivos detecten automáticamente la red.

Si la difusión del SSID está desactivada, el nombre de la red deberá configurarse manualmente en cada dispositivo que quiera conectarse.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223154.png]]

- *Configurar el canal*

En la banda de 2,4 GHz, dispositivos configurados en canales superpuestos pueden generar interferencia, reduciendo el rendimiento inalámbrico y afectando las conexiones.

Para evitarlo, se recomienda usar canales que no se superpongan, específicamente:

**1. Canal 1**  
**2. Canal 6**  
**3. Canal 11**

En el ejemplo, el router inalámbrico está configurado en el canal 6.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223304.png]]

- *Configurar el modo de seguridad*

De forma predeterminada, un router inalámbrico puede no tener seguridad WLAN configurada.

Para proteger la red, se puede seleccionar WPA2 Personal para las WLAN.

Actualmente, WPA2 con cifrado AES es uno de los métodos de seguridad más sólidos para redes inalámbricas.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223409.png]]

- *Configurar la contraseña*

WPA2 Personal utiliza una contraseña para autenticar a los clientes inalámbricos.

Es una opción más sencilla para hogares y pequeñas oficinas, ya que no requiere un servidor de autenticación.

En organizaciones más grandes, se utiliza WPA2 Enterprise, donde los usuarios deben autenticarse mediante nombre de usuario y contraseña.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223502.png]]

---

### Configuración de una red de Malla Inalámbrica

En redes domésticas o de pequeñas oficinas, un solo router inalámbrico puede ser suficiente para brindar acceso Wi-Fi.

Si se necesita mayor cobertura, se pueden agregar puntos de acceso inalámbricos para extender el rango más allá de aproximadamente:

**1. 45 metros en interiores**  
**2. 90 metros en exteriores**

En una red de malla inalámbrica, los puntos de acceso deben configurarse con la misma configuración WLAN, utilizando canales no superpuestos como 1, 6 y 11 para evitar interferencias.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223550.png]]

Extender una WLAN en hogares u oficinas pequeñas es cada vez más sencillo gracias a los sistemas de red de malla inalámbrica (WMN).

Estos sistemas permiten:

**1. Distribuir varios puntos de acceso para ampliar la cobertura.**
**2. Configurar la red fácilmente mediante aplicaciones móviles.**  
**3. Crear una red unificada con mejor alcance y menos zonas sin señal.**

El proceso generalmente consiste en instalar los puntos de acceso, conectarlos, descargar la aplicación del fabricante y seguir pocos pasos de configuración.

---

### NAT para IPv4

En la página de estado de un router inalámbrico se puede visualizar la asignación de direcciones IPv4 utilizada.

**1. Dirección IPv4 WAN:**  
Es la dirección usada para comunicarse con Internet (por ejemplo, 209.165.201.11).

**2. Dirección IPv4 LAN:**  
Es la dirección interna del router dentro de la red local (por ejemplo, 10.10.10.1).

Todos los dispositivos conectados a la red local recibirán direcciones IP con el mismo prefijo de la red LAN.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430223856.png]]

La dirección IPv4 pública del router puede enrutar tráfico en Internet, mientras que las direcciones privadas de la red local no pueden hacerlo directamente.

Para permitir la comunicación, el router utiliza NAT (Traducción de Direcciones de Red), que:

**1. Convierte direcciones IPv4 privadas internas en una dirección pública enrutable.**  
**2. Realiza el proceso inverso para el tráfico entrante.**  
**3. Permite que múltiples dispositivos compartan una sola dirección IPv4 pública.**

NAT hace posible que varios equipos de una red local accedan a Internet utilizando una única dirección pública, administrando las conexiones mediante el seguimiento de puertos de origen.

---

### Calidad de servicio

Muchos routers inalámbricos ofrecen la función de Calidad de Servicio (QoS), que permite priorizar ciertos tipos de tráfico en la red, como voz y video, para mejorar su rendimiento frente a otros servicios menos sensibles a retrasos, como el correo electrónico o la navegación web.

En algunos modelos, también es posible asignar prioridad a puertos específicos. Estas configuraciones suelen encontrarse en las opciones avanzadas del router o en secciones relacionadas con el control del ancho de banda.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430224118.png]]

---

### Reenvío de Puerto

Los routers inalámbricos permiten bloquear puertos TCP y UDP para evitar accesos no autorizados a la red local. Sin embargo, en algunos casos es necesario habilitar puertos específicos para permitir la comunicación de ciertas aplicaciones o servicios.

El reenvío de puertos (Port Forwarding) funciona mediante reglas que dirigen el tráfico entrante hacia dispositivos internos específicos según el número de puerto. Por ejemplo, si se configura el puerto 80 para HTTP, el router redirige ese tráfico a un servidor web dentro de la red local.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260430224527.png]]

La activación de puertos permite que el router abra y reenvíe puertos de manera temporal hacia un dispositivo específico cuando este inicia una conexión saliente mediante determinados puertos predefinidos.

Este mecanismo se utiliza cuando una aplicación, como un videojuego, requiere comunicación dinámica. Mientras los puertos de activación estén en uso, el router permite tráfico entrante relacionado; cuando dejan de utilizarse, los puertos se cierran automáticamente, mejorando la seguridad.

---

## Configure una WLAN básica en el WLC

### Topología WLC

En esta topología se utiliza un punto de acceso basado en controlador, conocido como LAP (Lightweight Access Point), en lugar de un punto de acceso autónomo.

Los LAP no requieren configuración inicial individual, ya que se comunican con el controlador WLAN (WLC) mediante LWAPP. Esto permite que varios puntos de acceso sean configurados y administrados automáticamente desde un solo controlador, facilitando la gestión de redes inalámbricas más grandes.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501002912.png]]

#### Tabla de direccionamiento

| Dispositivo                      | Interfaz       | Dirección IP    | Máscara de subred |
| -------------------------------- | -------------- | --------------- | ----------------- |
| R1                               | F0/0           | 172.16.1.1      | 255.255.255.0     |
| R1                               | F0/1.1         | 192.168.200.1   | 255.255.255.0     |
| S1                               | VLAN 1         | DHCP            |                   |
| WLC                              | Administración | 192.168.200.254 | 255.255.255.0     |
| AP1                              | Wired 0        | 192.168.200.3   | 255.255.255.0     |
| PC-A                             | NIC            | 172.16.1.254    | 255.255.255.0     |
| PC-B                             | NIC            | DHCP            |                   |
| Computadora portátil inalámbrica | NIC            | DHCP            |                   |

---

### Iniciar sesión en el WLC

Configurar un controlador de red inalámbrica (WLC) es similar a la configuración de un router inalámbrico, pero con la diferencia de que el WLC administra múltiples puntos de acceso y ofrece mayores capacidades de control y administración de la red inalámbrica.

El acceso al WLC se realiza mediante una interfaz gráfica (GUI), utilizando las credenciales definidas durante la configuración inicial.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003327.png]]

La página de Network Summary es un panel que provee una visión rápida del número de redes inalámbricas configuradas, los puntos de acceso asociados y los clientes activos. También se puede ver la cantidad de puntos de acceso dudosos y los clientes, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003356.png]]

---

### Ver la información del punto de acceso

Al seleccionar la opción Access Points en el menú, el controlador permite visualizar información general del punto de acceso, incluyendo datos de sistema, rendimiento y dirección IP.

En este ejemplo, el AP utiliza la dirección IP 192.168.200.3, y gracias a que CDP está habilitado, el WLC también identifica que el dispositivo está conectado al puerto FastEthernet 0/1 del switch.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003436.png]]

El AP en la topología es un Cisco Aironet 1815i, lo cual significa que se puede usar la línea de comandos y una cantidad limitada comandos de IOS. En el ejemplo, el administrador de la red hizo ping a la puerta de enlace, hizo ping al WLC, y verificó la interfaz conectada con cable.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003532.png]]

---

### Configuración Avanzada

La mayoría de los controladores WLAN (WLC) incluyen menús básicos para configuraciones comunes, pero los administradores de red suelen utilizar las opciones avanzadas para un control más completo.

En el Cisco 3504, al seleccionar la opción Advanced, se accede a la página Summary, desde donde es posible administrar todas las configuraciones del controlador.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003623.png]]

---

### Configurar una WLAN

Los controladores de red inalámbrica (WLC) cuentan con puertos físicos para las conexiones a la red cableada e interfaces virtuales configuradas por software.

Estas interfaces funcionan de manera similar a las VLAN, ya que cada WLAN puede asociarse a una VLAN diferente dentro del WLC. Esto permite que un número reducido de puertos físicos transporte tráfico de múltiples VLAN y puntos de acceso, facilitando la administración de varias redes inalámbricas desde un solo controlador.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003727.png]]

La configuración WLAN en el WLC incluye los siguientes pasos:

1. Crear la WLAN.
2. Aplicar y activar la WLAN
3. Seleccionar una interfaz.
4. Asegurar la WLAN
5. Verificar que la WLAN este funcionando
6. Monitorear la WLAN
7. Ver la información del cliente inalámbrico

- *Crear la WLAN*

En la figura, el administrador esta creando una nueva WLAN que usara el nombre **Wireless_LAN** y como identificador de conjunto de servicios (SSID). El ID es una valor arbitrario que se usa para identificar la WLAN en el WLC en pantalla.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003816.png]]

- *Aplicar y activar la WLAN*

Después de aplicar la configuración, el administrador debe habilitar la WLAN para que los usuarios puedan acceder a ella.

La opción Enabled permite activar la red inalámbrica una vez que se hayan configurado previamente sus funciones, como seguridad, QoS, políticas y otras opciones avanzadas.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501003922.png]]

- *Seleccionar una interfaz*

Cuando crea la red WLAN, debe seleccionar la interfaz que llevara el trafico del WLAN. La próxima figura muestra la selección de una interfaz que ya ha sido creada en el WLC. Aprenderemos como crear interfaces mas adelante en este modulo.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004006.png]]

- *Asegurar la WLAN*

En la pestaña de Security, el administrador puede configurar las opciones de protección de la WLAN.

Para asegurar la red en Capa 2 con WPA2-PSK, se selecciona WPA+WPA2, se habilita la opción PSK y se configura la clave precompartida. Después de aplicar los cambios, los clientes inalámbricos que conozcan esa clave podrán autenticarse y conectarse a la red.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004055.png]]

- *Verificar que la WLAN este funcionando*

Haga clic en WLANs en el menú de la izquierda, para ver la nueva WLAN configurada. En la figura, puede verificar que el ID del WLAN esta configurado con el nombre y SSID Wireless_LAN, que esta activo, y que esta usando seguridad WPA2 PSK.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004148.png]]

- *Monitorear la WLAN*

Haga clic en la pestaña Monitor en la parte superior para acceder de nuevo a la pagina avanzada Summary. Aquí puede ver que **Wireless_LAN** ahora tiene un cliente usando sus servicios, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004234.png]]

- *Ver detalles del cliente inalámbrico*

Haga clic en Clients en el menú de la derecha para ver mas información sobre los clientes conectados al WLAN, como se muestra en la figura. Un cliente esta conectado a **Wireless_LAN** a través de un punto de acceso y se le asigno la dirección IP 192.168.5.2. Los servicios de DHCP en esta topología son dados por el router.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004326.png]]

---

## Configure una red inalámbrica WLAN WPA2 Enterprise en el WLC

### SNMP y RADIUS

En este escenario, la PC-A funciona como servidor SNMP y RADIUS.

El servidor SNMP permite monitorear la red y recibir mensajes de registro enviados por el WLC, conocidos como traps.

El servidor RADIUS se utiliza para servicios AAA (autenticación, autorización y contabilidad) en redes WLAN con WPA2 Enterprise, permitiendo que cada usuario se autentique con credenciales individuales en lugar de una clave precompartida, facilitando el control, seguimiento y administración centralizada del acceso.

#### Topología

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004602.png]]

---

### Configurar Información del Servidor SNMP

En la pestaña MANAGEMENT del WLC se encuentran diversas funciones de administración.

Para configurar un receptor de mensajes SNMP trap, se accede al menú SNMP, luego a Trap Receivers, y se selecciona la opción New para agregar un nuevo destino donde el controlador enviará sus registros SNMP.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004649.png]]

1. Haga clic en Management
2. Haga clic en SNMP
3. Haga clic en Trap Receivers
4. Haga clic en New...

Agregue el nombre del SNMP Community y la dirección IP (IPv4 o IPv6) del servidor SNMP. Haga clic en Apply. Ahora el WLC enviará los mensajes de registro de SNMP al servidor SNMP.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004752.png]]

---

### Configure los servidores RADIUS

Para implementar WPA2 Enterprise en la WLAN, el WLC debe configurarse para utilizar un servidor RADIUS externo para la autenticación de usuarios.

Esto se realiza desde la pestaña SECURITY, en la sección RADIUS > Authentication, donde se agrega el servidor RADIUS (en este caso, PC-A) para gestionar la autenticación centralizada de los usuarios.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004842.png]]

1. Haga clic en SECURITY
2. Haga clic en RADIUS
3. Haga clic en Authentication
4. Haga clic en New...

Agregue la direccion IPv4 para PC-A y el secreto compartido. Esta es la contraseña que se usa entre el WLC y el servidor RADIUS. No es para los usuarios Haga clic en Apply, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004926.png]]

Después de hacer clic en Apply, la lista de RADIUS Authentication Servers configurados se refresca con el nuevos servidor listado, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501004949.png]]

---

### Topología de direcciones en VLAN 5

Cada WLAN en el WLC requiere una interfaz virtual propia, asociada a una VLAN específica.

En este caso, la nueva WLAN utilizará la interfaz VLAN 5 con la red 192.168.5.0/24. El router ya cuenta con una subinterfaz configurada para esa VLAN, lo que permite integrar la nueva red inalámbrica con la infraestructura existente.

#### Topología

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005135.png]]

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005151.png]]

---

### Configurar una nueva interfaz

La configuración WLAN en el WLC incluye los siguientes pasos:

1. Crear una nueva interfaz
2. Configurar el nombre y el ID de la VLAN
3. Configurar la direccion del puerto y la interfaz
4. Configurar la dirección del servidor DHCP
5. Aplicar y Confirmar
6. Verificar interfaces

- *Crear una nueva interfaz*

Para agregar una nueva interfaz, haga clic en CONTROLLER > Interfaces > New..., como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005236.png]]

- *Configurar el nombre y el ID de la VLAN*

En la figura se muestra que el administrador de la red configura el nombre de la interfaz como vlan5 y el ID de la VLAN como 5. Haciendo clic en Apply se crea la nueva interfaz.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005326.png]]

- *Configurar la direccion del puerto y la interfaz*

En la pagina Edit de la interfaz, configure el número de puerto físico. G1 en la topología es el Puerto número 1 en el WLC. Luego, configure el direccionamiento de la interfaz de la VLAN 5. En la figura, la VLAN 5 tiene asignada la dirección IPv4 192.168.5.254/24. R1 es la puerta de enlace con la dirección IPv4 192.168.5.1.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005406.png]]

- *Configurar la direccion del servidor DHCP*

En redes empresariales, el WLC puede configurarse para reenviar solicitudes DHCP hacia un servidor específico.

En este ejemplo, se establece como servidor DHCP principal la dirección 192.168.5.1, correspondiente al router de puerta de enlace predeterminado, que proporciona direcciones IP a los dispositivos que se conectan a la WLAN de la VLAN 5.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005451.png]]

- *Aplicar y confirmar*

Desplazase hacia arriba y haga clic en Apply, como se muestra en la figura. Haga clic en OK para el mensaje de advertencia.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005521.png]]

- *Verificar interfaces*

Haga Click Interfaces. La nueva interfaz vlan5 ahora se muestra en la lista de interfaces con su dirección IPv4, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005612.png]]

---

### Configurar el Alcance DHCP

La configuración del ámbito de DHCP incluye los siguientes pasos:

1. Configurar el ámbito DHCP
2. Nombrar un ámbito DHCP
3. Verificar el nuevo ámbito DHCP
4. Configurar y activar un nuevo ámbito DHCP
5. Verificar el nuevo ámbito DHCP

- *Configurar el ámbito DHCP*

Un alcance DHCP funciona de forma similar a un pool DHCP, permitiendo definir rangos de direcciones IP y otros parámetros de red para los clientes.

Desde el WLC, se puede crear un nuevo alcance DHCP accediendo a Internal DHCP Server > DHCP Scope > New, donde se configuran las opciones necesarias para la asignación automática de direcciones.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005719.png]]

- *Nombrar un ámbito DHCP*

En la próxima pantalla, nombre el alcance. EL alcance aplica para la red de administración inalámbrica, entonces el administrador de la red usara Wireless_Management para el nombre del alcance y después debe hacer clic en Apply.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005801.png]]

- *Verificar el nuevo ámbito DHCP*

Volverá a la página DHCP Scopes y ahí verifique que el alcance está listo para ser configurado. Haga clic en el nombre del nuevo alcance para configurar el alcance de DHCP.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005851.png]]

- *Configurar y activar un nuevo ámbito DHCP*

En la configuración del ámbito DHCP Wireless_Management, se define un rango de direcciones IP dentro de la red 192.168.200.0/24, desde la .240 hasta la .249.

También se establece como puerta de enlace la dirección 192.168.200.1, correspondiente al router, y finalmente se habilita el ámbito para que pueda asignar direcciones automáticamente a los dispositivos conectados.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501005932.png]]

- *Verificar el nuevo ámbito DHCP*

El administrador de red será llevado de vuelta la página de DHCP Scopes y podrá verificar que el alcance está listo para ser asignado a una nueva WLAN.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010003.png]]

---

### Configure una red inalámbrica WLAN WPA2 Enterprise

De forma predeterminada, las nuevas WLAN en el WLC utilizan WPA2 con cifrado AES y emplean 802.1X para la autenticación mediante servidor RADIUS.

Dado que el servidor RADIUS ya está configurado, solo resta crear la nueva WLAN y asociarla con la interfaz VLAN 5 para completar su implementación.

La configuración WLAN en el WLC incluye los siguientes pasos:

1. Crear una nueva WLAN
2. Configurar el nombre y el SSID de la WLAN
3. Habilitar la WLAN para VLAN 5
4. Verificar los valores predeterminados de AES y 802.1X.
5. Configurar la seguridad de WLAN para que use el servidor RADIUS
6. Verificar que la nueva WLAN este disponible

- *Crear una nueva WLAN*

Haga clic en la pestaña WLANs y luego en Ir para crear una nueva WLAN, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010118.png]]

- *Configurar el nombre y el SSID de la WLAN*

Rellene con el nombre del perfil y el SSID Con el fin de ser consistente con la VLAN que fue previamente configurada, escoja un ID de 5. Sin embargo, puede usar cualquier valor disponible. Haga clic en Apply, para crear una nueva WLAN, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010147.png]]

- *Habilitar la WLAN para VLAN 5*

La WLAN ha sido creada pero aun necesita activarse y asociarse con la interfaz VLAN correcta. Cambiar el estado de Enabled y escoger vlan5 en la lista desplegable de Interface/Interface Grupo(G). Haga clic en Aplicar y haga clic en OK para aceptar el mensaje emergente, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010227.png]]

- *Verificar los valores predeterminados de AES y 802.1X.*

Haga clic en la pestaña Security para ver la configuración predeterminada de seguridad para la WLAN nueva. La WLAN usará seguridad WPA2 con encripción AES. El tráfico de autenticación es manejado por 802.1X entre el WLC y el servidor RADIUS.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010255.png]]

- *Configurar el servidor RADIUS*

Ahora necesitamos seleccionar el servidor RADIUS que va a usarse para autenticar los usuarios de esta WLAN. Haga clic en la ficha AAA Servers. En la lista desplegable seleccionar el servidor RADIUS que fue configurado previamente en el WLC. Aplique los cambios.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010339.png]]

- *Verificar que la nueva WLAN este disponible*

Para comprobar la configuración, se revisa la lista de WLANs en el WLC, donde deben aparecer las redes creadas y activas.

En este caso, Wireless_LAN utiliza WPA2 con autenticación PSK, mientras que CompanyName emplea WPA2 con autenticación 802.1X mediante servidor RADIUS.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010423.png]]


---

## Solución de problemas de WLAN

### Enfoques para la Solución de Problemas

La solución de problemas en redes WLAN consiste en identificar y corregir fallas que pueden originarse por problemas de hardware, software o conectividad.

Para hacerlo de manera efectiva, se utiliza un proceso sistemático basado en el método científico, siguiendo seis pasos que permiten analizar el problema, determinar su causa y aplicar una solución adecuada.

| Paso | Título | Descripción simplificada |
|---|---|---|
| 1 | Identificación del problema | Habla con el usuario para entender cuál es el problema. |
| 2 | Establecer una teoría de causas probables | Basado en lo que te dijeron, piensa en las posibles causas del problema. |
| 3 | Poner a prueba la teoría para determinar la causa | Prueba cada posible causa para encontrar la raíz del problema. Si una prueba no funciona, busca más información. |
| 4 | Establecer un plan de acción e implementar la solución | Una vez que sepas la causa, define un plan para solucionarlo y aplícalo. |
| 5 | Verificar la funcionalidad total y aplicar medidas preventivas | Confirma que todo funcione correctamente y toma medidas para que el problema no vuelva a ocurrir. |
| 6 | Registrar hallazgos, acciones y resultados | Anota lo que encontraste, lo que hiciste y cómo lo resolviste. Esto ayuda en el futuro. |

Para evaluar un problema de red, primero se debe identificar cuántos dispositivos están afectados.

Si el problema ocurre en un solo dispositivo, la revisión debe comenzar allí. Si afecta a toda la red, el diagnóstico debe iniciarse en el punto central de conexión.

El proceso de solución debe seguir un método lógico y ordenado, descartando posibles causas una por una.

---

### Cliente Inalámbrico no está conectando

Cuando se está resolviendo problemas de una red WLAN, se recomienda usar un proceso de eliminación.

En la figura, un cliente inalámbrico no se esta conectando a la WLAN.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010624.png]]

Si no existe conectividad en una WLAN, primero se debe verificar la configuración de red del dispositivo afectado usando herramientas como `ipconfig`, confirmando que tenga una dirección IP válida obtenida por DHCP o configurada correctamente de forma estática.

Luego, se debe comprobar si el problema está en la conexión inalámbrica o en el equipo, conectando el dispositivo a una red cableada para probar la conectividad. También es importante revisar el funcionamiento de la tarjeta de red inalámbrica, sus controladores y que la configuración de seguridad y cifrado coincida exactamente con la del punto de acceso.

Si la conexión existe pero el rendimiento es deficiente, se debe analizar la distancia entre el cliente y el AP, verificar si está dentro del área de cobertura adecuada, revisar el canal inalámbrico y detectar posibles interferencias de otros dispositivos que operen en la banda de 2.4 GHz, como teléfonos inalámbricos, microondas o puntos de acceso no autorizados.

Además, se debe confirmar que todos los dispositivos estén encendidos, correctamente alimentados y físicamente conectados, revisando cables, conectores y enlaces de red. Si la infraestructura física funciona correctamente, se procede a probar la conectividad dentro de la LAN, incluyendo el AP.

Finalmente, si el problema no proviene del cliente ni de la red física, la investigación debe centrarse en el punto de acceso, revisando su estado de energía, funcionamiento y configuración.

---

### Resolución de Problemas cuando la red esta lenta.

Para optimizar el rendimiento y aumentar el ancho de banda en routers y puntos de acceso de doble banda, es recomendable actualizar los dispositivos inalámbricos antiguos, ya que equipos con estándares más antiguos como 802.11b, 802.11g o incluso algunos 802.11n pueden reducir el desempeño general de la red.

También es útil dividir el tráfico entre las bandas de 2.4 GHz y 5 GHz. La banda de 2.4 GHz puede utilizarse para tareas básicas como navegación web, correo electrónico y descargas, mientras que la banda de 5 GHz puede reservarse para actividades de mayor demanda, como transmisión de contenido multimedia, mejorando así la eficiencia de la red.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010742.png]]

Dividir el tráfico entre las bandas de 2.4 GHz y 5 GHz mejora el rendimiento de la red porque permite asignar tareas básicas a la banda de 2.4 GHz, mientras que la banda de 5 GHz, menos congestionada y con más canales disponibles, puede utilizarse para aplicaciones que requieren mayor velocidad, como la transmisión multimedia.

Para facilitar esta segmentación, es recomendable asignar nombres distintos a cada red, permitiendo que los usuarios se conecten fácilmente a la banda más adecuada.

Además, para mejorar el alcance de la WLAN, el router o punto de acceso debe ubicarse en un lugar libre de obstáculos físicos que puedan bloquear la señal. Si la cobertura sigue siendo insuficiente, se pueden utilizar extensores de rango Wi-Fi o tecnologías como Powerline.

---

### Actualizar el Firmware

La mayoría de los routers y puntos de acceso inalámbricos permiten actualizar su firmware.

Estas actualizaciones suelen incluir correcciones de errores, mejoras de rendimiento y soluciones para vulnerabilidades de seguridad, por lo que es importante revisar periódicamente el sitio web del fabricante para mantener los dispositivos actualizados.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010834.png]]

En un WLC, es muy posible que se pueda actualizar el firmware de todos los APs que son controlados por el WLC. En la próxima figura, el administrador de la red esta descargando la imagen del firmware que se usara para actualiza todos los APs.

![[Telemática II/Curso de Cisco II/Módulo 13/ANEXOS/Pasted image 20260501010846.png]]

En un controlador inalámbrico Cisco 3504, haga clic en WIRELES tab > Access Point desde el menú de la izquierda >sub-menú Global Configuration. Luego diríjase hasta el fondo de la pagina hacia la sección de Pre-descarga.

Los usuarios se desconectarán de la WLAN y a Internet hasta que la actualización finalice. El router inalámbrico posiblemente deba reiniciar varias veces antes de que se hayan restaurado las operaciones normales de la red.

---