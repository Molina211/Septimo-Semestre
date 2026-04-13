# Módulo 6: EtherChannel

---

## Contenido

- **Funcionamiento de EtherChannel:** Describe la tecnología EtherChannel.

- **Configuración de EtherChannel:** Configura EtherChannel.

- **Verificación y solución de problemas de EtherChannel:** Soluciona problemas de EtherChannel.

---

## Funcionamiento de EtherChannel

EtherChannel es una tecnología de Cisco que permite agrupar hasta ocho enlaces físicos (como cables Ethernet) en una sola conexión lógica.

- *¿Para qué sirve?*

- **Mayor Ancho de Banda:** Combina la velocidad de todos los cables. Si agrupas cuatro enlaces de 1 Gbps, obtienes un canal lógico de 4 Gbps.
    
- **Redundancia y Tolerancia a Fallos:** Si uno de los cables físicos se corta, el tráfico sigue fluyendo por los demás sin interrumpir la conexión.
    
- **Optimización de STP:** Engaña al Spanning Tree Protocol. STP ve el grupo de cables como un solo enlace, por lo que no bloquea las rutas redundantes, permitiendo usar todos los cables al mismo tiempo.
    
- **Balanceo de Carga:** Reparte el tráfico entre todos los enlaces físicos del grupo para que ninguno se sature mientras otros están inactivos.

- *¿Cómo funciona?*

En lugar de procesar cada puerto de forma individual, el switch gestiona el "Port Channel" (el grupo). La configuración que apliques a la interfaz lógica se replica automáticamente en todas las interfaces físicas que la componen.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260407233436.png]]

---

### EtherChannel

EtherChannel es una tecnología de Cisco Systems que agrupa varios puertos físicos Ethernet en un solo enlace lógico llamado Port-Channel, aumentando el ancho de banda y proporcionando redundancia entre switches.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260407233627.png]]

---

### Ventajas de EtherChannel

#### Configuración más simple y consistente

En lugar de configurar puerto por puerto, configuras todo desde el Port-Channel.  
Esto evita errores y mantiene todos los enlaces con la misma configuración.

#### Más ancho de banda sin gastar más

No necesitas comprar enlaces más rápidos.  
Simplemente unes varios enlaces normales y obtienes mayor capacidad.

#### Balanceo de carga

El tráfico se reparte entre los enlaces del canal.  
Puede hacerse usando:

- MAC origen/destino
- IP origen/destino

Esto mejora el rendimiento porque no todo el tráfico va por un solo cable.

#### STP lo ve como un solo enlace

El protocolo Spanning Tree (STP) considera todo el EtherChannel como un único enlace lógico.  
Si hay varios EtherChannel, STP puede bloquear uno completo para evitar bucles.  
Si solo hay uno, todos los enlaces funcionan activos.

#### Alta disponibilidad (redundancia)

Si un cable falla:

- No se cae la red
- El canal sigue funcionando con los demás enlaces

Además, no se recalcula STP, lo que evita interrupciones.

---

### Restricciones de implementación

1. **Mismo tipo y características de puertos**
    Todos los enlaces deben ser iguales: misma velocidad (Fast o Gigabit), mismo modo dúplex y mismo tipo.  
    Si intentas mezclar puertos diferentes, el EtherChannel no funcionará correctamente.
2. **Cantidad máxima de enlaces**  
    Un EtherChannel puede agrupar hasta 8 puertos físicos.  
    Esto define el límite de cuánto ancho de banda puedes sumar usando esta tecnología.
3. **Limitaciones del switch**  
    Cada switch tiene un número máximo de EtherChannels que puede soportar.  
    Por ejemplo, el Cisco Catalyst 2960 permite varios, pero no ilimitados. Esto depende del modelo y la versión del sistema operativo (IOS).
4. **Configuración idéntica en ambos lados**  
    Los puertos que forman el canal deben estar configurados exactamente igual en los dos switches:
    - Si son troncales (trunk), ambos lados deben ser trunk.
    - Deben tener la misma VLAN nativa.
    - Deben trabajar en capa 2.  
        Si hay diferencias, el canal no se forma o presenta errores.
5. **Interfaz lógica (Port-Channel)**  
    EtherChannel crea una interfaz virtual llamada Port-Channel.  
    Todo lo que configures ahí (VLAN, trunk, etc.) se aplica automáticamente a los puertos físicos.  
    Esto simplifica la administración, pero también implica que todos los puertos deben comportarse como uno solo.

*Idea clave: EtherChannel funciona correctamente solo si todos sus enlaces son uniformes y están sincronizados; cualquier diferencia rompe la agregación.*

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260407235118.png]]

---

### Protocolos de negociación automática

Los EtherChannel son una forma de agrupar varios enlaces físicos en uno solo lógico para aumentar el ancho de banda y la redundancia.

Se pueden formar de tres maneras:

1. **Con PAgP (propietario de Cisco)**
    - Los switches negocian automáticamente si pueden agrupar los puertos.
2. **Con LACP (estándar)**
    - Funciona similar a PAgP, pero es compatible con equipos de diferentes marcas.
3. **De forma estática (manual)**
    - No hay negociación; el administrador configura el canal directamente.

---

### Funcionamiento PAgP

*¿Qué es PAgP y para qué sirve?*

PAgP es un protocolo de Cisco que permite crear automáticamente enlaces EtherChannel.

En contexto:

- Une varios enlaces físicos en un solo enlace lógico.
- Mejora rendimiento y disponibilidad.
- Verifica que los enlaces sean compatibles antes de agruparlos.

*¿Cómo funciona?*

- Envía paquetes cada 30 segundos entre puertos.
- Revisa que las configuraciones coincidan.
- Si son compatibles, forma el EtherChannel.
- El canal resultante se maneja como un solo puerto en el árbol de expansión.

Idea clave:  PAgP automatiza la creación y validación del canal.

*Requisitos obligatorios*

Para que funcione correctamente:

- Misma velocidad
- Mismo dúplex
- Misma configuración de VLAN

Además:

- Todos los puertos del canal comparten configuración.
- Un cambio en uno afecta a todos.

*Modos de PAgP*

**On**

- No hay negociación.
- Fuerza manualmente el canal.
- Solo funciona si el otro lado también está en On.

**PAgP Deseable**

- Modo activo.
- Inicia la negociación enviando paquetes PAgP.

**PAgP Automático**

- Modo pasivo.
- Solo responde, no inicia negociación.

*Compatibilidad entre modos*

- Deseable + Automático → sí funciona
- Deseable + Deseable → sí funciona
- Automático + Automático → no funciona
- On + On → funciona sin negociación
- On + Deseable/Automático → no funciona

Idea clave:
Si ninguno inicia la negociación, el canal no se forma.

Entonces PAgP permite crear EtherChannel de forma automática y segura, asegurando compatibilidad entre enlaces.  
El modo On elimina la negociación, lo que puede generar errores si hay diferencias de configuración.

---

### Ejemplo de configuración del modo PAgP

Considere los dos switches en la figura. Si S1 y S2 establecen un EtherChannel usando PAgP depende de la configuración de modo en cada lado del canal.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408000531.png]]

La tabla muestra las diversas combinaciones de modos PAgP en S1 y S2 y el resultado del establecimiento de canales.

- **PAgP Modes**

| S1         | S2                  | Establecimiento del canal |
| ---------- | ------------------- | ------------------------- |
| On         | On                  | Sí                        |
| On         | Deseable/Automático | No                        |
| Deseado    | Deseado             | Sí                        |
| Deseado    | Automático          | Sí                        |
| Automático | Deseado             | Sí                        |
| Automático | Automático          | No                        |

---

### Operación LACP

*¿Qué es LACP y para qué sirve?*

LACP es un protocolo estándar IEEE que permite agrupar varios puertos físicos en un solo canal lógico (EtherChannel).

En contexto:

- Hace lo mismo que PAgP, pero no es propietario de Cisco.
- Se puede usar entre equipos de diferentes marcas.
- Actualmente está definido en IEEE 802.1AX (antes 802.3ad).

*¿Cómo funciona?*

- Envía paquetes LACP entre switches.
- Detecta si los puertos son compatibles.
- Si coinciden → forma automáticamente el EtherChannel.

Idea clave:  
LACP negocia y valida la conexión antes de crear el canal, igual que PAgP.

*Modos de LACP*

**On**

- No hay negociación.
- Fuerza el canal manualmente.
- Solo funciona si el otro lado también está en On.

**Activo**

- Inicia la negociación.
- Envía paquetes LACP.

**Pasivo**

- No inicia negociación.
- Solo responde si otro inicia.

*Compatibilidad entre modos*

- Activo + Activo → sí funciona
- Activo + Pasivo → sí funciona
- Pasivo + Pasivo → no funciona
- On + On → funciona sin negociación
- On + Activo/Pasivo → no funciona

Idea clave:  
Si nadie inicia (pasivo + pasivo), el canal no se forma.

*Característica importante (ventaja clave)*

- Permite:
    - Hasta 8 enlaces activos
    - Hasta 8 enlaces en espera (backup)

Si un enlace activo falla:

- Uno de los enlaces de reserva se activa automáticamente.

Entonces LACP es un protocolo estándar que permite crear EtherChannel de forma automática y segura, compatible entre diferentes fabricantes.  
Funciona de manera similar a PAgP, pero con la ventaja de ser interoperable y más flexible en redes mixtas.

---

### Ejemplo de configuración del modo LACP

Considere los dos switches en la figura. Si S1 y S2 establecen un EtherChannel usando LACP depende de la configuración de modo en cada lado del canal.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408001315.png]]

La tabla muestra las diversas combinaciones de modos LACP en S1 y S2 y el resultado resultante del establecimiento de canales.

| S1     | S2            | Establecimiento del canal |
| ------ | ------------- | ------------------------- |
| On     | On            | Sí                        |
| On     | Activo/Pasivo | No                        |
| Activo | Activo        | Sí                        |
| Activo | Pasivo        | Sí                        |
| Pasivo | Activo        | Sí                        |
| Pasivo | Pasivo        | No                        |

---

## Configuración de EtherChannel

EtherChannel básicamente “une” varios cables como si fueran uno solo. Pero para que eso funcione bien, hay reglas que sí o sí deben cumplirse.

*Primero: compatibilidad de interfaces*

No cualquier puerto sirve.

Todas las interfaces que quieras agrupar deben soportar EtherChannel.  
No importa si están separadas físicamente en el switch, eso no afecta.

Ejemplo: puedes usar Fa0/1, Fa0/5 y Fa0/9 sin problema.


*Segundo: misma velocidad y dúplex*

Aquí es donde muchos fallan.

Todos los puertos deben tener:

- La misma velocidad (100 Mbps, 1 Gbps, etc.)
- El mismo modo dúplex (full o half)

Si uno está en 100 Mbps y otro en 1 Gbps → no funciona  
Si uno está en half y otro en full → tampoco funciona

Todos deben estar iguales para que el canal sea estable.


*Tercero: configuración de VLAN*

Aquí depende de cómo estés usando los puertos:

Si son puertos normales:

- Todos deben estar en la misma VLAN

Si son troncales:

- Todos deben estar en modo trunk

Es decir, no puedes mezclar:

- Un puerto en VLAN 10
- Otro en VLAN 20

Eso rompe el EtherChannel.


*Cuarto: rango de VLAN (en troncales)*

Este punto es clave y más técnico:

Cuando usas trunk, cada puerto tiene VLANs permitidas.

Todas las interfaces del EtherChannel deben tener:

- El mismo rango de VLANs permitidas

Ejemplo incorrecto:

- Puerto 1 permite VLAN 10,20,30
- Puerto 2 permite VLAN 10,20

Resultado: NO se forma EtherChannel

Aunque estén en modo `auto` o `desirable`, igual falla.


*Entonces… ¿Qué muestra la figura (S1 y S2)?*

La figura representa esto:

Dos switches (S1 y S2) conectados con varios cables  
Esos cables están agrupados en un EtherChannel

Para que funcione, ambos lados deben tener:

- Mismos puertos configurados
- Misma velocidad y dúplex
- Mismo tipo (access o trunk)
- Mismas VLANs permitidas

Si todo coincide → se forma el EtherChannel correctamente  
Si algo no coincide → simplemente no se forma

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408004942.png]]

En la siguiente figura, los puertos de S1 están configurados en modo semidúplex. Por lo tanto, no se formara un EtherChannel entre el S1 y el S2.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408005055.png]]

Cuando trabajas con EtherChannel, la configuración debe hacerse principalmente sobre la interfaz lógica llamada Port-Channel, no directamente en cada puerto físico.

- Si configuras algo en el Port-Channel, ese cambio se aplica automáticamente a todas las interfaces físicas que lo componen.
    
- En cambio, si haces cambios directamente en una interfaz física, esos cambios no se reflejan en el Port-Channel, lo que puede generar inconsistencias y hacer que el EtherChannel falle o no se forme correctamente.

Por eso, modificar parámetros individuales en los puertos que ya pertenecen al EtherChannel puede causar problemas de compatibilidad.

En cuanto a su funcionamiento, el Port-Channel puede configurarse de tres formas:

- Modo acceso (para una sola VLAN)
    
- Modo troncal (trunk), que es el más utilizado
    
- Puerto enrutado, si se usa a nivel de capa 3

---

### Ejemplo de configuración de LACP

EtherChannel esta deshabilitado de forma predeterminada y debe configurarse. La topología de la figura se utilizara para demostrar un ejemplo de configuración de EtherChannel utilizando LACP.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408005506.png]]

- **Paso 1: Seleccionar las interfaces**

Primero eliges los puertos que vas a unir en el EtherChannel. Se usa `interface range` para configurarlos todos al mismo tiempo, en lugar de ir uno por uno.

Ejemplo:

`interface range fa0/1 - 3`

Con esto estás diciendo: estos puertos van a formar parte del mismo canal.

- **Paso 2: Crear el EtherChannel con LACP**

Ahora conviertes esos puertos en un solo canal lógico.

Se usa:

`channel-group 1 mode active`

- `1` → es el número del Port-Channel (puedes usar otro, pero debe coincidir en ambos switches)
- `mode active` → activa LACP, que negocia automáticamente el canal

En este punto:

- Los puertos físicos dejan de comportarse individualmente
- Pasan a formar parte del Port-Channel 1

- **Paso 3: Configurar el Port-Channel (lo más importante)**

Aquí es donde realmente defines cómo va a funcionar el enlace.

Entras a la interfaz lógica:

`interface port-channel 1`

Y configuras, por ejemplo, como troncal:

`switchport mode trunk`
`switchport trunk allowed vlan 10,20,30`

Esto significa:

- El canal va a transportar varias VLAN (modo trunk)
- Solo permitirá las VLAN 10, 20 y 30

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408005851.png]]

---

## Verificación y solución de problemas de EtherChannel

Al configurar dispositivos en la red, es necesario verificar la configuración y, en caso de fallos, identificarlos y solucionarlos.

La verificación se realiza mediante comandos, aplicados sobre una topología específica mostrada en la figura.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408010529.png]]

1. `show interfaces port-channel`

El `show interfaces port-channel` comando muestra el estado general de la interfaz de canal de puertos. En la figura, la interfaz de canal de puertos 1 está activa.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408010641.png]]

2. `show etherchannel summary`

El comando `show etherchannel summary` muestra un resumen por cada canal de puertos configurado.

En el resultado:

- El grupo 1 usa LACP
- Está formado por las interfaces Fa0/1 y Fa0/2
- Es un EtherChannel de capa 2 en uso, indicado por las letras SU junto al número del canal

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408010844.png]]

3. `show etherchannel port-channel`

El comando `show etherchannel port-channel` muestra información de un canal de puertos específico.

En el ejemplo:

- El Port-Channel 1 incluye Fa0/1 y Fa0/2
- Usa LACP en modo activo
- Está en uso porque está correctamente conectado a otro switch con configuración compatible

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408011018.png]]

4. `show interfaces {interface_id} etherchannel`

El comando `show interfaces {interface_id} etherchannel` muestra el papel de una interfaz dentro del EtherChannel.

En el ejemplo:

- La interfaz Fa0/1 pertenece al grupo EtherChannel 1 (`show interfaces FastEthernet0/1 etherchannel`)
- El protocolo utilizado es LACP

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408011219.png]]

---

### Common Issues with EtherChannel Configurations

Todas las interfaces de un EtherChannel deben tener la misma configuración en todos los aspectos clave: velocidad, dúplex, tipo de puerto (access o trunk), VLAN de acceso, y en caso de trunk, misma VLAN nativa y mismo rango de VLANs permitidas. Si algo no coincide, el EtherChannel no se forma o funciona de manera incorrecta.

Problemas comunes:

- Puertos en VLAN distintas o mezcla entre access y trunk
- VLAN nativa diferente, lo que bloquea la formación del canal
- Configuración de trunk aplicada solo a algunos puertos y no a todos
- Listas de VLANs permitidas diferentes entre interfaces
- Modos de negociación PAgP o LACP incompatibles (por ejemplo, un lado activo y el otro mal configurado)

Además, configurar parámetros directamente en interfaces individuales que ya pertenecen al EtherChannel puede generar inconsistencias.

*Nota: PAgP y LACP se encargan de la agregación de enlaces (EtherChannel), mientras que DTP negocia enlaces troncales. Por lo general, primero se configura EtherChannel y luego el trunk sobre el Port-Channel.*

---

### Ejemplo de solucionar problemas de EtherChannel

En la figura, las interfaces F0/1 y F0/2 en los switches S1 y S2 se conectan con un EtherChannel. Sin embargo, el EtherChannel no está operativo.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408011539.png]]

- **Paso 1: Ver la información de resumen de EtherChannel**

El comando `show etherchannel summary` permite ver el estado general del EtherChannel.

Si indica que está caído, significa que el canal no se ha formado correctamente o no está funcionando, generalmente por errores de configuración o incompatibilidad entre interfaces.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408011646.png]]

- **Paso 2: Verifique la configuración de canalización de puerto**

En la `show run | begin interface port-channel` salida, una salida más detallada indica que existen modos PAgP incompatibles configurados en los switches S1 y S2.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408011836.png]]

- **Paso 3: Corregir las configuraciones incorrectas**

Para solucionar el problema, se cambia el modo de PAgP a desirable, permitiendo que el EtherChannel negocie correctamente.

Sin embargo, no se debe modificar directamente la configuración del canal. Debido a la relación con STP, hacerlo puede provocar errores y que los puertos queden en estado bloqueado o errdisabled.

Por eso, el procedimiento correcto es:

1. Quitar la interfaz del EtherChannel
2. Volver a agregarla con la nueva configuración (`channel-group`)

Así se evitan conflictos y el canal se forma correctamente.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408011954.png]]

- **Paso 4: Verificar que EtherChannel este en funcionamiento**

El EtherChannel ahora está activo según lo verificado por la salida del `show etherchannel summary` comando.

![[Telemática II/Curso de Cisco II/Módulo 06/ANEXOS/Pasted image 20260408012127.png]]