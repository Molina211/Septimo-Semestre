# Módulo 15: Rutas IP estáticas

---

## Contenido

- **Rutas estáticas:** Describe la sintaxis del comando para rutas estáticas.

- **Configuracion de rutas estáticas IP:** Configura las rutas estáticas IPv4 e IPv6.

- **Configuración de rutas estáticas predeterminadas IP:** Configura las rutas estáticas predeterminadas IPv4 e IPv6.

- **Configuracion de rutas estáticas flotantes:** Configura una ruta estática flotante para proporcionar una conexión de respaldo.

- **Configuracion de rutas de host estáticas:** Configura rutas de hosts estáticas IPv4 e IPv6 que dirijan el trafico hacia un host especifico.

---

## Rutas estáticas

### Tipos de rutas estáticas

Las rutas estáticas siguen siendo ampliamente utilizadas en redes, incluso cuando se emplean protocolos de enrutamiento dinámico. Por ejemplo, una organización puede configurar una ruta estática predeterminada hacia su proveedor de servicios y luego distribuirla internamente mediante un protocolo dinámico.

Tanto en IPv4 como en IPv6 se pueden configurar varios tipos de rutas estáticas:

- Ruta estática estándar.
- Ruta estática predeterminada.
- Ruta estática flotante.
- Ruta estática resumida.

La configuración se realiza mediante los comandos:

- `ip route` para IPv4.
- `ipv6 route` para IPv6.

---

### Opciones de siguiente salto

Al configurar una ruta estática, el siguiente salto puede definirse mediante una dirección IP, una interfaz de salida o ambas, lo que da lugar a tres tipos principales:

- **Ruta de siguiente salto:** Se especifica únicamente la dirección IP del siguiente salto.
- **Ruta estática conectada directamente:** Se indica solo la interfaz de salida del router.
- **Ruta estática totalmente especificada:** Incluye tanto la dirección IP del siguiente salto como la interfaz de salida.

---

### Comando de ruta estática IPv4

Las rutas estáticas IPv4 se configuran con el siguiente comando global:

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503003026.png]]

*Nota: Se deben configurar los parámetros `ip-address, exit-intf`, o `ip-address` y `exit-intf`.*

La tabla describe los `ip route` parámetros para el comando.

| Parámetro            | Descripción                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| network-address      | La dirección de red de destino a la que quieres llegar.                                                                                                                                |
| subnet-mask          | La máscara de subred de la red de destino. Puedes cambiarla para agrupar varias redes en una sola ruta resumida.                                                                       |
| ip-address           | La dirección IP del siguiente router (salto siguiente) al que enviar el paquete. Se usa en redes Ethernet. Puede requerir una búsqueda adicional para encontrar la interfaz de salida. |
| exit-intf            | La interfaz física del router por donde debe salir el paquete. Se usa típicamente en conexiones punto a punto.                                                                         |
| exit-intf ip-address | Define tanto la interfaz de salida como la dirección del siguiente salto. Es una ruta completamente especificada.                                                                      |
| distance             | Valor opcional (1 a 255) que asigna una prioridad a la ruta. Se usa para crear rutas estáticas flotantes (de respaldo) con prioridad menor que una ruta dinámica.                      |

---

### Comandos de ruta estática IPv6

Las rutas estáticas IPv6 se configuran con el siguiente comando global:

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503003444.png]]

La mayoría de los parámetros son idénticos a la versión IPv4 del comando.

La tabla muestra los distintos parámetros de *ipv6 route* comando y sus descripciones.

| Parámetro              | Descripción simplificada                                                                 |
|------------------------|------------------------------------------------------------------------------------------|
| ipv6-prefix            | La dirección de red IPv6 de destino a la que quieres llegar.                             |
| /prefix-length         | La longitud del prefijo (como /64) que indica qué parte de la dirección es la red.       |
| ipv6-address           | La dirección IPv6 del siguiente router (salto siguiente). Se usa en redes Ethernet. Puede requerir una búsqueda adicional para encontrar la interfaz de salida. |
| exit-intf              | La interfaz física del router por donde debe salir el paquete. Se usa en conexiones punto a punto. |
| exit-intf ipv6-address | Define tanto la interfaz de salida como la dirección del siguiente salto. Es una ruta completamente especificada. |
| distance               | Valor opcional (1 a 255) que asigna prioridad a la ruta. Se usa para rutas estáticas flotantes (de respaldo) con menor prioridad que una ruta dinámica. |

*Nota: El ipv6 unicast-routing comando de configuracion global debe configurarse para que habilite al router para que reenvié paquetes IPv6.*

---

### Topología Dual-Stack

En la figura, se ve una topología de red dual-stack. Actualmente, no hay rutas estáticas configuradas para IPv4 o IPv6.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503003927.png]]

---

### Iniciando tablas de enrutamiento IPv4

- *Tabla de routing IPv4 del R1*

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503004035.png]]

- *Tabla de routing IPv4 del R2*

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503004111.png]]

- *Tabla de routing IPv4 del R3*

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503004252.png]]

- *R1 puede hacerle ping a R2*

Ninguno de los routers tiene conocimiento de las redes que están fuera de las interfaces conectadas directamente. Esto significa que cada router solo puede llegar a redes conectadas directamente, como se demuestra en las siguientes pruebas de ping.

Un `ping` de R1 a la interfaz serial 0/1/0 de R2 debe tener éxito porque es una red conectada directamente.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503004359.png]]

- *R1 no puede hacer ping a LAN R3*

Sin embargo, un `ping` del R1 a la LAN del R3 debe fallar porque R1 no tiene una entrada en su tabla de routing para la red LAN del R3.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503004924.png]]

---

### Inicio de tablas de enrutamiento IPv6

- *Tabla de routing IPv6 del R1*

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005009.png]]

- *Tabla de routing IPv6 del R2*

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005033.png]]

- *Tabla de routing IPv6 del R3*

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005101.png]]

- *R1 puede hacerle ping a R2*

Ninguno de los routers tiene conocimiento de las redes que están fuera de las interfaces conectadas directamente.

Un `ping` de R1 a la interfaz serial 0/1/0 en R2 debería tener éxito.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005146.png]]

- *R1 no puede hacer ping a LAN R3*

Sin embargo, a `ping` a la LAN R3 no tiene éxito. Esto se debe a que el R1 no tiene una entrada en su tabla de routing para esa red.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005236.png]]

---

## Configuración de rutas estáticas IP

### Ruta estática IPv4 de siguiente salto

Los comandos para configurar rutas estáticas estándar en IPv4 e IPv6 son similares, aunque presentan ligeras diferencias según el protocolo utilizado.

En una ruta estática de siguiente salto:

- Solo se especifica la dirección IP del siguiente salto.
- La interfaz de salida se determina automáticamente a partir de esa dirección.

Este tipo de configuración permite que el router reenvíe paquetes hacia redes remotas utilizando como referencia la dirección del router vecino encargado de continuar el envío.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005549.png]]

Los comandos para configurar R1 con las rutas estáticas IPv4 a las tres redes remotas son los siguientes:

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005605.png]]

La tabla de enrutamiento para R1 ahora tiene rutas a las tres redes IPv4 remotas.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503005625.png]]

---

### Rutas estáticas IPv6 de siguiente salto

Los comandos para configurar R1 con las rutas estáticas IPv6 a las tres redes remotas son los siguientes:

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011027.png]]

La tabla de enrutamiento para R1 ahora tiene rutas a las tres redes IPv6 remotas.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011046.png]]

---

### Ruta Estática IPv4 Conectada Directamente

Al configurar una ruta estática, otra opción es utilizar la interfaz de salida para especificar la direccion del siguiente salto. La figura muestra de nuevo la topología.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011131.png]]

Se configuran tres rutas estáticas conectadas directamente en el R1 mediante la interfaz de salida.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011146.png]]

La tabla de routing de R1 indica que, cuando un paquete tiene como destino la red 192.168.2.0/24, el router encuentra la ruta correspondiente y lo reenvía a través de su interfaz Serial 0/0/0.

Por lo general, se recomienda configurar rutas utilizando la dirección del siguiente salto. Las rutas estáticas conectadas directamente se aconsejan principalmente en interfaces seriales punto a punto.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011239.png]]

---

### Ruta Estática IPv6 Conectada Directamente

En el ejemplo, se configuran tres rutas estáticas conectadas directamente en el R1 mediante la interfaz de salida.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011318.png]]

La tabla de routing IPv6 de R1 muestra que, cuando un paquete tiene como destino la red 2001:db8:cafe:2::/64, el router identifica la ruta adecuada y lo reenvía mediante la interfaz Serial 0/0/0.

Se recomienda normalmente utilizar rutas configuradas con dirección de siguiente salto. Las rutas estáticas conectadas directamente deben usarse principalmente en interfaces seriales punto a punto.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011356.png]]

---

### Ruta estática completamente especificada IPv4

Una ruta estática completamente especificada incluye tanto la interfaz de salida como la dirección IP del siguiente salto.

Este tipo de ruta se utiliza principalmente cuando:

- La interfaz de salida es de acceso múltiple, como Ethernet.
- Es necesario identificar explícitamente el siguiente router.
- El siguiente salto está conectado directamente a la interfaz especificada.

Aunque la interfaz de salida puede ser opcional, la dirección del siguiente salto es indispensable para garantizar un enrutamiento preciso.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011444.png]]

A diferencia de una red serial punto a punto, donde solo existe un dispositivo en el otro extremo del enlace, una red Ethernet de acceso múltiple puede tener varios dispositivos compartiendo la misma red, como hosts y múltiples routers.

Por ello, en redes Ethernet se recomienda:

- Utilizar rutas estáticas con dirección de siguiente salto.
- O emplear rutas estáticas completamente especificadas, incluyendo interfaz de salida y siguiente salto.

Esto mejora la precisión en la entrega de paquetes dentro de redes con múltiples dispositivos.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011515.png]]

Al reenviar paquetes al R2, la interfaz de salida es GigabitEthernet 0/0/1 y la dirección IPv4 del siguiente salto es 172.16.2.2. como se muestra en el `show ip route` resultado de R1.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011535.png]]

---

### Ruta estática completamente especificada IPv6

En una ruta estática IPv6 completamente especificada se configuran tanto la interfaz de salida como la dirección IPv6 del siguiente salto.

Este tipo de ruta es obligatorio cuando:

- Se utiliza una dirección IPv6 link-local como siguiente salto.

Debido a que las direcciones link-local solo son válidas en un enlace específico, es necesario indicar también la interfaz de salida para asegurar que el paquete sea enviado correctamente.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011620.png]]

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011629.png]]

Cuando una ruta estática IPv6 utiliza la dirección link-local del siguiente salto, es necesario configurarla como una ruta completamente especificada, incluyendo obligatoriamente la interfaz de salida.

Esto se debe a que:

- Las direcciones IPv6 link-local no aparecen en la tabla de routing.
- Solo son únicas dentro de un enlace o red local.
- La misma dirección link-local podría existir en múltiples interfaces.

Por esta razón, especificar la interfaz garantiza que el router pueda identificar correctamente por dónde enviar los paquetes. La tabla de routing reflejará tanto la dirección link-local del siguiente salto como la interfaz de salida correspondiente.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011700.png]]

---

### Verificación de una ruta estática

Junto con `show ip route`, `show ipv6 route`, `ping` y `traceroute`, otros comandos útiles para verificar las rutas estáticas son los siguientes:

- `show ip route static`
- `show ip route {network}`
- `show running-config | section ip route`

Reemplace `ip` con `ipv6` para las versiones IPv6 del comando.

Haga referencia a la figura al revisar los ejemplos de comandos.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503011850.png]]

- *Mostrar sólo rutas estáticas IPv4*

Esta salida muestra solo las rutas estáticas IPv4 en la tabla de enrutamiento. También tenga en cuenta donde el filtro comienza la salida, excluyendo todos los códigos.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503103731.png]]

- *Mostrar una red IPv4 específica*

Este comando mostrara la salida solo para la red especificada en la tabla de enrutamiento.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503103810.png]]

- *Mostrar la configuración de la ruta estática IPv4*

Este comando filtra la configuración en ejecución sólo para rutas estáticas IPv4.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503103851.png]]

- *Mostrar sólo rutas estáticas IPv6*

Este resultado muestra sólo las rutas estáticas IPv6 en la tabla de enrutamiento. También tenga en cuenta dónde el filtro comienza la salida, excluyendo todos los códigos.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503103936.png]]

- *Mostrar una red IPv6 específica*

Este comando mostrará la salida de la red especificada en la tabla de routing únicamente.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104005.png]]

- *Mostrar la configuración de la ruta estática IPv6*

Este comando filtra la configuración en ejecución sólo para rutas estáticas IPv6.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104043.png]]

---

## Configuración de rutas estáticas predeterminadas IP

### Ruta estática por defecto

Una ruta predeterminada es una ruta estática que coincide con todos los paquetes cuyo destino no aparece específicamente en la tabla de routing.

Su función principal es:

- Servir como gateway de último recurso.
- Reducir la necesidad de almacenar rutas hacia todas las redes posibles, como Internet.
- Simplificar la administración del enrutamiento.

Características principales:

- Puede configurarse localmente o aprenderse mediante protocolos de routing dinámico.
- Se utiliza solo cuando no existe una ruta más específica para el destino.
- No requiere coincidencia de bits específica con la dirección destino.

Es comúnmente utilizada en:

- Routers perimetrales conectados a proveedores de servicios.
- Routers stub, que tienen una sola conexión ascendente hacia otra red.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104335.png]]

La ruta estática predeterminada para IPv4 utiliza la red 0.0.0.0 con máscara 0.0.0.0, lo que permite que coincida con cualquier dirección de destino no encontrada en la tabla de routing. Por esta razón, se conoce como ruta de “cuádruple cero”.

**Sintaxis IPv4:**

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104517.png]]

En IPv6, la ruta predeterminada utiliza el prefijo `::/0`, que también coincide con cualquier red de destino.

**Sintaxis IPv6:**

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104535.png]]

Ambas se utilizan para definir una ruta de último recurso hacia redes desconocidas.

---

### Configuración de una ruta estática predeterminada

En la figura, R1 puede configurarse con tres rutas estáticas para alcanzar todas las redes remotas en la topología de ejemplo. Sin embargo, el R1 es un router de rutas internas, ya que está conectado únicamente al R2. Por lo tanto, sería más eficaz configurar una sola ruta estática predeterminada.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104609.png]]

El ejemplo muestra una ruta estática predeterminada IPv4 configurada en R1. Con la configuración del ejemplo, cualquier paquete que no coincida con entradas más específicas de la ruta se reenvía a 172.16.2.2.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104624.png]]

Una ruta estática predeterminada IPv6 se configura de manera similar. Con esta configuración, cualquier paquete que no coincida con entradas más específicas de la ruta IPv6 se reenvía a R2 al 2001:db8:acad:2::2

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104635.png]]

---

### Verificar una ruta estática predeterminada

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104713.png]]

- **Verificar Ruta estática predeterminada IPv4**

La verificación de una ruta estática predeterminada IPv4 se realiza con el comando `show ip route static`, que muestra las rutas estáticas presentes en la tabla de routing.

Aspectos importantes:

- La ruta aparece con el código S (Static).
- Un asterisco (*) junto a la ruta indica que es una ruta predeterminada candidata.
- Esta ruta es seleccionada como gateway de último recurso cuando no existe una ruta más específica hacia el destino.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104906.png]]

**Verificar Ruta estática predeterminada IPv6**

El comando `show ipv6 route static` permite verificar las rutas estáticas configuradas en la tabla de routing IPv6.

Puntos clave:

- IPv4 utiliza la máscara 0.0.0.0/0 para rutas predeterminadas.
- IPv6 utiliza el prefijo ::/0.
- El prefijo /0 indica que no se requiere coincidencia de bits con la dirección destino.
- Esto permite que la ruta predeterminada coincida con cualquier paquete cuando no existe una ruta más específica.

Por ello, la ruta predeterminada actúa como gateway de último recurso tanto en IPv4 como en IPv6.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503104916.png]]

---

## Configuración de rutas estáticas flotantes

### Rutas estáticas flotantes

Las rutas estáticas flotantes son rutas de respaldo utilizadas cuando falla una ruta principal estática o dinámica. Se configuran con una distancia administrativa mayor para que solo se activen cuando la ruta principal deja de estar disponible.

La distancia administrativa determina la confiabilidad de una ruta, por lo que el router siempre selecciona la de menor valor. Por ejemplo, como EIGRP tiene una distancia administrativa de 90, una ruta estática flotante puede configurarse con 91 o más para funcionar como alternativa automática si la ruta EIGRP falla.

Este mecanismo garantiza redundancia, continuidad y mayor disponibilidad en la red ante caídas de enlaces principales.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105111.png]]

Por defecto, las rutas estáticas tienen una distancia administrativa de 1, por lo que suelen ser preferidas sobre rutas aprendidas mediante protocolos dinámicos como:

- EIGRP (90)
- OSPF (110)
- IS-IS (115).

Al aumentar su distancia administrativa, una ruta estática se convierte en una ruta estática flotante, funcionando como respaldo. Así, permanece inactiva mientras exista una ruta principal más confiable, pero toma el control automáticamente si esa ruta falla.

---

### Configure las Rutas Estáticas Flotantes IPv4 y IPv6

Las rutas estáticas flotantes para IPv4 e IPv6 se configuran agregando el argumento `distance`, que permite establecer una distancia administrativa mayor que la ruta principal.

- Si no se especifica, la distancia predeterminada es 1.
- Una distancia mayor hace que la ruta sea menos preferida.
- La ruta principal se utiliza normalmente.
- La ruta flotante solo se activa como respaldo si la ruta principal falla.

En este escenario, R1 utiliza preferentemente la ruta hacia R2, mientras que la conexión hacia R3 queda reservada como alternativa de respaldo.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105324.png]]

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105333.png]]

R1 está configurado con rutas estáticas predeterminadas principales hacia R2 con distancia administrativa predeterminada de 1, por lo que estas son las rutas preferidas.

Además:

- Se configuran rutas estáticas flotantes de respaldo hacia R3.
- Estas utilizan una distancia administrativa mayor (por ejemplo, 5).
- Debido a su mayor distancia, no aparecen en la tabla de routing mientras la ruta principal esté activa.

Los comandos `show ip route` y `show ipv6 route` permiten verificar que solo la ruta principal hacia R2 está instalada, mientras que la ruta flotante permanece en espera hasta que ocurra una falla.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105444.png]]

Utilice el comando show run para comprobar que las rutas estáticas flotantes están en la configuración. Por ejemplo, el siguiente comando verifica que ambas rutas estáticas predeterminadas IPv6 estén en la configuración en ejecución.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105511.png]]

---

### Pruebe la ruta estática flotante

En la imagen, ¿Qué ocurriría si el R2 falla?

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105933.png]]

Para simular esta falla, se desactivan ambas interfaces seriales del R2, como se muestra en la configuración.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105942.png]]

Observe que R1 genera mensajes automáticamente indicando que la interfaz serial a R2 está caída.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503105954.png]]

Una mirada a las tablas de enrutamiento IP de R1 verifica que las rutas estáticas flotantes predeterminadas están ahora instaladas como rutas predeterminadas y apuntan a R3 como enrutador de salto siguiente.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110012.png]]

---

## Configuración de rutas de host estáticas

### Rutas del host

Una ruta de host identifica una única dirección específica en la red, utilizando:

- IPv4 con máscara /32.
- IPv6 con máscara /128.

Formas de agregar una ruta de host a la tabla de routing:

- Se instala automáticamente al configurar una dirección IP en una interfaz del router.
- Puede configurarse manualmente como ruta estática de host.
- Puede obtenerse automáticamente mediante otros métodos de routing.

Las rutas de host se utilizan cuando se requiere un enrutamiento preciso hacia un dispositivo individual.

---

### Rutas de host instaladas automáticamente

Cuando se configura una dirección IP en una interfaz activa del router, Cisco IOS instala automáticamente una ruta de host local en la tabla de routing.

Características:

- Se conoce como ruta local o de host.
- Permite procesar de forma más eficiente los paquetes dirigidos al propio router.
- Se agrega además de la ruta conectada de la red.

Identificación en la tabla de routing:

- **C** = Red conectada.
- **L** = Ruta local del host.

Esto optimiza el manejo del tráfico destinado directamente a las interfaces del router.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110320.png]]

Las direcciones IP asignadas a la interfaz Branch Serial0/1/0 son 198.51.100.1/30 y 2001:db8:acad:1::1/64. Las rutas locales para la interfaz son instaladas por el IOS en la tabla de routing del IPv4 e IPv6, como se muestra en el ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110331.png]]

---

### Ruta estática de host

Una ruta de host también puede configurarse manualmente como ruta estática para dirigir tráfico hacia un dispositivo específico, como un servidor.

Configuración:

- IPv4: utiliza máscara 255.255.255.255 (/32).
- IPv6: utiliza prefijo /128.

Este tipo de ruta permite un enrutamiento preciso hacia un único destino dentro de la red.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110437.png]]

---

### Configuración de rutas de host estáticas

El ejemplo muestra la configuración de la ruta de host estática IPv4 e IPv6 en el router Branch para acceder al servidor.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110502.png]]

---

### Verificar rutas de host estáticas

Una revisión de las tablas de rutas IPv4 e IPv6 verifica que las rutas estén activas.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110539.png]]

---

### Configurar rutas de host estáticas IPV6 con Link-Local de siguiente salto

En rutas estáticas IPv6, es posible utilizar la dirección link-local del router adyacente como siguiente salto.

Requisito importante:

- Debe especificarse también la interfaz de salida (tipo y número de interfaz).

Esto se debe a que las direcciones link-local solo son válidas dentro del enlace local, por lo que el router necesita identificar exactamente por qué interfaz enviar el tráfico.

En estos casos, se configura una ruta estática completamente especificada para garantizar una entrega correcta hacia el destino.

![[Telemática II/Curso de Cisco II/Módulo 15/ANEXOS/Pasted image 20260503110648.png]]

---