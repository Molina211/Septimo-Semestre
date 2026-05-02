# Módulo 11: Configuraciones de seguridad del switch

---

## Contenido

- **Implementación de Seguridad de Puertos:** Implementa la seguridad de puertos para mitigar los ataques de tablas de direcciones MAC.

- **Mitigación de ataques de VLAN:** Explica como configurar DTP y la VLAN nativa para mitigar los ataques de VLAN.

- **Mitigación de ataques de DHCP:** Explica como configurar el snooping de DHCP para mitigar los ataques de DHCP.

- **Mitigación de ataques de ARP:** Explica cómo configurar ARP para mitigar los ataques de ARP.

- **Mitigación de ataques de STP:** Explica como configurar Portfast y BPDU Guard para mitigar los ataques de STP.

---

## Implementación de Seguridad de Puertos

Los switches de Capa 2 suelen ser uno de los puntos más vulnerables de la seguridad de red, ya que los ataques en esta capa son fáciles de ejecutar si no existen medidas preventivas.

Para mejorar la seguridad, se recomienda proteger todos los puertos antes de poner el switch en producción, especialmente deshabilitando aquellos que no estén en uso. Esto evita accesos no autorizados mediante conexiones físicas.

- Identificar los puertos no utilizados.
- Ingresar a esos puertos y aplicar `shutdown`.
- Si se necesitan después, reactivarlos con `no shutdown`.
- Para configurar varios puertos al mismo tiempo, utilizar `interface range`.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428173415.png]]

Por ejemplo, para apagar los puertos for Fa0/8 hasta Fa0/24 en S1, usted debe ingresar el siguiente comando.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428173440.png]]

---

### Mitigación de ataques por saturación de tabla de direcciones MAC

La forma más sencilla y efectiva de prevenir ataques por saturación de direcciones MAC es usar Port Security en los switches.

Esta función restringe cuántas direcciones MAC pueden conectarse a un puerto, permitiendo configurarlas manualmente o aprenderlas automáticamente. Cuando llega una trama, el switch verifica si la MAC de origen está autorizada.

Si se limita a una sola dirección MAC por puerto, se evita la conexión de dispositivos no autorizados, como switches externos o usuarios indebidos, mejorando la seguridad y protegiendo la tabla MAC del switch.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428174813.png]]

---

### Habilitar la seguridad del puerto

Port Security solo puede habilitarse en puertos de acceso o en puertos troncales configurados manualmente.

Por defecto, muchos puertos de switch están en modo dynamic auto, por lo que el comando `switchport port-security` será rechazado hasta que el puerto se configure correctamente.

Para solucionarlo, primero se debe establecer el puerto como acceso usando `switchport mode access` y luego activar Port Security. Esto asegura que el puerto pueda aplicar restricciones de direcciones MAC y proteger la red contra accesos no autorizados.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428174932.png]]

El comando `show port-security interface` muestra el estado de Port Security en un puerto, incluyendo si está habilitado, el modo de violación y el límite de direcciones MAC permitidas.

Si se conecta un dispositivo, su dirección MAC se aprende automáticamente como segura; si no hay ninguno conectado, no se registrará ninguna MAC.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175023.png]]

Si Port Security está habilitado en un puerto activo y se conectan más dispositivos de los permitidos, el puerto puede pasar al estado error-disabled como medida de protección.

Después de activar Port Security, es posible configurar funciones adicionales, como el número máximo de direcciones MAC, direcciones seguras específicas y acciones ante violaciones.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175104.png]]

---

### Limitar y aprender MAC Addresses

Para poner el numero máximo de direcciones MAC permitidas en un puerto, utilice el siguiente comando:

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175137.png]]

El valor predeterminado de port security es 1. EL numero máximo de direcciones MAC seguras que se puede configurar depende del switch y el IOS. En este ejemplo, el máximo es 8192.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175159.png]]

El switch se puede configurar para aprender direcciones MAC en un puerto seguro de tres maneras:

1. *Configurado Manualmente*

El administrador configura manualmente una(s) dirección MAC estática usando el siguiente comando para cada dirección MAC en el puerto:

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175243.png]]

2. *Aprendido automáticamente*

Al habilitar `switchport port-security`, la dirección MAC del dispositivo conectado se aprende automáticamente como segura, pero no se guarda en la configuración de inicio.

Si el switch se reinicia, el puerto deberá aprender nuevamente esa dirección MAC.

3. *Aprendido automáticamente – Sticky*

El administrador puede configurar al switch para que aprenda la direccion MAC automáticamente a la "pegue" a la configuración en ejecución usando el siguiente comando:

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175453.png]]

Si se guarda la configuración en ejecución, las direcciones MAC aprendidas automáticamente se almacenan en la NVRAM.

En una configuración completa de Port Security, el administrador puede definir un máximo de direcciones MAC permitidas, establecer direcciones seguras manualmente y permitir el aprendizaje automático de direcciones adicionales hasta el límite configurado.

Los comandos `show port-security interface` y `show port-security address` permiten verificar esta configuración.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175536.png]]

El comando `show port-security interface` confirma que Port Security está activo, que el puerto está conectado de forma segura y que se permiten dos direcciones MAC. Además, muestra que una MAC fue configurada manualmente y otra aprendida dinámicamente.

El comando `show port-security address` muestra las direcciones MAC seguras registradas en el puerto.

---

### Vencimiento de la seguridad del puerto

El envejecimiento de Port Security permite eliminar automáticamente direcciones MAC seguras después de cierto tiempo.

Puede configurarse de dos formas:

- **Absoluto:** elimina la dirección MAC al cumplirse el tiempo establecido.
- **Inactivo:** elimina la dirección solo si permanece sin uso durante el tiempo definido.

Esta función facilita la administración de direcciones MAC sin necesidad de borrarlas manualmente. El comando `switchport port-security aging` se utiliza para configurar el tipo y tiempo de envejecimiento.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175748.png]]

Los parámetros para el comando se describen en la tabla.

| Parámetro       | Descripción simplificada                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| static          | Activa la caducidad para las direcciones MAC seguras que se configuraron manualmente.                      |
| time *time*     | Define el tiempo de caducidad (0 a 1440 minutos). Si es 0, la caducidad está desactivada.                  |
| type absolute   | Las direcciones seguras caducan exactamente después del tiempo indicado (en minutos).                      |
| type inactivity | Las direcciones seguras caducan solo si no hay tráfico desde esa dirección durante el tiempo especificado. |

*Note: Las direcciones MAC se están mostrando con 24 bits para efectos de hacerlo sencillo.*

El ejemplo muestra a un administrador configurando el tipo de envejecimiento a 10 minutos de inactividad y utilizando el comando `show port-security interface` para verificar la configuración.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428175950.png]]

---

### Seguridad de puertos - Modos de violación de seguridad

Si la dirección MAC de un dispositivo conectado al puerto difiere de la lista de direcciones seguras, entonces ocurre una violación de puerto. El puerto entra en el estado de error-disabled de manera predeterminada.

Para poner el modo de violación de seguridad de puerto, use el siguiente comando:

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428181446.png]]


**Descripciones de los modos de violación de seguridad**

| Modo de violación | Descripción simplificada                                                                                     |
|-------------------|--------------------------------------------------------------------------------------------------------------|
| shutdown (predeterminado) | El puerto se bloquea (error-disabled) de inmediato. Se necesita que un administrador lo reactive manualmente con los comandos "shutdown" y "no shutdown". |
| restrict          | Los paquetes con MAC desconocida se descartan. Se registra la violación con un mensaje syslog y aumenta el contador. |
| protect           | Es el modo menos seguro. Los paquetes con MAC desconocida se descartan en silencio, sin enviar ningún mensaje de registro (syslog). |

**Comparación de modos de violación de seguridad**

| Modo de violación  | Descarta tráfico ofensivo | Envía mensaje syslog | Incrementa contador de violaciones | Desactiva el puerto |
| ------------------ | ------------------------- | -------------------- | ---------------------------------- | ------------------- |
| Protect            | Sí                        | No                   | No                                 | No                  |
| Restrict           | Sí                        | Sí                   | Sí                                 | No                  |
| Shutdown (Apagado) | Sí                        | Sí                   | Sí                                 | Sí                  |

El siguiente ejemplo muestra un administrador cambiando la violación de seguridad a ''restringir''. La salida del `show port-security interface` comando confirma que se ha realizado el cambio.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428181824.png]]

---

### Puertos en Estado error-disabled

Cuando un puerto esta apagado y puesto en modo error-desabilitado, no se envía ni se recibe tráfico a través de ese puerto. En la consola, se muestra una serie de mensajes relacionados con la seguridad del puerto.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428181901.png]]

Cuando ocurre una violación de seguridad, el puerto se desactiva (down), el LED se apaga y entra en estado err-disabled.

El comando `show port-security interface` muestra el estado secure-shutdown y el contador de violaciones aumenta.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428182014.png]]

Antes de reactivar un puerto bloqueado por Port Security, el administrador debe identificar y eliminar la causa de la violación, como un dispositivo no autorizado.

Para habilitar nuevamente el puerto, se utilizan los comandos `shutdown` y luego `no shutdown`.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428182110.png]]

---

### Verificar la seguridad del puerto

Después de configurar Port Security, es necesario verificar que todas las interfaces estén correctamente protegidas.

- *Seguridad de puertos para todas las interfaces*

El comando `show port-security` permite revisar la configuración general del switch, mostrando el límite de direcciones MAC, el modo de violación y las direcciones activas en cada puerto.

Si no hay dispositivos conectados, el contador de direcciones actuales será cero.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428182233.png]]

- *Seguridad de puertos para una Interfaz Específica*

Use el `show port-security interface` comando para ver los detalles de una interfaz específica, como se muestra anteriormente y en este ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428182258.png]]

- *Verificar las direcciones MAC aprendidas*

Para verificar que las direcciones MAC están "pegadas" a la configuración, use el **show run** comando como se muestra en el ejemplo de FastEthernet 0/19.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428190516.png]]

- *Verificar las Direcciones MAC Seguras*

Para mostrar todas las direcciones MAC seguras que se configuran manualmente o se aprenden dinámicamente en todas las interfaces de conmutador, use el comando `show port-security address` como se muestra en el ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428190722.png]]

---

## Mitigación de ataques de VLAN

### Revisión de ataques a VLAN

Como repaso, un ataque de salto de VLAN puede realizarse de tres formas principales:

- Suplantando mensajes DTP para que el switch habilite un enlace troncal con el atacante.
- Conectando un switch no autorizado con enlaces troncales activos para acceder a múltiples VLAN.
- Mediante ataque de doble etiquetado, aprovechando el procesamiento de tramas VLAN en los switches.

---

### Pasos para mitigar ataques de salto

Para mitigar ataques de salto de VLAN:

**Paso 1:** Deshabilite las negociaciones de DTP (enlace automático) en puertos que no sean enlaces mediante el `switchport mode access` comando de configuración de la interfaz.

**Paso 2:** Deshabilite los puertos no utilizados y colóquelos en una VLAN no utilizada.

**Paso 3:** Active manualmente el enlace troncal en un puerto de enlace troncal utilizando el `switchport mode trunk` comando.

**Paso 4:** Deshabilite las negociaciones de DTP (enlace automático) en los puertos de enlace mediante el comando `switchport nonegotiate`.

**Paso 5:** Establezca la VLAN nativa en otra VLAN que no sea la VLAN 1 mediante el comando `switchport trunk native vlan {vlan-number}`.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428193933.png]]

- **Fa0/1–Fa0/16:** Configurados como puertos de acceso para evitar enlaces troncales no autorizados.
- **Fa0/17–Fa0/20:** Deshabilitados y asignados a una VLAN no utilizada para mayor seguridad.
- **Fa0/21–Fa0/24:** Configurados manualmente como enlaces troncales, con DTP deshabilitado.
- **VLAN nativa:** Cambiada de VLAN 1 a VLAN 999 para reducir riesgos de salto de VLAN.

---

## Mitigación de ataques de DHCP

### Revisión de ataques DHCP

El ataque de inanición DHCP busca provocar una denegación de servicio agotando las direcciones disponibles del servidor DHCP mediante múltiples solicitudes falsas. Puede mitigarse con seguridad de puertos, limitando direcciones MAC por interfaz.

Sin embargo, los ataques de suplantación DHCP requieren mayor protección, ya que pueden usar direcciones MAC legítimas para evadir esta medida. Para prevenirlos, se utiliza DHCP Snooping en puertos confiables, permitiendo únicamente respuestas DHCP autorizadas.

---

### Indagación de DHCP

DHCP Snooping clasifica los puertos como confiables o no confiables para filtrar mensajes DHCP.

- **Puertos confiables:** Conectados a servidores DHCP, switches o routers administrados.
- **Puertos no confiables:** Generalmente puertos de acceso y dispositivos externos a la red.

Esta técnica bloquea respuestas DHCP no autorizadas y limita la tasa de tráfico DHCP desde fuentes no confiables, previniendo ataques de suplantación.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428195607.png]]

Con DHCP Snooping, todos los puertos son no confiables por defecto.

- **Puertos confiables:** Se configuran manualmente, normalmente en enlaces troncales o conexiones directas a servidores DHCP legítimos.
- **Puertos no confiables:** Bloquean servidores DHCP no autorizados.

Además, DHCP Snooping genera una tabla de enlaces que asocia direcciones MAC con direcciones IP asignadas, permitiendo validar dispositivos y reforzar la seguridad de la red.

---

### Pasos para implementar DHCP Snooping

Utilice las siguientes pasos para habilitar DHCP snooping

**Paso 1:** Habilite la inspección DHCP mediante el comando `ip dhcp snooping` de configuración global.

**Paso 2:** En puertos de confianza, use el comando de configuración de la interfaz `ip dhcp snooping trust`.

**Paso 3:** Limite la cantidad de mensajes de descubrimiento de DHCP que puede recibir por segundo en puertos no confiables mediante el `ip dhcp snooping limit rate` comando de configuración de la interfaz.

**Paso 4:** Habilite la inspección DHCP por VLAN, o por un rango de VLAN, utilizando el comando `ip dhcp snooping {vlan}` de la configuración global.

---

### Un ejemplo de configuración de detección de DHCP.

La topología de referencia para este ejemplo de DHCP snooping es mostrado en la figura. Note que F0/5 es un puerto no confiable porque este conecta con una computadora. F0/1 es un puerto confiable porque conecta con el servidor DHCP.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428200416.png]]

Para configurar DHCP Snooping en S1:

- Active DHCP Snooping globalmente en el switch.
- Configure como confiable la interfaz conectada al servidor DHCP legítimo.
- Mantenga los puertos de acceso (Fa0/5–Fa0/24) como no confiables y limite su tasa a 6 paquetes por segundo.
- Habilite DHCP Snooping en las VLAN 5, 10, 50, 51 y 52.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428202259.png]]

Verifique DHCP Snooping con:

- `show ip dhcp snooping` para comprobar el estado de la configuración.
- `show ip dhcp snooping binding` para visualizar la tabla de enlaces DHCP con clientes autorizados.

Esta función también es necesaria para implementar Inspección Dinámica ARP (DAI).

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428202328.png]]

---

## Mitigación de ataques de ARP

### Inspección dinámica de ARP

La inspección dinámica ARP (DAI), respaldada por DHCP snooping, protege la red contra suplantación y envenenamiento ARP al validar el tráfico ARP en puertos no confiables. Sus funciones principales incluyen:

- Bloquear respuestas ARP inválidas o gratuitas dentro de la VLAN.
- Interceptar todas las solicitudes y respuestas ARP sospechosas.
- Verificar la correspondencia legítima entre direcciones IP y MAC.
- Descartar y registrar paquetes ARP no válidos.
- Deshabilitar automáticamente interfaces con exceso de tráfico ARP malicioso.

---

### Pautas de implementación DAI

Para reducir el riesgo de ataques como ARP Spoofing y ARP Poisoning, se implementa DAI (Dynamic ARP Inspection) siguiendo estos pasos:

1. **Activar DHCP Snooping**
    - Permite al switch identificar qué dispositivos obtuvieron direcciones IP válidas mediante DHCP.
2. **Habilitar DHCP Snooping en VLANs específicas**
    - Solo se aplica en las VLAN donde se desea proteger la red.
3. **Activar DAI en esas mismas VLANs**
    - DAI valida los paquetes ARP comparándolos con la tabla creada por DHCP Snooping.
4. **Configurar puertos confiables (trusted)**
    - Se asignan como confiables los enlaces hacia otros switches o hacia el servidor DHCP.
5. **Mantener puertos de acceso como no confiables**
    - Los puertos donde se conectan usuarios finales permanecen no confiables por seguridad.

Esto evita que dispositivos maliciosos envíen respuestas ARP falsas y protege la red contra suplantación de identidad y redirección de tráfico.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428204356.png]]

---

### Ejemplo de configuración DAI

En esta topología, el switch S1 conecta a dos usuarios dentro de la VLAN 10, y se configura DAI (Dynamic ARP Inspection) para proteger la red contra ataques de ARP Spoofing y ARP Poisoning.

*Proceso de configuración:*

1. **Se habilita DHCP Snooping**
    - Es necesario porque DAI utiliza la tabla de enlaces IP-MAC generada por DHCP Snooping para validar paquetes ARP.
2. **Se activa DHCP Snooping y DAI en la VLAN 10**
    - Esto protege específicamente a los dispositivos de esa VLAN.
3. **Puertos de usuarios (PCs)**
    - Se mantienen como no confiables, permitiendo inspeccionar sus mensajes ARP.
4. **Puerto de enlace ascendente hacia el router**
    - Se configura como confiable, ya que conecta con infraestructura legítima de red.

Con esto el switch verifica que las respuestas ARP coincidan con la información válida de DHCP Snooping, bloqueando paquetes falsificados y evitando ataques de suplantación ARP.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428204523.png]]

DAI (Dynamic ARP Inspection) puede validar diferentes campos de los paquetes ARP para detectar intentos de falsificación:

- **MAC de origen:** verifica que la dirección MAC de origen en el encabezado Ethernet coincida con la MAC del remitente en el paquete ARP.
- **MAC de destino:** verifica que la dirección MAC de destino en el encabezado Ethernet coincida con la MAC de destino dentro del mensaje ARP.
- **IP:** revisa si existen direcciones IP inválidas o sospechosas, como 0.0.0.0, 255.255.255.255 o direcciones multicast.

El comando utilizado es:

`ip arp inspection validate src-mac dst-mac ip`

Es importante configurar todas las validaciones necesarias en una sola línea, ya que si se ingresan comandos separados, el último sobrescribe al anterior.

Con esta configuración, el switch puede descartar paquetes ARP alterados o inconsistentes, mejorando la protección frente a ataques de ARP spoofing y ARP poisoning.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428205336.png]]

---

## Mitigación de ataques de STP

### PortFast y protección BPDU

Para prevenir ataques de manipulación del protocolo STP, donde un atacante intenta convertirse en puente raíz falso y alterar la topología de la red, se recomienda implementar PortFast y BPDU Guard.

- **PortFast:** permite que los puertos de acceso conectados a dispositivos finales pasen directamente al estado de reenvío, evitando los estados de escucha y aprendizaje. Esto mejora el tiempo de conexión y reduce riesgos en puertos de usuario.
- **BPDU Guard:** deshabilita automáticamente un puerto si recibe una BPDU inesperada, evitando que dispositivos no autorizados participen en STP.

Estas configuraciones deben aplicarse únicamente en puertos de acceso conectados a usuarios finales, no en enlaces entre switches.

En el caso de S1, todos los puertos de acceso para usuarios deben configurarse con PortFast y BPDU Guard para fortalecer la seguridad de la red.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428205506.png]]

---

### Configure PortFast

PortFast reduce el tiempo de activación de los puertos de acceso al omitir los estados de escucha y aprendizaje de STP, permitiendo que entren rápidamente en estado de reenvío.

Debe usarse solo en puertos conectados a dispositivos finales, ya que habilitarlo en enlaces hacia otros switches puede generar bucles en la red.

Configuración:

- En una interfaz específica:  
    `spanning-tree portfast`
- Globalmente en todos los puertos de acceso:  
    `spanning-tree portfast default`

Verificación:

- Configuración global:  
    `show running-config | begin spanning-tree`  
    `show spanning-tree summary`
- Configuración por interfaz:  
    `show running-config interface type/number`  
    `show spanning-tree interface type/number detail`

Cuando PortFast está habilitado, el switch muestra advertencias para recordar que esta función solo debe aplicarse en puertos de acceso seguros.

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428205608.png]]

---

### Configurar la protección BPDU

Aunque PortFast esté habilitado, el puerto continúa monitoreando BPDUs para detectar conexiones no autorizadas.

Si un puerto con BPDU Guard recibe una BPDU, se coloca automáticamente en estado err-disabled, bloqueándolo para prevenir riesgos en la topología STP.

Configuración:

- En una interfaz específica:  
    `spanning-tree bpduguard enable`
- Globalmente en todos los puertos con PortFast:  
    `spanning-tree portfast bpduguard default`

Recuperación del puerto:

- Manualmente o mediante recuperación automática con:  
    `errdisable recovery cause psecure_violation`

Verificación:

- `show spanning-tree summary`

*Nota: Siempre habilite BPDU Guard en todos los puertos configurados con PortFast para evitar ataques o conexiones accidentales de switches no autorizados.*

![[Telemática II/Curso de Cisco II/Módulo 11/ANEXOS/Pasted image 20260428205904.png]]

---