# Módulo 12: Conceptos WLAN

---

## Contenido

- **Introducción a la tecnología inalámbrica:** Describa la tecnología y los estándares WLAN.

- **Componentes de las WLAN:** Describa los componentes de una infraestructura WLAN.

- **Funcionamiento de WLAN:** Explica como la tecnología inalámbrica permite el funcionamiento de WLAN.

- **Funcionamiento de CAPWAP:** Explica como un WLC utiliza CAPWAP para administrar múltiples AP.

- **Administración de canales:** Describa la administración de canales en una WLAN.

- **Amenazas a la WLAN:** Describa las amenazas a las WLAN.

- **WLAN seguras:** Describa los mecanismos de seguridad de WLAN.

---

## Introducción a la tecnología inalámbrica

Una WLAN (Red de Área Local Inalámbrica) permite conectar dispositivos como laptops, tablets y teléfonos inteligentes sin necesidad de cables, facilitando la movilidad en hogares, oficinas y campus.

Estas redes permiten que los usuarios se mantengan conectados mientras se desplazan dentro de un área determinada, integrándose con otras infraestructuras como redes cableadas, proveedores de servicios o redes celulares.

En entornos empresariales, las WLAN ofrecen ventajas económicas al reducir costos de instalación y reubicación de equipos, empleados o espacios de trabajo. Además, brindan flexibilidad para adaptarse rápidamente a cambios organizacionales, tecnológicos o necesidades temporales.

---

### Tipos de redes inalámbricas

Las LAN inalámbricas (WLAN) se basan en los estándares IEEE y se pueden clasificar en cuatro tipos principales: WPAN, WLAN, WMAN y WWAN.

- *WPAN*

Las WPAN (Redes Inalámbricas de Área Personal) son redes de corto alcance que utilizan transmisores de baja potencia para conectar dispositivos dentro de una distancia aproximada de 6 a 9 metros.

Tecnologías como Bluetooth y ZigBee son las más comunes en este tipo de red, permitiendo la comunicación entre dispositivos personales como audífonos, teléfonos, relojes inteligentes o sensores.

Las WPAN operan bajo el estándar IEEE 802.15 y generalmente utilizan la frecuencia de 2.4 GHz.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428212105.png]]

- *WLAN*

Las WLAN (Redes de Área Local Inalámbrica) permiten conectar dispositivos dentro de un área mediana, con cobertura de hasta aproximadamente 300 pies (unos 90 metros).

Son ampliamente utilizadas en hogares, oficinas y campus, proporcionando acceso flexible a la red sin necesidad de conexiones físicas.

Las WLAN funcionan bajo el estándar IEEE 802.11 y operan principalmente en frecuencias de 2.4 GHz y 5 GHz.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428212207.png]]

- *WMAN*

Las WMAN (Redes Inalámbricas de Área Metropolitana) ofrecen cobertura inalámbrica en áreas geográficas amplias, como ciudades o distritos específicos.

Se utilizan para brindar acceso de red a gran escala, conectando múltiples usuarios o zonas dentro de una región metropolitana.

Estas redes operan mediante frecuencias específicas con licencia, lo que permite mayor control, estabilidad y alcance en la comunicación.

Las WMAN suelen basarse principalmente en el estándar IEEE 802.16, conocido como WiMAX (Worldwide Interoperability for Microwave Access).

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428212350.png]]

- *WWAN*

Las WWAN (Redes Inalámbricas de Área Amplia) proporcionan cobertura en áreas geográficas extensas, incluyendo regiones nacionales e internacionales.

Son utilizadas principalmente por redes celulares y proveedores de telecomunicaciones para ofrecer conectividad móvil a gran escala.

Estas redes operan con frecuencias licenciadas para garantizar cobertura amplia, estabilidad y comunicación continua.

Generalmente se basan en estándares como:

- 3G
- 4G LTE
- 5G

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428213210.png]]

---

### Tecnologías inalámbricas

Para enviar y recibir datos, la tecnología inalámbrica usa el espectro de radio sin licencia. Cualquier persona que tenga un router inalámbrico y tecnología inalámbrica en el dispositivo que utilice puede acceder al espectro sin licencia.

- *Bluetooth*

Bluetooth es una tecnología WPAN basada en el estándar IEEE 802.15, diseñada para comunicaciones inalámbricas de corto alcance, con distancias de hasta aproximadamente 100 metros.

Se utiliza comúnmente en dispositivos domésticos inteligentes, audífonos, vehículos, periféricos y otros equipos que requieren conectividad cercana.

Tipos principales:

- **Bluetooth Low Energy (BLE):**  
    Consume menos energía y permite topologías de malla, ideal para IoT y redes de múltiples dispositivos.
- **Bluetooth Basic Rate / Enhanced Data Rate (BR/EDR):**  
    Diseñado para conexiones punto a punto, especialmente optimizado para transmisión de audio y datos continuos.

- *WiMAX*

WiMAX (Worldwide Interoperability for Microwave Access) es una tecnología de banda ancha inalámbrica basada en el estándar IEEE 802.16.

Se utiliza como alternativa a servicios de cable o DSL, especialmente en zonas donde no existe infraestructura cableada.

Características principales:

- Cobertura de hasta 50 km (30 millas)
- Acceso inalámbrico de alta velocidad
- Mayor alcance que Wi-Fi
- Soporta mayor cantidad de usuarios
- Utiliza torres de transmisión similares a las de telefonía celular

WiMAX permite ofrecer conectividad de banda ancha en áreas metropolitanas o rurales, proporcionando acceso eficiente a internet a gran escala.

- *Ancho de banda celular*

La banda ancha celular incluye tecnologías móviles como 4G y 5G, utilizadas para transmitir voz y datos en teléfonos, tablets, vehículos y computadoras portátiles.

Estas redes funcionan mediante torres celulares que cubren áreas específicas llamadas celdas; al interconectarse, forman una red celular amplia.

Tipos principales de tecnologías celulares:

- **GSM (Global System for Mobile Communications):** estándar internacional más utilizado.
- **CDMA (Code Division Multiple Access):** usado principalmente en algunos mercados específicos.

Características:

- **4G:** ofrece velocidades significativamente superiores a 3G.
- **5G:** proporciona velocidades mucho mayores, menor latencia y capacidad para conectar una enorme cantidad de dispositivos simultáneamente.

Estas tecnologías son esenciales para comunicaciones móviles modernas a gran escala.

- *Banda ancha satelital (Satellite Broadband)

La banda ancha satelital proporciona acceso a internet en ubicaciones remotas mediante una antena parabólica orientada hacia un satélite geoestacionario.

Características principales:

- Ideal para zonas rurales o aisladas
- Requiere línea de visión clara hacia el satélite
- Mayor costo que otras opciones de conectividad
- Útil donde no existen servicios de cable, fibra o DSL

Es una solución común para hogares y empresas en áreas donde otras infraestructuras de red no están disponibles.

---

### Estándares de Wi-Fi 802.11

Los estándares IEEE 802.11 definen el funcionamiento de las redes Wi-Fi (WLAN), especificando cómo se utilizan las frecuencias de radio, principalmente 2.4 GHz y 5 GHz, para la comunicación inalámbrica.

Los dispositivos Wi-Fi usan antenas para transmitir y recibir señales, y los estándares más recientes incorporan tecnología MIMO (Multiple Input Multiple Output), que emplea múltiples antenas para mejorar velocidad, alcance y rendimiento de la red.

Características clave:

- Operan en bandas de 2.4 GHz y/o 5 GHz
- Permiten conexión inalámbrica en redes locales
- MIMO mejora el rendimiento mediante múltiples transmisores y receptores
- Pueden soportar hasta cuatro antenas simultáneamente

Con el tiempo, han surgido múltiples versiones del estándar 802.11 para ofrecer mayores velocidades, mejor cobertura y mayor eficiencia.

| Estándar IEEE WLAN | Radiodiferencias | Descripción                                                                                                                                                                                                                                                               |
| ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 802.11             | 2,4 GHz          | • velocidades de hasta 2 Mbps                                                                                                                                                                                                                                             |
| 802.11a            | 5 GHz            | • velocidades de hasta 54 Mbps<br>• Área de cobertura pequeña<br>• menos efectivo penetrando estructuras de construcción<br>• No interoperable con 802.11b o 802.11g                                                                                                      |
| 802.11b            | 2,4 GHz          | • velocidades de hasta 11 Mbps<br>• Mayor alcance que 802.11a<br>• mejor penetración en las estructuras de los edificios.                                                                                                                                                 |
| 802.11g            | 2,4 GHz          | • velocidades de hasta 54 Mbps<br>• compatible con versiones anteriores de 802.11b con capacidad de ancho de banda reducida                                                                                                                                               |
| 802.11n            | 2,4 GHz y 5 GHz  | • velocidades de 150 Mbps a 600 Mbps con alcance de hasta 70 m<br>• requiere múltiples antenas usando tecnología MIMO<br>• compatible con 802.11a/b/g (velocidades limitadas)                                                                                             |
| 802.11ac           | 5 GHz            | • velocidades de 450 Mbps a 1.3 Gbps usando MIMO<br>• soporta hasta ocho antenas<br>• compatible con 802.11a/n (velocidades limitadas)                                                                                                                                    |
| 802.11ax           | 2,4 GHz y 5 GHz  | • lanzado en 2019 (Wi-Fi 6)<br>• también conocido como High-Efficiency Wireless (HEW)<br>• mayores velocidades y capacidad<br>• maneja muchos dispositivos conectados<br>• mejor eficiencia energética<br>• soporta frecuencias de 1 GHz y 7 GHz cuando estén disponibles |

---

### Radiofrecuencia

Los dispositivos inalámbricos operan dentro del espectro electromagnético utilizando frecuencias específicas para transmitir y recibir datos.

En redes WLAN basadas en IEEE 802.11, se utilizan principalmente dos bandas:

- **2.4 GHz (UHF):**  
    Compatible con estándares 802.11b, 802.11g, 802.11n y 802.11ax.  
    Ofrece mayor alcance, pero puede presentar más interferencias.
- **5 GHz (SHF):**  
    Compatible con estándares 802.11a, 802.11n, 802.11ac y 802.11ax.  
    Proporciona mayores velocidades y menos interferencia, aunque con menor alcance.

La elección de banda depende del equilibrio entre cobertura, velocidad y congestión de la red.

#### El especto electromagnético

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428215024.png]]

---

### Organizaciones de estándares inalámbricos

Los estándares aseguran la interoperabilidad entre dispositivos fabricados por diferentes fabricantes. A nivel internacional, las tres organizaciones que influyen en los estándares WLAN son ITU-R, el IEEE, y la Wi-Fi Alliance.

- *ITU*

La Unión Internacional de Telecomunicaciones (UIT) regula la asignación del espectro de radiofrecuencia y las órbitas de los satélites a través del UIT-R. UIT-R significa el Sector de Radiocomunicaciones de la UIT.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428215219.png]]

- *IEEE*

El IEEE especifica como se modula una frecuencia de radio para transportar información. Mantiene los estándares para redes de área local y metropolitana (MAN) con la familia de estándares IEEE 802 LAN / MAN. Los estándares dominantes en la familia IEEE 802 son 802.3 Ethernet y 802.11 WLAN.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428215315.png]]

- *Wi-Fi Alliance*

La Wi-Fi Alliance es una asociación comercial global, sin fines de lucro, dedicada a promover el crecimiento y la aceptación de las WLAN. Es una asociación de proveedores cuyo objetivo es mejorar la interoperabilidad de los productos que se basan en el estandar 802.1.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260428215409.png]]

---

## Componentes de la WLAN

### NIC Inalámbrica

Para que una red inalámbrica funcione, se requieren al menos dos dispositivos con transmisores y receptores configurados en la misma frecuencia:

- Dispositivos finales con tarjetas de red inalámbricas (NIC Wi-Fi)
- Un dispositivo de infraestructura, como un router inalámbrico o punto de acceso (AP)

Muchos equipos modernos, como laptops, tablets, smartphones y vehículos, ya incluyen NIC inalámbricas integradas.

Si un dispositivo no cuenta con conectividad inalámbrica incorporada, puede usar un adaptador USB Wi-Fi.

Aunque muchos dispositivos no muestran antenas externas, estas suelen estar integradas internamente.

#### Adaptador Inalámbrico USB

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429133531.png]]

---

### Router de hogar Inalámbrico

En redes domésticas, el dispositivo de infraestructura más común es el router inalámbrico, que integra varias funciones en un solo equipo:

- **Punto de acceso (AP):** permite la conexión inalámbrica de dispositivos mediante estándares Wi-Fi como 802.11a/b/g/n/ac.
- **Switch:** ofrece puertos Ethernet para conectar dispositivos cableados dentro de la red local.
- **Router:** actúa como puerta de enlace para acceder a otras redes, como Internet.

Esto permite administrar conexiones inalámbricas y cableadas de forma sencilla dentro del hogar.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429160942.png]]

Un router inalámbrico, común en hogares y pequeñas empresas, proporciona acceso Wi-Fi anunciando su red mediante beacons que incluyen el SSID (nombre de la red).

Los dispositivos detectan este SSID, se asocian y autentican para acceder a la red local e Internet.

Funciones comunes:

- Acceso inalámbrico de alta velocidad
- Soporte para transmisión multimedia
- IPv6
- Calidad de servicio (QoS)
- Herramientas de configuración
- Puertos USB para impresoras o almacenamiento externo

Para ampliar la cobertura, se pueden utilizar extensores Wi-Fi, que repiten la señal del router para mejorar el alcance en áreas más alejadas.

---

### Puntos de acceso inalámbricos

Aunque los extensores Wi-Fi son fáciles de implementar, una solución más eficiente es instalar un punto de acceso (AP) adicional para ofrecer cobertura inalámbrica dedicada y mejorar el rendimiento.

Funcionamiento:

- Los dispositivos inalámbricos detectan AP cercanos mediante el SSID
- Se asocian al punto de acceso seleccionado
- Se autentican para obtener acceso
- Una vez validados, pueden utilizar recursos de red e Internet

El uso de APs adicionales suele ofrecer mejor estabilidad, velocidad y capacidad que los repetidores tradicionales, especialmente en redes empresariales o de mayor tamaño.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429161236.png]]

---

### Categorías AP

Los AP se pueden clasificar como AP autónomos o AP basados en controladores.

- *AP autónomos*

Los AP autónomos son puntos de acceso independientes que se configuran individualmente mediante interfaz gráfica (GUI) o línea de comandos (CLI).

Un router doméstico suele ser un ejemplo de AP autónomo.

Aunque son prácticos para pocas implementaciones, cuando aumenta la cantidad de APs, su gestión puede volverse compleja y demandante debido a la configuración individual de cada equipo.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429161354.png]]

- *APs basados en controladores*

Los APs basados en controladores, conocidos como LAPs (Lightweight Access Points), dependen de un controlador WLAN (WLC) para su configuración y administración centralizada.

Estos dispositivos requieren poca configuración inicial y utilizan LWAPP para comunicarse con el WLC. Son ideales en redes medianas o grandes donde se necesitan múltiples puntos de acceso, ya que cada nuevo AP puede ser configurado y administrado automáticamente.

Entre sus principales ventajas están la administración centralizada, mayor escalabilidad, monitoreo simplificado y configuración uniforme en toda la red.

El WLC también puede implementar LAG (Link Aggregation Group), agrupando varios enlaces físicos para ofrecer redundancia y balanceo de carga, similar a EtherChannel.

Aunque los switches deben configurarse con EtherChannel para conectarse al WLC, este no utiliza protocolos como PAgP o LACP.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429162323.png]]

---

### Antenas inalámbricas

La mayoría de los AP de clase empresarial requieren antenas externas para que sean unidades completamente funcionales.

- *Antenas omnidireccionales*

Las antenas omnidireccionales como la que se muestra en la figura brindan una cobertura de 360 grados y son ideales en casas, áreas de oficinas abiertas, salas de conferencias y áreas exteriores.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429162427.png]]

- *Antena direccional*

Las antenas direccionales enfocan la señal Wi-Fi en una dirección específica, mejorando alcance y potencia en esa zona, mientras reducen cobertura en otras áreas. Se usan para conexiones más precisas o de larga distancia, como las antenas Yagi y parabólicas.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429162520.png]]

- *Antenas MIMO*

Entrada múltiple Salida múltiple (MIMO) utiliza múltiples antenas para aumentar el ancho de banda disponible para las redes inalámbricas IEEE 802.11n/ac/ax. Se pueden utilizar hasta ocho antenas de transmisión y recepción para aumentar el rendimiento.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429162602.png]]

---

## Funcionamiento de WLAN

### Modos de topología inalámbrica

Las LAN inalámbricas pueden acomodar varias topologias de red. El estandar 802.11 identifica dos modos principales de topología inalámbrica: modo Ad hoc y modo Infraestructura. Tetherin tambien es un modo en ocasiones usado para proveer un acceso inalámbrico rápido.

- *modo ad hoc*

El modo ad hoc permite que dos o más dispositivos se conecten directamente entre sí de forma inalámbrica, sin necesidad de un punto de acceso o router.

Se utiliza en conexiones P2P como Bluetooth o Wi-Fi Direct.

En IEEE 802.11, este tipo de red se conoce como IBSS (Independent Basic Service Set).

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429163117.png]]

- *modo infraestructura*

Esto ocurre cuando los clientes inalámbricos se interconectan a través de un router inalámbrico o AP, como en las WLAN. Los AP se conectan a la infraestructura de red utilizando el sistema de distribución por cable, como Ethernet.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429163415.png]]

- *Anclaje a red*

El anclaje a red (tethering) permite que un teléfono inteligente o tablet con datos móviles funcione como un punto de acceso personal.

Esto convierte al dispositivo en un router Wi-Fi temporal, permitiendo que otros equipos se conecten, se autentiquen y utilicen su conexión a Internet.

Es una solución práctica y rápida para compartir acceso a la red cuando no hay otra infraestructura disponible.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429163757.png]]

---

### BSS y ESS

El modo de infraestructura define dos bloques de construcción de topología: un conjunto de servicios básicos (BSS) y un conjunto de servicios extendidos (ESS).

- *BSS*

Un BSS (Basic Service Set) utiliza un único punto de acceso para conectar todos los dispositivos inalámbricos dentro de su área de cobertura, llamada BSA (Basic Service Area).

Si un dispositivo sale de esa área, pierde comunicación directa con esa red.

Cada BSS se identifica de forma única mediante el BSSID, que correspoCAPWAP (Control and Provisioning of Wireless Access Points) es un protocolo estándar que permite a un controlador WLAN (WLC) administrar múltiples puntos de acceso (AP) de forma centralizada.

Funciones principales:

- Configuración y administración de varios APs
- Gestión de múltiples redes WLAN
- Encapsulación y transporte del tráfico entre AP y WLC

CAPWAP mejora a LWAPP al incorporar mayor seguridad mediante DTLS (Datagram Transport Layer Security).

Características técnicas:

- Utiliza túneles sobre UDP
- Puertos UDP 5246 (control) y 5247 (datos)
- Compatible con IPv4 e IPv6
- IPv4 funciona por defecto

Esto permite una administración inalámbrica más segura, escalable y eficiente en redes empresariales.nde a la dirección MAC del punto de acceso. Esto permite distinguir cada red inalámbrica individual.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429163916.png]]

- *ESS*

Cuando un solo BSS no ofrece suficiente cobertura, varios BSS pueden unirse mediante un sistema de distribución (DS) para formar un ESS (Extended Service Set).

Un ESS permite:

- Mayor cobertura inalámbrica
- Comunicación entre múltiples áreas de servicio
- Movilidad continua entre puntos de acceso dentro de la misma red

Cada ESS comparte un SSID común, mientras que cada AP mantiene su propio BSSID único.

Esto permite que los usuarios se desplacen entre distintas zonas sin perder conectividad.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429164020.png]]

---

### 802.11 Estructura del Frame

Recuerde que todas las tramas de capa 2 consisten en un encabezado, carga útil y sección de secuencia de verificación de trama (FCS). El formato de la trama 802.11 es similar al formato de la trama de Ethernet, excepto que contiene mas campos, como se muestra en la figura.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429164116.png]]

Las tramas inalámbricas 802.11 incluyen varios campos esenciales para la comunicación:

- **Control de trama:** identifica el tipo de trama y funciones como seguridad, energía y versión del protocolo.
- **Duración:** indica el tiempo necesario para completar la transmisión.
- **Dirección 1:** MAC del receptor inalámbrico.
- **Dirección 2:** MAC del emisor inalámbrico.
- **Dirección 3:** puede contener la dirección del destino final, como el gateway.
- **Control de secuencia:** organiza el orden y fragmentación de tramas.
- **Dirección 4:** se usa principalmente en modo ad hoc.
- **Carga útil:** contiene los datos transmitidos.
- **FCS:** verifica errores en la transmisión de capa 2.

---

### CSMA/CA

Las WLAN funcionan en modo semidúplex y de medio compartido, lo que significa que solo un dispositivo puede transmitir o recibir a la vez en el mismo canal.

Como los dispositivos inalámbricos no pueden detectar colisiones mientras transmiten, utilizan CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) para evitar conflictos.

Proceso básico:

1. El dispositivo escucha si el canal está libre
2. Envía una solicitud RTS (Ready to Send)
3. Recibe una respuesta CTS (Clear to Send) del AP
4. Si no recibe respuesta, espera un tiempo aleatorio
5. Transmite los datos
6. Espera confirmación; si no llega, asume colisión y reintenta

Este mecanismo ayuda a reducir colisiones en redes inalámbricas.

---

### Asociación de AP de cliente inalámbrico

Para conectarse a una WLAN, un dispositivo inalámbrico debe completar tres etapas principales del proceso 802.11:

1. Descubrir el punto de acceso (AP) disponible
2. Autenticarse con el AP
3. Asociarse con el AP

Solo después de completar este proceso el dispositivo puede acceder a la red y sus recursos.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429164422.png]]

Para que un cliente inalámbrico se conecte correctamente a un AP, ambos deben coincidir en ciertos parámetros de configuración:

- **SSID:** nombre de la red inalámbrica
- **Contraseña:** necesaria para autenticación
- **Modo de red:** estándar Wi-Fi utilizado (802.11a/b/g/n/ac/ad)
- **Modo de seguridad:** como WPA2 o WPA3, preferiblemente el más seguro disponible
- **Configuración de canal:** frecuencia o canal de operación para evitar interferencias

Una configuración correcta garantiza autenticación, asociación y comunicación estable dentro de la WLAN.

---

### Modo de entrega pasiva y activa

Los dispositivos inalámbricos deben detectar un AP o un router inalámbrico y se deben conectar a este. Los clientes inalámbricos se conectan al AP mediante un proceso de análisis (sondeo). Este proceso puede ser pasivo o activo.

- *Modo pasivo*

En modo pasivo, el punto de acceso (AP) envía periódicamente señales beacon que anuncian su red.

Estas tramas incluyen:

- SSID
- Estándares compatibles
- Configuración de seguridad

Su función es permitir que los dispositivos inalámbricos detecten redes disponibles en el área y seleccionen el AP más adecuado para conectarse.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429164640.png]]

- *Modo activo*

En modo activo, el cliente inalámbrico inicia la búsqueda de redes enviando solicitudes de sondeo (probe requests).

Puede hacerlo de dos formas:

- Con un SSID específico, cuando conoce el nombre de la red
- Sin SSID, para descubrir redes cercanas disponibles

Los AP compatibles responden con información como:

- SSID
- Estándares soportados
- Configuración de seguridad

Este método es útil especialmente cuando el AP tiene deshabilitada la difusión de beacons.

---

## Funcionamiento de CAPWAP

CAPWAP (Control and Provisioning of Wireless Access Points) es un protocolo estándar que permite a un controlador WLAN (WLC) administrar múltiples puntos de acceso (AP) de forma centralizada.

Funciones principales:

- Configuración y administración de varios APs
- Gestión de múltiples redes WLAN
- Encapsulación y transporte del tráfico entre AP y WLC

CAPWAP mejora a LWAPP al incorporar mayor seguridad mediante DTLS (Datagram Transport Layer Security).

Características técnicas:

- Utiliza túneles sobre UDP
- Puertos UDP 5246 (control) y 5247 (datos)
- Compatible con IPv4 e IPv6
- IPv4 funciona por defecto

Esto permite una administración inalámbrica más segura, escalable y eficiente en redes empresariales.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429165407.png]]

---

### Arquitectura MAC dividida

CAPWAP utiliza el concepto de Split MAC, que divide las funciones tradicionales del punto de acceso entre el AP y el controlador WLAN (WLC).

- **AP (Funciones MAC):** maneja tareas en tiempo real como transmisión de tramas, respuestas inmediatas y comunicación directa con clientes inalámbricos.
- **WLC (Funciones MAC):** administra funciones centralizadas como autenticación, seguridad, configuración, políticas y gestión general de la red.

Esta división mejora el rendimiento, facilita la administración centralizada y optimiza la escalabilidad de redes inalámbricas empresariales.

| AP Funciones MAC                              | Funciones WLC MAC                                       |
| --------------------------------------------- | ------------------------------------------------------- |
| Beacons y respuestas de sonda                 | Autenticación                                           |
| Reconocimientos de paquetes y retransmisiones | Asociación y re-asociación de clientes itinerantes      |
| Cola de Frame y priorización de paquetes      | Traducción de Frames a otros protocolos                 |
| Cifrado y descifrado de datos de capa MAC     | Terminación del tráfico 802.11 en una interfaz cableada |

---

### Encriptación de DTLS

DTLS (Datagram Transport Layer Security) es el protocolo que brinda seguridad entre el Access Point (AP) y el Wireless LAN Controller (WLC), cifrando la comunicación para evitar escuchas, modificaciones de datos y ataques Man-In-the-Middle (MITM).

De forma predeterminada, DTLS protege el canal de control CAPWAP, asegurando todo el tráfico de administración, gestión y control entre el AP y el WLC.

Sin embargo, el cifrado del canal de datos CAPWAP está deshabilitado por defecto y es opcional. Para habilitarlo, el WLC debe contar con una licencia DTLS. Una vez activado, todo el tráfico de datos de los clientes WLAN también se cifra entre el AP y el WLC, aumentando la seguridad general de la red inalámbrica.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429165855.png]]

---

### AP FlexConnect

FlexConnect es una solución inalámbrica diseñada para sucursales y oficinas remotas, permitiendo administrar los AP desde un WLC centralizado en la sede principal a través de una conexión WAN, sin necesidad de instalar un controlador en cada ubicación.

Funciona en dos modos:

- **Modo conectado:** El AP mantiene conexión CAPWAP con el WLC, por lo que el controlador central gestiona las funciones de control y el tráfico puede pasar por el túnel CAPWAP.
- **Modo independiente:** Si se pierde la conexión con el WLC, el AP continúa operando localmente, gestionando el tráfico de clientes y realizando autenticación básica sin depender del controlador central.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260429170500.png]]

---

## Administración de canales

### Canal de frecuencia de saturación

Los dispositivos inalámbricos se comunican mediante frecuencias de radio divididas en canales. Cuando demasiados dispositivos usan el mismo canal, este puede saturarse, causando interferencias y reduciendo la calidad de la conexión.

Para evitar esta congestión, se han desarrollado diversas técnicas que optimizan el uso de los canales, mejorando la eficiencia de la comunicación inalámbrica y reduciendo problemas de saturación.

- *DSSS*

DSSS (Direct Sequence Spread Spectrum) es una técnica de modulación que distribuye la señal en un rango de frecuencia más amplio, reduciendo interferencias y dificultando su interceptación o bloqueo.

Fue desarrollada originalmente con fines militares y permite que el receptor reconstruya la señal original correctamente. En redes inalámbricas, fue utilizada en el estándar 802.11b para mejorar la comunicación en la banda de 2.4 GHz y disminuir interferencias con otros dispositivos.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430172503.png]]

- *FHSS*

FHSS (Frequency Hopping Spread Spectrum) es una técnica de comunicación inalámbrica que transmite señales cambiando rápidamente entre diferentes canales de frecuencia.

Para funcionar, el emisor y el receptor deben estar sincronizados, permitiendo reducir interferencias, mejorar la seguridad y disminuir la congestión del canal. Fue utilizado en el estándar 802.11 original, además de tecnologías como Bluetooth, teléfonos inalámbricos y walkie-talkies.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430172630.png]]

- *OFDM*

OFDM (Orthogonal Frequency Division Multiplexing) es una técnica que divide un canal en múltiples subcanales ortogonales, permitiendo transmitir datos de forma simultánea y eficiente sin interferencias entre ellos.

Esto mejora el rendimiento, aumenta la velocidad y optimiza el uso del espectro inalámbrico. Es utilizada en estándares como 802.11a/g/n/ac, mientras que 802.11ax incorpora su evolución llamada OFDMA, que mejora aún más la eficiencia en redes con muchos dispositivos.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430172747.png]]

---

### Selección de canales

En redes WLAN con varios AP, se recomienda usar canales no superpuestos para reducir interferencias y mejorar el rendimiento.

En la banda de 2.4 GHz (802.11b/g/n), existen 11 canales en América del Norte, cada uno con 22 MHz de ancho de banda y separados por 5 MHz, lo que provoca solapamiento entre muchos de ellos. Por eso, normalmente se utilizan canales como 1, 6 y 11, ya que no se superponen y permiten una mejor distribución de la señal.

#### Canales superpuestos de 2.4GHz en América del Norte

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430172921.png]]

La interferencia en una WLAN ocurre cuando varias señales utilizan canales superpuestos, lo que puede distorsionar la comunicación y reducir el rendimiento.

Por ello, en redes de 2.4 GHz con múltiples AP se recomienda usar canales no superpuestos, específicamente 1, 6 y 11, para minimizar interferencias entre puntos de acceso cercanos. Actualmente, muchos AP modernos gestionan esta configuración de forma automática.

#### Canales no superpuestos de 2.4 GHz para 802.11b/g/n

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430173105.png]]


La banda de 5 GHz, utilizada por estándares como 802.11a/n/ac, ofrece más canales disponibles y menor interferencia que la banda de 2.4 GHz.

Cuenta con 24 canales separados por 20 MHz, distribuidos en varias secciones, permitiendo conexiones más rápidas y eficientes, especialmente en entornos con alta densidad de dispositivos. Gracias a la gran cantidad de canales no superpuestos, es ideal para mejorar el rendimiento de redes inalámbricas congestionadas.

#### Primeros ocho canales no interferentes de 5 GHz

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430173243.png]]

Al igual que con las WLAN de 2.4GHz, elija canales que no interfieran al configurar múltiples AP de 5GHz adyacentes entre si, como se muestra en la figura.

#### Canales no interferentes de 5GHz para 802.11a/n/ac

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430173338.png]]

---

### Planifique la implementación de WLAN

La capacidad de una WLAN depende del diseño físico del lugar, la cantidad de usuarios y dispositivos, la velocidad que necesitan, el uso correcto de canales sin interferencia y la potencia de transmisión de los puntos de acceso (AP).

Para una buena planificación de los AP se recomienda:

- Aprovechar o considerar el cableado disponible y las limitaciones físicas del lugar.
- Identificar fuentes de interferencia como microondas, cámaras inalámbricas o dispositivos que operen en 2.4 GHz.
- Instalar los AP por encima de obstáculos y, preferiblemente, cerca del techo.
- Ubicarlos en zonas donde realmente estarán los usuarios, como salas de reuniones o áreas de trabajo.
- Evitar configuraciones mixtas con estándares antiguos si se busca mejor rendimiento, ya que pueden reducir la velocidad general.

Además, el área de cobertura de cada AP varía según el estándar inalámbrico utilizado, el entorno físico y la potencia configurada, por lo que siempre se deben revisar las especificaciones técnicas antes de diseñar la red.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430173545.png]]

---

## Amenazas a la WLAN

Las WLAN son vulnerables porque cualquier persona dentro del alcance de un punto de acceso (AP) puede intentar conectarse si obtiene las credenciales necesarias, incluso sin ingresar físicamente al lugar.

Principales amenazas de seguridad:

- **Intercepción de datos:** Los atacantes pueden capturar información transmitida, por lo que es esencial usar cifrado.
- **Intrusos inalámbricos:** Usuarios no autorizados pueden intentar acceder a la red; esto se previene con autenticación segura.
- **Ataques DoS (Denegación de Servicio):** Pueden interrumpir el acceso a la red de forma intencional o accidental.
- **AP falsos (Rogue AP):** Puntos de acceso no autorizados pueden comprometer la seguridad y deben detectarse mediante herramientas de administración.

---

### Ataques de DoS

Los ataques DoS en redes inalámbricas pueden afectar la disponibilidad del servicio de varias formas:

- **Configuración incorrecta:** Errores administrativos o cambios maliciosos pueden desactivar o afectar la WLAN.
- **Interferencia intencional:** Un atacante puede generar señales para bloquear o degradar la comunicación inalámbrica.
- **Interferencia accidental:** Dispositivos como microondas, teléfonos inalámbricos o monitores de bebé pueden causar problemas, especialmente en la banda de 2.4 GHz, que es más vulnerable que la de 5 GHz.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430175613.png]]

Para reducir el riesgo de ataques DoS en una WLAN se recomienda:

- Asegurar correctamente todos los dispositivos de red.
- Utilizar contraseñas fuertes y seguras.
- Realizar copias de seguridad de configuraciones.
- Aplicar cambios de configuración fuera del horario laboral para evitar interrupciones.
- Monitorear constantemente la red para detectar interferencias o fallos.
- Preferir la banda de 5 GHz en zonas con alta interferencia, ya que la banda de 2.4 GHz suele estar más congestionada por otros dispositivos.

---

### Puntos de acceso no autorizados

Un AP falso o no autorizado es un punto de acceso inalámbrico conectado a una red corporativa sin permiso, violando las políticas de seguridad de la empresa. Puede ser instalado por cualquier persona dentro de las instalaciones, ya sea de forma intencional o accidental, utilizando routers o dispositivos Wi-Fi de bajo costo.

Existes varios riesgos, teniendo como principales:

- Captura de direcciones MAC de dispositivos conectados.
- Intercepción de paquetes de datos.
- Acceso no autorizado a recursos internos de la red.
- Ejecución de ataques de intermediario (Man-in-the-Middle).

-  *Ejemplo:*

Un usuario autorizado puede convertir su computadora o dispositivo en un punto de acceso Wi-Fi personal, permitiendo que otros equipos externos se conecten indirectamente a la red corporativa y evadan controles de seguridad.

Formas para la prevención de esto serían:

- Configurar políticas de detección y bloqueo en el WLC (Wireless LAN Controller).
- Monitorear constantemente el espectro inalámbrico con herramientas especializadas.
- Detectar y eliminar dispositivos no autorizados rápidamente.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430180115.png]]

---

### Ataque man-in-the-middle

Un ataque MITM ocurre cuando un atacante se interpone entre dos usuarios para interceptar o alterar su comunicación. Un ejemplo común es el “AP gemelo malvado”, donde se crea un punto de acceso falso con el mismo nombre (SSID) que una red legítima para engañar a los usuarios, especialmente en lugares con Wi-Fi público como aeropuertos, cafeterías y restaurantes.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430180230.png]]

Los clientes inalámbricos pueden conectarse por error a un AP falso con el mismo SSID que la red legítima si este ofrece una señal más fuerte. Así, el atacante intercepta y reenvía todo el tráfico entre el usuario y la red real, permitiéndole robar contraseñas, información personal, acceder al dispositivo y comprometer el sistema.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430180306.png]]

Prevenir ataques MITM requiere una infraestructura WLAN segura, autenticación de usuarios y monitoreo constante de la red. Al identificar dispositivos legítimos, es posible detectar equipos o tráfico sospechoso y reducir riesgos de intrusión.

---

## WLAN seguras

### Encubrimiento SSID y filtrado de direcciones MAC

Las señales inalámbricas pueden atravesar techos, pisos y paredes, extendiéndose fuera del hogar o la oficina. Sin una seguridad adecuada, una WLAN puede exponer el acceso a la red incluso hacia el exterior.

Para enfrentar estas amenazas y proteger los datos, se utilizaron dos características de seguridad tempranas:

**Encubrimiento de SSID (SSID Cloaking):** Permite deshabilitar la transmisión de la trama de baliza SSID en los puntos de acceso o enrutadores inalámbricos. Al hacerlo, los clientes inalámbricos deben configurar manualmente el nombre de la red (SSID) para poder conectarse.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430180908.png]]

**Filtrado de direcciones MAC:** Un administrador puede permitir o denegar manualmente el acceso inalámbrico de los clientes en función de su direccion física de hardware MAC. En la figura, el router esta configurado para permitir dos direcciones MAC. Los dispositivos con diferentes direcciones MAC no podrán unirse a la WLAN de 2.4GHz.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430181037.png]]

---

### 802.11 Métodos de autenticación originales

El ocultamiento de SSID y el filtrado de direcciones MAC pueden disuadir a usuarios comunes, pero no son suficientes frente a intrusos más avanzados, ya que los SSID pueden descubrirse fácilmente y las direcciones MAC pueden falsificarse.

Por esta razón, la mejor protección para una red inalámbrica es el uso de autenticación y cifrado.

El estándar 802.11 original introdujo dos tipos de autenticación:

**1. Sistema de autenticación abierto:**  
Permite que cualquier cliente inalámbrico se conecte fácilmente. Se utiliza en lugares donde la seguridad no es una prioridad, como cafeterías, hoteles o zonas de acceso gratuito a Internet. En este caso, el usuario debe encargarse de su propia seguridad, por ejemplo mediante VPN.

**2. Autenticación de llave compartida:**  
Utiliza mecanismos como WEP, WPA, WPA2 y WPA3 para autenticar y cifrar la comunicación entre el cliente y el punto de acceso. Requiere que ambas partes compartan previamente una contraseña para conectarse.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430181213.png]]

---

### Métodos de autenticación de clave compartida

Actualmente hay cuatro técnicas de autenticación de clave compartida disponibles, como se muestra en la tabla. Hasta que la disponibilidad de dispositivos WPA3 se vuelva omnipresente, las redes inalámbricas deben usar el estandar WPA2.

| Método de autenticación | Descripción simplificada |
|---|---|
| WEP (Privacidad equivalente al cableado) | Usa cifrado RC4 con una clave fija que nunca cambia. Es muy fácil de hackear. Ya no se recomienda y nunca debe usarse. |
| WPA (Wi-Fi Protected Access) | Usa WEP pero con un cifrado mejorado llamado TKIP, que cambia la clave en cada paquete. Es mucho más difícil de hackear que WEP. |
| WPA2 | Estándar actual de seguridad inalámbrica. Usa cifrado AES, considerado el más fuerte hoy en día. |
| WPA3 | Última generación de seguridad Wi-Fi. Usa métodos modernos, no permite protocolos viejos y requiere protección de tramas de administración. Es más seguro, pero aún no está disponible en muchos dispositivos. |

---

### Autenticando a un usuario doméstico

Los routers domésticos suelen ofrecer dos métodos de autenticación: WPA y WPA2, siendo WPA2 el más seguro.

WPA2 puede configurarse de dos formas:

**1. Personal (PSK):**  
Diseñado para redes domésticas o pequeñas oficinas. Los usuarios se autentican mediante una clave precompartida (PSK), es decir, una contraseña compartida previamente entre el cliente y el router inalámbrico. No requiere un servidor de autenticación especial.

**2. Empresarial:**  
Pensado para redes empresariales. Requiere un servidor de autenticación RADIUS, lo que implica una configuración más compleja pero brinda mayor seguridad. Primero, el servidor autentica el dispositivo y luego los usuarios se autentican mediante el estándar 802.1X utilizando EAP.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430181621.png]]

---

### Métodos de encriptación

El cifrado se utiliza para proteger los datos inalámbricos, de modo que, aunque un intruso los capture, no pueda descifrarlos fácilmente.

Los estándares WPA y WPA2 utilizan estos métodos de cifrado:

**1. TKIP (Protocolo de Integridad de Clave Temporal):**  
Es el método de cifrado utilizado por WPA. Fue diseñado para mejorar las fallas del sistema WEP en equipos WLAN heredados. Usa WEP junto con TKIP para cifrar la carga útil de la Capa 2 y realiza una verificación de integridad de mensajes (MIC) para asegurar que los datos no hayan sido modificados.

**2. AES (Estándar de Cifrado Avanzado):**  
Es el método de cifrado utilizado por WPA2 y el más fuerte de los dos. Emplea CCMP para proporcionar mayor seguridad y permitir detectar alteraciones en los datos cifrados y no cifrados.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430181735.png]]

---

### Autenticación en la empresa

En redes con altos requerimientos de seguridad, se necesita autenticación adicional para permitir el acceso inalámbrico. Para esto, el modo empresarial utiliza un servidor RADIUS de autenticación, autorización y contabilidad (AAA).

La configuración incluye:

**1. Dirección IP del servidor RADIUS:**  
Es la dirección accesible del servidor.

**2. Puertos UDP:**  
Se utilizan normalmente los puertos 1812 para autenticación y 1813 para contabilidad, aunque también pueden usarse 1645 y 1646.

**3. Llave compartida:**  
Sirve para autenticar el punto de acceso (AP) con el servidor RADIUS.

![[Telemática II/Curso de Cisco II/Módulo 12/ANEXOS/Pasted image 20260430181851.png]]

La llave compartida solo se configura en el punto de acceso (AP) para autenticarlo con el servidor RADIUS, y no es necesaria en el cliente inalámbrico.

La autenticación y autorización de los usuarios finales se realiza mediante el estándar 802.1X, que proporciona autenticación centralizada basada en servidor.

El proceso de inicio de sesión 802.1X utiliza EAP para comunicarse entre el cliente, el AP y el servidor RADIUS. EAP funciona como un marco de autenticación para el acceso a la red, permitiendo una autenticación segura y la negociación de una clave privada que luego se utiliza para la sesión de cifrado inalámbrico mediante TKIP o AES.

---

### WPA3

WPA2 ya no se considera completamente seguro, por lo que WPA3 es el método de autenticación 802.11 recomendado cuando está disponible.

WPA3 incluye cuatro características principales:

**1. WPA3-Personal:**  
Protege contra ataques de fuerza bruta al reemplazar el intercambio tradicional por SAE (Autenticación Simultánea de Iguales), evitando que la clave precompartida (PSK) sea expuesta.

**2. WPA3-Empresa:**  
Utiliza autenticación 802.1X/EAP, requiere una suite criptográfica de 192 bits y proporciona mayor seguridad para redes empresariales.

**3. Redes abiertas:**  
Aunque no requieren autenticación, implementan cifrado inalámbrico oportunista (OWE) para proteger el tráfico de usuarios.

**4. Integración IoT:**  
Introduce el Protocolo de Aprovisionamiento de Dispositivos (DPP), que facilita la conexión segura de dispositivos sin interfaz gráfica mediante códigos QR, reemplazando gradualmente a WPS.

---