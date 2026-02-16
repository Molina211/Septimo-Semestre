#  Módulo 1: Configuración básica de dispositivos

---

## Contenido

- **Configuración de Parámetros Iniciales de un Switch:** Configuración de los parámetros iniciales en un switch Cisco.

- **Configuración de puertos de un Switch:** Configuración los puertos de un switch para cumplir con los requisitos de red.

- **Acceso remoto seguro:** Configuración el acceso de administración seguro en un switch.

- **Configuración básica de un router:** Configurar los ajustes básicos en un router para enrutar entre dos redes conectadas directamente, utilizando CLI.

- **Verificar redes conectadas directamente:** Verificar la conectividad entre dos redes que están conectadas directamente a un router.

---

## Configuración de parámetros iniciales de un switch
### Secuencia de arranque de un switch

Cuando enciendes un switch Cisco, este sigue 5 pasos básicos para quedar listo y poder configurarse.

#### *Paso 1: POST (Autodiagnóstico)*

Al encenderse, el switch ejecuta el POST (Power-On Self Test), que es una prueba automática.

Revisa:

- **La CPU**
    
- **La memoria DRAM**
    
- **Parte de la memoria flash**

Si todo está correcto, continúa.

Si falla algo crítico, el switch no arranca.


#### *Paso 2: Cargador de arranque (Bootloader)*

Después del POST, el switch ejecuta el bootloader, un pequeño programa almacenado en la memoria ROM.

Sirve para:

- **Preparar el hardware para cargar el sistema operativo.**


#### *Paso 3: Inicialización básica de la CPU*

El bootloader configura los aspectos básicos del procesador.

Lo que sucede es:

- **Inicializa registros de la CPU**
    
- Este define:
    
    - **Cantidad de memoria**
        
    - **Ubicación de la memoria**
        
    - **Velocidad de operación**
        

_Es como “despertar” y preparar el cerebro del switch._


#### *Paso 4: Inicialización del sistema de archivos flash*

El bootloader accede a la memoria flash del switch.

Es importante por que:

- **Allí se almacena el IOS (sistema operativo del switch).**
    
- **Verifica que el sistema de archivos esté disponible.**


#### *Paso 5: Carga del IOS*

Finalmente, el bootloader:

- **Busca la imagen del IOS**
    
- **La carga en la memoria**
    
- **Entrega el control del dispositivo al IOS**
    

Y eso seria todo para que el Switch este listo para usarse.

---

### El comando boot system

Después de encender un switch Cisco, este busca la imagen de IOS que debe cargar.  
Si la variable BOOT no está configurada, el switch carga el primer archivo ejecutable que encuentre en la memoria flash.

En los Catalyst 2960, el IOS suele estar dentro de una carpeta con el mismo nombre del archivo `.bin`.

Una vez cargado el IOS, el switch aplica la configuración guardada en startup-config (config.text).  
La imagen de arranque se define con el comando `boot system`, y se puede verificar con `show boot`.

Las partes del comando `boot system` son:

| Comando | Definición |
|--------|------------|
| `boot system` | El comando principal |
| `flash:` | El dispositivo de almacenamiento |
| `c2960-lanbasek9-mz.150-2.SE/` | La ruta al sistema de archivos |
| `c2960-lanbasek9-mz.150-2.SE.bin` | El nombre del archivo IOS |

---

### Indicadores LED del Switch

Los switches Cisco Catalyst cuentan con LED de estado que permiten ver rápidamente el funcionamiento, la actividad y el rendimiento del switch.  
La cantidad, tipo y ubicación de estos LED varían según el modelo y sus características.  
En el Catalyst 2960, los LED y el botón Mode del panel frontal permiten consultar distintos estados del switch.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260209094820.png]]

#### Clasificación de los estados del puerto

1. **System (Sistema):** 

	Indica el estado de energía del switch:

	- **Apagado**: el switch no está encendido.
    
	- **Verde**: funciona correctamente.
    
	- **Ámbar**: tiene energía, pero presenta un problema.

2. **RPS (Sistema de Alimentación Redundante):** 

	Indica el estado del RPS (fuente de energía de respaldo):

	- **Apagado**: no está conectado o está apagado.
	
	- **Verde**: conectado y listo para respaldar.
	
	- **Verde parpadeando**: conectado, pero en uso por otro dispositivo.
	
	- **Ámbar**: en reserva o con falla.
	
	- **Ámbar parpadeando**: la fuente interna falló y el RPS está alimentando al switch.

3. **STAT (Estadísticas):**

	Indica el estado del puerto (modo predeterminado):

	- **Apagado**: no hay enlace o el puerto está deshabilitado.
    
	- **Verde**: enlace activo.
    
	- **Verde parpadeando**: hay tráfico de datos.
    
	- **Verde y ámbar alternando**: falla en el enlace.
    
	- **Ámbar**: puerto bloqueado para evitar bucles.
    
	- **Ámbar parpadeando**: bloqueo preventivo por posible bucle.

4. **DUPLX (Duplex del puerto):**

	Indica el modo dúplex del puerto:

	- **LED del modo verde**: está seleccionado el modo dúplex.
    
	- **LED del puerto apagado**: semidúplex.
    
	- **LED del puerto verde**: dúplex completo.

5. **SPEED (Velocidades):**

	Indica el modo de velocidad del puerto:

	- **Apagado**: 10 Mbps.
    
	- **Verde**: 100 Mbps.
    
	- **Verde parpadeando**: 1000 Mbps.

6. **PoE (Alimentación por Ethernet):**

	Indica el estado de PoE (Power over Ethernet):

	- **LED de modo apagado**: PoE no seleccionado y sin fallas.
    
	- **LED de modo ámbar parpadeando**: hay al menos un puerto con falla o PoE denegado.
    
	- **LED de modo verde**: modo PoE activo.
	

	**LED del puerto en modo PoE**:

	- **Apagado**: PoE desactivado.
    
	- **Verde**: PoE activado.
    
	- **Verde y ámbar alternando**: PoE denegado por falta de potencia.
    
	- **Ámbar parpadeando**: PoE apagado por falla.
    
	- **Ámbar**: PoE deshabilitado en el puerto.

---

### Recuperarse de un bloqueo del sistema

El cargador de arranque (boot loader) permite acceder al switch cuando el IOS no puede iniciar, por ejemplo, si el archivo del sistema está dañado o no existe. Este modo ofrece una línea de comandos básica para trabajar directamente con los archivos guardados en la memoria flash.

¿Cómo acceder al cargador de arranque?:

1. Conecta una PC al puerto de consola del switch.

2. Desconecta la energía del switch.

3. Vuelve a conectarla y, antes de 15 segundos, mantén presionado el botón Mode mientras el LED del sistema parpadea en verde.

4. Suelta el botón cuando el LED cambie a ámbar y luego verde fijo.

5. Aparecerá el símbolo `switch:` en la consola (modo boot loader).

¿Qué se puede hacer en el boot loader?:

- Ver archivos en la memoria flash.

- Inicializar o formatear la flash.

- Cambiar la ruta del IOS.

- Cargar un nuevo IOS.

- Recuperar contraseñas.

**Comandos básicos**

- `help` o `?` → muestra los comandos disponibles.

- `set` → muestra la variable BOOT (ruta del IOS).

- `flash_init` → inicializa la memoria flash.

- `dir flash:` → muestra archivos y carpetas en flash.

- `BOOT=flash:archivo.bin` → define el IOS a cargar.

- `boot` → inicia el switch con el IOS configurado.

---

### Acceso a administración de switches

Para administrar un switch de forma remota, es necesario configurarle una dirección IP y una máscara de subred.  
Si la administración se hará desde otra red, también se debe configurar una puerta de enlace predeterminada.

La dirección IP se asigna a la SVI (interfaz virtual del switch), que no es un puerto físico, sino una interfaz lógica.  
La configuración inicial se realiza conectando una PC al switch mediante un cable de consola.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260209195218.png]]

---

### Ejemplo de Configuración de Switch SVI

De forma predeterminada, el switch se administra desde la VLAN 1 y todos los puertos pertenecen a ella.  
Por seguridad, se recomienda usar otra VLAN para la administración, por ejemplo la VLAN 99, en lugar de la VLAN 1.

Para esto seguiremos un paso a paso para comprender mejor esta configuración:

1. **Paso 1:** 

*El estado de la SVI:* La SVI de la VLAN 99 no aparecerá como activa hasta que exista la VLAN y haya un dispositivo conectado.

Esto significa que:

- Primero debe crearse la VLAN 99

- Al menos un puerto del switch debe pertenecer a la VLAN 99

- Debe haber un dispositivo conectado a ese puerto


Si no se cumple esto, la interfaz VLAN 99 aparecerá como down aunque esté configurada.

*El soporte IPv6:* Puede ser necesario configurar el switch para IPv6.

En switches Catalyst 2960 con IOS 15.0, para usar **IPv6**:

- Se debe habilitar el soporte IPv4 e IPv6 con:

	`sdm prefer dual-ipv4-and-ipv6 default`

- Luego se debe reiniciar el switch con `reload`

Esto solo se hace una vez y antes de configurar IPv6.

---

- **Configuración del paso 1:**

1. *Entrar al modo de configuración global*

	`S1# configure terminal`

Permite cambiar la configuración del switch.

2. *Entrar a la interfaz VLAN 99 (SVI)*

	`S1(config)# interface vlan 99`

Accede a la interfaz virtual de la VLAN de administración.

3. *Configurar la dirección IPv4*

	`S1(config-if)# ip address 172.17.99.11 255.255.255.0`

Asigna la IP IPv4 y la máscara para administrar el switch.

 4. *Configurar la dirección IPv6*

	`S1(config-if)# ipv6 address 2001:db8:acad:99::1/64`

Asigna la dirección IPv6 a la interfaz de administración.

5. *Habilitar la interfaz*

	`S1(config-if)# no shutdown`

Activa la interfaz VLAN (por defecto está apagada).

6. *Salir al modo EXEC privilegiado*

	`S1(config-if)# end`

Regresa al modo principal del switch.

7. *Guardar la configuración*

	`S1# copy running-config startup-config`

Guarda los cambios para que no se pierdan al reiniciar.

---

2. **Paso 2:**

*Gateway IPv6:* El switch no necesita gateway IPv6.

Esto se debe a que:

- En IPv6, el switch aprende la puerta de enlace automáticamente mediante Router Advertisement (RA).

- Por eso, solo se configura gateway para IPv4.

---

- **Configuración del paso 2:**

1. *Entrar al modo de configuración global*

	`S1# configure terminal`

Permite modificar la configuración del switch.

2. *Configurar el gateway predeterminado IPv4*

	`S1(config)# ip default-gateway 172.17.99.1`

Define la puerta de enlace para que el switch pueda comunicarse con otras redes.

3. *Volver al modo EXEC privilegiado*

	`S1(config)# end`

Sale del modo de configuración.

4. *Guardar la configuración*

	`S1# copy running-config startup-config`

Guarda los cambios para que no se pierdan al reiniciar.

---

3. **Paso 3:**

Para comprobar que las interfaces físicas y virtuales están bien configuradas, se usan los comandos:

- `show ip interface brief`

- `show ipv6 interface brief`

Estos comandos permiten verificar:

- La dirección IP asignada
    
- El estado de la interfaz
    
- Si la interfaz está activa o inactiva

*Verificación:* La IP configurada en la SVI solo sirve para administrar el switch de forma remota.

Esto significa que:

- El switch NO enruta paquetes de Capa 3

- Solo permite acceso por Telnet, SSH o HTTPS

- Para enrutar se necesita un router o switch capa 3

---

- **Configuración (uso) del paso 3:**

1. *Verificar IPv4*

	`S1# show ip interface brief`

Confirma que la VLAN 99 tiene una dirección IPv4 asignada.

Ejemplo:

- `Vlan99` → interfaz de administración

- `172.17.99.11` → IP configurada

- `down/down` → la VLAN aún no está activa (no hay puertos asociados o dispositivos conectados)

2. *Verificar IPv6*

	 `S1# show ipv6 interface brief`

Muestra las direcciones IPv6 configuradas en la VLAN 99:

- **Link-local (FE80::)** → se crea automáticamente

- **Global (2001:DB8:ACAD:99::1)** → configurada manualmente

---

## Configuración de puertos de un switch

Los puertos de un switch pueden configurarse de forma independiente según las necesidades de la red. Esto incluye ajustar velocidad, dúplex y otras opciones, además de verificar configuraciones y solucionar errores.

La comunicación en dúplex completo permite enviar y recibir datos al mismo tiempo, lo que mejora el rendimiento y elimina colisiones. Este modo funciona cuando un puerto del switch tiene un solo dispositivo conectado (microsegmentación).

La comunicación en semidúplex solo permite transmitir en una dirección a la vez, lo que genera colisiones y menor rendimiento. Este tipo de comunicación es común en dispositivos antiguos, como los hubs, y hoy en día ha sido reemplazada casi por completo por el dúplex completo.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260209202727.png]]

Las interfaces Gigabit Ethernet y 10 Gb requieren modo dúplex completo para funcionar correctamente.  
En este modo, la detección de colisiones se desactiva y se puede transmitir y recibir datos al mismo tiempo, logrando 100 % de eficiencia en ambas direcciones y duplicando el uso efectivo del ancho de banda.

---

### Configuración de puertos de switch en la capa física

Los puertos del switch pueden configurarse manualmente en velocidad y dúplex.  
El comando **`duplex`** define el modo (por ejemplo, dúplex completo) y el comando **`speed`** define la velocidad.  
Por ejemplo, un puerto puede configurarse para funcionar siempre en dúplex completo a 100 Mbps.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260209202959.png]]

- **Comandos**

1. *Entrar al modo de configuración global*

	`S1# configure terminal`

Permite realizar cambios en la configuración del switch.

2. *Entrar al modo de configuración del puerto*

	`S1(config)# interface FastEthernet 0/1`

Selecciona el puerto FastEthernet 0/1 para configurarlo.

3. *Configurar el modo dúplex*

	`S1(config-if)# duplex full`

Establece el puerto en dúplex completo, permitiendo enviar y recibir datos al mismo tiempo.

4. *Configurar la velocidad*

	`S1(config-if)# speed 100`

Fija la velocidad del puerto en 100 Mbps.

5. *Volver al modo EXEC privilegiado*

	`S1(config-if)# end`

Sale del modo de configuración.

6. *Guardar la configuración*

	`S1# copy running-config startup-config`

Guarda los cambios para que se mantengan después de reiniciar el switch.

En los switches Cisco Catalyst 2960 y 3560, los puertos tienen por defecto velocidad y dúplex automáticos (autonegociación).

- En 10 y 100 Mbps, los puertos pueden trabajar en semidúplex o dúplex completo.

- En 1000 Mbps (1 Gbps), los puertos siempre funcionan en dúplex completo.


La autonegociación es útil cuando no se conoce el dispositivo conectado o puede cambiar.  
Sin embargo, cuando se conectan dispositivos conocidos (servidores, PCs o equipos de red), es mejor configurar manualmente la velocidad y el dúplex para evitar errores.

*Nota:* Si hay incompatibilidad entre la velocidad o el dúplex del switch y del dispositivo conectado, pueden presentarse problemas de conectividad. Además, los puertos de fibra óptica siempre funcionan a una velocidad fija y en dúplex completo.

---

### Auto-MDIX (MDIX automático)

Antes se necesitaban cables específicos (directo o cruzado) según el tipo de dispositivo conectado. Por ejemplo, switch a switch requería cable cruzado y switch a PC o router cable directo.

La función Auto-MDIX elimina este problema. Cuando está habilitada, el puerto detecta automáticamente el tipo de cable conectado y se ajusta para que la comunicación funcione correctamente, sin importar si el cable es directo o cruzado.

**¿Cómo funciona y cómo se configura?**

- Con Auto-MDIX, se puede usar cualquier cable Ethernet.
    
- Para que funcione bien, la velocidad y el dúplex del puerto deben estar en auto.
    
- Se habilita en el modo de configuración de interfaz con:
    
    `S1(config-if)# mdix auto`
    

Además:

- **Catalyst 2960 y 3560**: Auto-MDIX viene activado por defecto.
    
- **Catalyst 2950 y 3550**: No soportan Auto-MDIX.
    

Para verificar el estado de Auto-MDIX se comprueba si está activado en un puerto con el comando:

	`S1# show controllers ethernet-controller fa0/1 phy | include MDIX`

- **On** → Auto-MDIX habilitado
    
- **Off** → Auto-MDIX deshabilitado

---

### Switch Verification Commands

En la tabla se resumen algunos de los comandos de verificación de conmutación más útiles.

| **Comando IOS**                      | **¿Qué muestra?**                                 |
| ------------------------------------ | ------------------------------------------------- |
| `show interfaces [interface-id]`     | Estado y configuración de una interfaz específica |
| `show startup-config`                | Configuración guardada (al iniciar el switch)     |
| `show running-config`                | Configuración actual en ejecución                 |
| `show flash`                         | Información del sistema de archivos flash         |
| `show version`                       | Estado del hardware y software del switch         |
| `show history`                       | Historial de comandos ejecutados                  |
| `show ip interface [interface-id]`   | Información IPv4 de una interfaz                  |
| `show ipv6 interface [interface-id]` | Información IPv6 de una interfaz                  |
| `show mac-address-table`             | Tabla de direcciones MAC del switch               |
| `show mac address-table`             | Tabla de direcciones MAC (comando alternativo)    |

---

### Verificar la configuración de puertos del switch.

El comando **`show running-config`** permite verificar que el switch esté correctamente configurado.  
En el ejemplo se observa que:

- El puerto FastEthernet 0/18 está asignado a la VLAN 99.
    
- La VLAN 99 tiene configurada la IP 172.17.99.11 /24.
    
- La puerta de enlace predeterminada es 172.17.99.1.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260212160352.png]]

El comando **`show interfaces`** se usa para ver el estado y las estadísticas de las interfaces del switch y es muy común en configuración y monitoreo.

En el ejemplo:

- FastEthernet 0/18 aparece up/up, lo que indica que está funcionando correctamente.
    
- La interfaz opera en dúplex completo (full) y a una velocidad de 100 Mb/s.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260212160439.png]]

---

### Problemas de la capa de acceso a la red

El comando **`show interfaces`** es útil para detectar problemas de cableado o medios.  
Una parte clave de su salida es el estado de la línea y del protocolo, que permite saber si la interfaz está funcionando correctamente o presenta fallas.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260213191851.png]]

El comando **`show interfaces`** muestra el estado del hardware y del protocolo de enlace:

- **Interface up**: el hardware recibe señal.
- **Line protocol up**: el enlace de datos funciona correctamente.
### Posibles estados y qué significan

- **Interface up / protocol down**: hay un problema (encapsulación incorrecta, errores, interfaz remota deshabilitada o falla de hardware).
- **Interface down / protocol down**: no hay cable o el otro extremo está apagado.
- **Administratively down**: la interfaz fue deshabilitada manualmente con `shutdown`.

Además, el comando muestra contadores y estadísticas útiles para detectar errores en la interfaz.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260213192000.png]]

Algunos errores de los medios no son lo suficientemente graves como para hacer que el circuito falle, pero causan problemas de rendimiento de la red. La tabla explica algunos de estos errores comunes que se pueden detectar con el comando `show interfaces`.

| Tipo de error                      | Explicación sencilla                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Errores de entrada**             | Cantidad total de errores. Incluye runts, gigantes, sin buffer, CRC, , desbordamiento y recuentos ignorados.                                |
| **Fragmentos de colisión (Runts)** | Paquetes demasiado pequeños para Ethernet (menos de 64 bytes) que se descartan porque normalmente se producen por colisiones.               |
| **Gigantes**                       | Paquetes demasiado grandes para el medio (más de 1518 bytes en Ethernet) que son descartados.                                               |
| **CRC**                            | Errores que ocurren cuando el valor de verificación del paquete recibido no coincide, lo que indica datos corruptos.                        |
| **Errores de salida**              | Total de errores que impiden que los datos se envíen correctamente desde la interfaz.                                                       |
| **Colisiones**                     | Cantidad de paquetes que tuvieron que reenviarse porque chocaron con otros en la red Ethernet.                                              |
| **Colisiones tardías**             | Colisiones que ocurren después de que ya se había enviado gran parte del paquete, normalmente causadas por problemas físicos o de cableado. |

---

### Errores de entrada y salida de interfaz

#### Input errors (Errores de entrada)

Indican todos los errores que ocurren al recibir datos en una interfaz. Normalmente están relacionados con problemas físicos o de medios.

Incluyen:

- **Runts**: Paquetes muy pequeños (menos de 64 bytes). Suelen deberse a tarjetas de red defectuosas o colisiones.

- **Giants**: Paquetes demasiado grandes para Ethernet. Indican errores de configuración o equipos defectuosos.

- **CRC errors**: Errores al verificar la integridad del paquete. Generalmente causados por cables dañados, interferencia eléctrica o mal cableado. Muchos errores CRC significan ruido en el enlace.

- Otros errores como tramas dañadas, saturación o paquetes ignorados.

Entonces, muchos _input errors_ casi siempre señalan problemas de cableado, ruido o hardware.

#### Output errors (Errores de salida)

Son errores que impiden que los datos se envíen correctamente desde la interfaz.

Incluyen:

- **Colisiones**: Ocurren normalmente en half-duplex. En full-duplex no deberían existir.

- **Colisiones tardías**: Colisiones que ocurren cuando ya se transmitió gran parte del paquete. Se deben a:
    
    - Cables demasiado largos
    
    - Configuración incorrecta de dúplex (un extremo full-duplex y el otro half-duplex)
    

Entonces, las colisiones tardías indican mal diseño o mala configuración de la red y no deberían existir en una red bien configurada.

---

### Resolución de problemas de la capa de acceso a la red

La mayoría de los problemas en redes conmutadas aparecen durante la instalación inicial, pero aun después de funcionar correctamente, pueden surgir fallas por daños en el cableado, cambios de configuración o nuevos dispositivos conectados al switch. Por eso, la red necesita mantenimiento y monitoreo constante.

Una colisión tardía ocurre cuando la colisión se produce después de transmitir 512 bits de la trama, lo que normalmente indica errores de cableado o mala configuración de dúplex.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260213203049.png]]

El comando **`show interfaces`** se usa para comprobar el estado de una interfaz y diagnosticar problemas de red.

#### Si la interfaz está inactiva:

- **Revisar el cableado**: confirmar que el cable sea el correcto, esté bien conectado y no esté dañado. Si hay dudas, reemplazarlo.

- **Verificar la velocidad**: normalmente se negocia automáticamente, pero si hay una incompatibilidad de velocidad por mala configuración o fallas de hardware/software, la interfaz puede quedar inactiva. En ese caso, configurar la misma velocidad en ambos extremos.

#### Si la interfaz está activa pero hay problemas:

- **Buscar ruido en la línea**: revisar errores como **CRC, runts o giants**. Si aumentan, puede haber interferencia eléctrica o cables demasiado largos o incorrectos.

- **Revisar colisiones**: si hay muchas colisiones o colisiones tardías, revisar la configuración de dúplex. Ambos extremos deben coincidir; lo recomendado es configurar full dúplex manualmente si hay conflictos.

---

## Acceso remoto seguro

### Operación Telnet

Cuando no se puede acceder físicamente a un switch, es necesario administrarlo de forma remota y segura. Para ello se utiliza SSH (Secure Shell), que cifra la comunicación y protege las credenciales.

Telnet, en cambio, usa el puerto TCP 23 y transmite usuario, contraseña y datos en texto plano, lo que lo hace inseguro. Un atacante puede capturar esta información fácilmente con herramientas de análisis de tráfico como Wireshark.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260213203922.png]]

---

### Funcionamiento de SSH

SSH (Secure Shell) es un protocolo seguro que usa el puerto TCP 22 y permite administrar dispositivos de forma remota y cifrada. Protege tanto las credenciales (usuario y contraseña) como los datos transmitidos mediante encriptación.

A diferencia de Telnet, SSH no muestra la información en texto plano, por lo que herramientas como Wireshark no pueden leer las credenciales.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214001653.png]]

---

### Verifique que el switch admita SSH

Para habilitar SSH en un switch Catalyst 2960, es necesario que el dispositivo tenga un IOS con soporte criptográfico.  
Esto se verifica usando el comando **`show version`**.

Si el nombre del archivo IOS contiene “k9”, significa que sí admite cifrado y, por lo tanto, permite configurar SSH.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214001838.png]]

---

### Configuración de SSH

Antes de configurar SSH, el switch debe tener un nombre de host único y una configuración básica de red correcta para permitir la conectividad.

#### Pasos a paso

1. *Paso 1*

	Para verificar si un switch soporta SSH, se utiliza el comando **`show ip ssh`**.  
	Si el switch no tiene un IOS con capacidades criptográficas, el comando no será reconocido, lo que indica que SSH no es compatible en ese dispositivo.

	`S1# show ip ssh`

2. *Paso 2*

	Se configura el nombre de dominio IP del switch desde el modo de configuración global usando el comando **`ip domain-name`**.  
	Este dominio es necesario para la configuración de SSH, por ejemplo: `cisco.com`.

	`S1(config)# ip domain-name cisco.com`

3. *Paso 3*

	Para usar SSH de forma segura, se recomienda configurar SSH versión 2, ya que la versión 1 tiene vulnerabilidades conocidas. Esto se hace con el comando:

	`ip ssh version 2`

	Luego, se deben generar las claves RSA con:

	`crypto key generate rsa`

	Al generar estas claves:

	SSH se habilita automáticamente en el switch.

	El sistema solicita la longitud del módulo (por ejemplo, 1024 bits).

	Mayor longitud = más seguridad, pero también más tiempo de procesamiento.


	Si en algún momento se desea eliminar las claves RSA, se usa:

	 `crypto key zeroize rsa`

	Al borrar las claves, SSH queda deshabilitado automáticamente.

	`S1(config)# crypto key generate rsa` 
	`How many bits in the modulus [512]: 1024`

4. *Paso 4*

	El servidor SSH puede validar usuarios de forma local o mediante un servidor de autenticación.  
	Para la autenticación local, se crea un usuario y contraseña en el switch con el comando:

	`username {username} secret {password}`

	En el ejemplo, se configuró el usuario admin con la contraseña ccna, lo que permite acceder al switch por SSH usando credenciales locales.

	`S1(config)# username admin secret ccna`

5. *Paso 5*

	Para habilitar SSH en las líneas VTY del switch:

	Se accede a las líneas vty 0–15 con el comando `line vty`.

	 Se usa `transport input ssh` para permitir solo conexiones SSH y bloquear Telnet.

	Con `login local`, el switch exige autenticación con los usuarios locales configurados.

	Con esta configuración, el Cisco Catalyst 2960 acepta únicamente accesos remotos seguros por SSH, usando credenciales locales.

	`S1(config)# line vty 0 15` 
	`S1(config-line)# transport input ssh` 
	`S1(config-line)# login local` 
	`S1(config-line)# exit`

6. *Paso 6*

	De forma predeterminada, el switch admite SSH versión 1 y 2.  
	Para forzar el uso de SSH versión 2 (más segura), se configura con el comando:

	 `ip ssh version 2`

	Así, el dispositivo solo permitirá conexiones SSH v2, mejorando la seguridad.

	`S1(config)# ip ssh version 2`


---

### Verifique que SSH esté operativo

Para acceder remotamente al switch, se utiliza un cliente SSH como PuTTY desde una computadora.

En el ejemplo:

- El switch S1 tiene SSH habilitado.

- La SVI VLAN 99 del switch usa la IP 172.17.99.11.

- PC1 tiene la IP 172.17.99.21.

Desde PC1, se configura PuTTY para conectarse por SSH a la dirección 172.17.99.11, lo que permite administrar el switch de forma segura y cifrada.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214004202.png]]

Al establecer la conexión SSH, el sistema solicita un nombre de usuario y contraseña.  
En el ejemplo, se ingresa usuario: admin y contraseña: ccna.  
Si los datos son correctos, el usuario accede de forma segura a la CLI del switch Catalyst 2960 mediante SSH.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214010003.png]]

El comando `show ip ssh` se utiliza para verificar la versión y la configuración de SSH en el dispositivo.  
En el ejemplo, la salida confirma que SSH versión 2 está habilitada en el switch.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214010011.png]]

---

## Configuración básica de un router

Hasta ahora se han visto switches, pero para que una red pueda comunicarse con otras redes, es necesario configurar routers.

Los routers y switches Cisco son muy parecidos porque:

- Usan sistemas operativos y comandos similares.

- Tienen una estructura de configuración casi igual.

- Comparten muchos comandos básicos.

Por eso, la configuración inicial en un router es similar a la de un switch, e incluye:

- Asignar un nombre al dispositivo para identificarlo.

- Configurar contraseñas de acceso para seguridad básica.

Estas configuraciones son siempre los primeros pasos al trabajar con un router.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214014325.png]]

Configure un banner para proporcionar notificaciones legales de acceso no autorizado, como se muestra en el ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214014342.png]]

Guarde los cambios en un router, como se muestra en el ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214014355.png]]

---

### Topología de doble pila

Los switches y los routers se diferencian principalmente por el tipo de interfaces que utilizan.

- Los switches de capa 2 trabajan dentro de la red local (LAN), por eso tienen muchos puertos FastEthernet o Gigabit Ethernet para conectar dispositivos.

- Los routers se usan para interconectar redes distintas, por lo que sus interfaces se configuran con direcciones IP.

La topología de pila dual se usa como ejemplo para mostrar cómo configurar en un router direcciones IPv4 e IPv6 al mismo tiempo.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214015452.png]]

---

### Configurar interfaces de routers

Los routers pueden conectar redes LAN y WAN, por eso admiten muchos tipos de interfaces. Por ejemplo, los routers Cisco ISR G2 incluyen interfaces Gigabit Ethernet integradas y ranuras HWI, que permiten usar interfaces seriales, DSL y de cable, según la necesidad de la red.

Para que una interfaz del router funcione correctamente, debe cumplir estos requisitos:

1. **Tener una dirección IP configurada**
    
    - Es obligatorio asignar una IPv4, una IPv6 o ambas.
        
    - Esto permite que la interfaz pueda enviar y recibir datos en la red.
        
2. **Estar activada (no shutdown)**
    
    - Las interfaces vienen apagadas por defecto.
        
    - El comando no shutdown las habilita, como si se “encendiera” el puerto.
        
    - Además, la interfaz debe estar conectada físicamente a otro dispositivo para que la capa física esté activa.
        
3. **Tener una descripción (opcional pero recomendada)**
    
    - Permite identificar fácilmente para qué se usa la interfaz.
        
    - Es muy útil en redes reales para solución de problemas, documentación y reconocimiento de conexiones externas.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214015948.png]]

---

### Interfaces de bucle invertido IPv4

La interfaz loopback en un router Cisco IOS es una interfaz lógica interna que no depende de hardware físico y permanece siempre activa mientras el router esté encendido. Se utiliza para pruebas, administración y simulación de redes, ya que garantiza que el router tenga al menos una interfaz disponible. En laboratorios, permite crear múltiples redes simuladas, incluso para representar enlaces a Internet, facilitando la práctica y el aprendizaje de configuraciones.

	`Router(config)# interface loopback {number}`

	`Router(config-if)# ip address {ip-address subnet-mask}`

Un router puede tener varias interfaces loopback habilitadas. Cada una debe contar con una dirección IPv4 única, que no puede ser compartida con ninguna otra interfaz del router.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214020830.png]]

---

## Verificar redes conectadas directamente

No basta con configurar un router; es necesario verificar la configuración y la conectividad. Para ello se utilizan comandos `show`, que permiten comprobar el estado y funcionamiento de las interfaces y las redes conectadas directamente. Estos comandos, junto con verificadores de sintaxis y herramientas de trazado de paquetes, ayudan a confirmar que la configuración del router es correcta.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214121221.png]]

Algunos comandos `show` permiten verificar rápidamente el estado de las interfaces del router:

- **show ip interface brief / show ipv6 interface brief**: muestran un resumen de todas las interfaces, sus direcciones IPv4 o IPv6 y su estado operativo.

- **show running-config interface _interface-id_**: muestra la configuración aplicada a una interfaz específica.

- **show ip route / show ipv6 route**: muestran la tabla de ruteo almacenada en la RAM; en IOS 15, las interfaces activas aparecen con las entradas C (Conectado) y L (Local), mientras que en versiones anteriores solo aparece C.

---

### Verificación del estado de una interfaz

Los comandos `show ip interface brief` y `show ipv6 interface brief` permiten verificar rápidamente el estado de todas las interfaces del router. Si aparecen como up/up, significa que están activas y funcionando correctamente; cualquier otro estado indica un posible problema de configuración o cableado.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214121531.png]]

---

### Verificar direcciones locales y multidifusión de vínculos IPv6

El comando `show ipv6 interface brief` muestra que cada interfaz IPv6 tiene dos direcciones:

- Una dirección de unidifusión global, configurada manualmente,

- Una dirección link-local, que comienza con FE80 y se asigna automáticamente.

Las interfaces IPv6 siempre deben tener una dirección link-local, aunque no es obligatorio que tengan una dirección global.

El comando `show ipv6 interface gigabitethernet 0/0/0` muestra información más detallada, incluyendo el estado de la interfaz, sus direcciones IPv6 (global y link-local) y las direcciones de multidifusión, que usan el prefijo FF02.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214121631.png]]

---

### Verificar la configuración de la interfaz

El comando `show running-config interface` muestra, además de la dirección link-local y la dirección de unidifusión global, las direcciones de multidifusión asignadas a la interfaz, identificadas por el prefijo FF02.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214122019.png]]

Para obtener información más detallada de las interfaces se utilizan estos comandos:

- **show interfaces**: muestra información general de cada interfaz y el conteo de paquetes que entran y salen.

- **show ip interface / show ipv6 interface**: muestran información específica relacionada con IPv4 o IPv6 de todas las interfaces del router.

---

### Verificar rutas

Los comandos `show ip route` y `show ipv6 route` muestran las redes conectadas directamente y también las rutas de host local del router.

Las rutas de host local representan las direcciones IP propias del router, tienen distancia administrativa 0 y usan una máscara /32 en IPv4 y /128 en IPv6. Estas rutas permiten que el router reconozca y procese los paquetes que van dirigidos a sus propias direcciones IP.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214122717.png]]

En la tabla de enrutamiento, la letra “C” indica una red conectada directamente. Cuando una interfaz tiene una dirección IPv6 de unidifusión global y está en estado up/up, su prefijo se agrega a la tabla IPv6 como ruta conectada.

Además, la dirección IPv6 de la interfaz se instala como ruta local con prefijo /128, la cual permite al router procesar correctamente los paquetes dirigidos a su propia dirección.

El comando ping en IPv6 funciona igual que en IPv4, usando una dirección IPv6, y se emplea para verificar la conectividad de Capa 3 entre dispositivos.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214132532.png]]

---

### Filtrado de los resultados del comando show

En la CLI de Cisco IOS, los comandos que muestran mucha información se pausan cada 24 líneas y aparece el mensaje -- More --. Al presionar Enter se avanza línea por línea y con la barra espaciadora se muestra el siguiente bloque. El comando terminal length permite definir cuántas líneas se muestran; usar terminal length 0 evita las pausas.

Además, Cisco IOS ofrece filtrado de salida para ver solo información específica. Esto se hace agregando una barra vertical ( | ) después del comando `show`, seguida de un parámetro de filtrado y una expresión. Existen cuatro parámetros de filtrado, que ayudan a localizar rápidamente datos relevantes y mejoran la eficiencia al trabajar en la CLI.

1. *Section*

Muestra la sección completa que comienza con la expresión de filtrado.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214133024.png]]

2. *Include*

Incluye todas las líneas de salida que coinciden con la expresión de filtrado.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214133141.png]]

3. *Exclude*

Excluye todas las líneas de salida que coinciden con la expresión de filtrado.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214133247.png]]

4. *Begin*

Muestra todas las líneas de salida desde un punto determinado, comenzando con la línea que coincide con la expresión de filtrado.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214133337.png]]

*Nota:* Los filtros de salida se pueden usar en combinación con cualquier `show` comando.

---

### Historial de comandos

La función de historial de comandos permite guardar temporalmente los comandos ejecutados para reutilizarlos fácilmente.

- Con Ctrl + P o la flecha arriba se recuperan los comandos más recientes.

- Con Ctrl + N o la flecha abajo se avanza nuevamente hacia los comandos más nuevos.

Por defecto, el historial está habilitado y guarda las últimas 10 líneas. El comando `show history` permite ver el contenido del búfer.

Si se necesita, se puede aumentar o reducir el tamaño del historial solo para la sesión actual usando el comando `terminal history size`, lo que facilita el trabajo en la CLI sin volver a escribir comandos largos.

![[Telemática II/Curso de Cisco II/Módulo 01/ANEXOS/Pasted image 20260214133828.png]]


