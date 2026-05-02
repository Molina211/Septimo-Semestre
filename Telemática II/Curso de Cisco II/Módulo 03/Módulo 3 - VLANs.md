
# Módulo 3: VLANs

---

## Contenido

- **Descripción general de las VLAN:** Explica la finalidad de las VLAN en una red conmutada.

- **Redes VLAN en un entorno conmutado múltiple:** Explica como un switch reenvía tramas según la configuración de VLAN en un entorno conmutado múltiple.

- **Configuración de VLAN:** Configura un puerto para switch que se asignara a una VLAN según los requisitos.

- **Enlaces troncales de la VLAN:** Configura un puerto de enlace troncal en un switch LAN.

- **Protocolo de enlace troncal dinámico:** Configure el protocolo de enlace troncal dinámico (DTP).

---

## Descripción general de las VLAN

### Definiciones de VLAN

Las VLAN permiten segmentar una red conmutada en redes más pequeñas y fáciles de administrar. Agrupan dispositivos de forma lógica, no física, haciendo que se comuniquen como si estuvieran conectados al mismo cable. Así, usuarios de distintos departamentos pueden compartir la misma infraestructura de red sin importar el switch o la ubicación, logrando mayor flexibilidad y organización.

![](<./ANEXOS/Pasted image 20260218093329.png>)

Las VLAN permiten dividir una red en segmentos lógicos según función, proyecto o aplicación, sin depender de la ubicación física. Cada VLAN funciona como una red independiente, aunque comparta la misma infraestructura, y cualquier puerto del switch puede asignarse a una VLAN.

Dentro de una VLAN, el tráfico de unidifusión, difusión y multidifusión se mantiene solo entre sus miembros. Para comunicarse con dispositivos de otras VLAN, es necesario un dispositivo de routing. Esto evita que las difusiones lleguen a toda la red, como ocurriría en una red conmutada sin VLAN, donde todos los equipos comparten el mismo dominio de difusión.

Al crear dominios de difusión más pequeños, las VLAN mejoran el rendimiento y facilitan la seguridad y el control de acceso por grupos de usuarios. Normalmente, cada puerto del switch pertenece a una sola VLAN, con excepciones como enlaces a teléfonos IP o a otros switches.

---

### Ventajas de un diseño de VLAN

Cada VLAN corresponde a una red IP, por lo que su diseño debe considerar un direccionamiento jerárquico. Esto implica asignar las direcciones IP de forma ordenada y estructurada, reservando bloques contiguos para VLAN o áreas específicas de la red. Así, la red se administra como un todo, facilitando su organización, escalabilidad y gestión.

![](<./ANEXOS/Pasted image 20260218093719.png>)

En la tabla se enumeran las ventajas de diseñar una red con VLAN.

| Ventaja                                               | Descripción                                                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Dominios de difusión más pequeños                     | Las VLAN dividen la red en grupos más pequeños, lo que reduce la cantidad de dispositivos que reciben mensajes de difusión.  |
| Seguridad mejorada                                    | Solo los dispositivos de la misma VLAN pueden comunicarse entre sí, lo que protege la información de otros grupos.           |
| Mejora la eficiencia del departamento de IT           | Facilita la administración de la red al agrupar usuarios con funciones similares y permitir identificar las VLAN por nombre. |
| Reducción de costos                                   | Permite aprovechar mejor la red existente sin necesidad de comprar nuevos equipos costosos.                                  |
| Mejor rendimiento                                     | Al reducir el tráfico innecesario, la red funciona de forma más rápida y eficiente.                                          |
| Administración más simple de proyectos y aplicaciones | Permite separar usuarios y dispositivos según proyectos o aplicaciones, haciendo la gestión más sencilla.                    |

---

### Tipos de VLAN

Las VLAN se utilizan en las redes modernas para organizar y gestionar el tráfico. Algunas se crean según el tipo de tráfico que manejan y otras según la función específica que cumplen dentro de la red.

1. *VLAN predeterminada:*

La VLAN predeterminada en los switches Cisco es la VLAN 1. Todos los puertos del switch pertenecen a esta VLAN por defecto, y el tráfico de control de Capa 2 se asocia automáticamente a ella.

Aspectos clave de la VLAN 1:

- Todos los puertos se asignan a la VLAN 1 de forma predeterminada.

- La VLAN nativa es la VLAN 1 por defecto.

- La VLAN de administración también es la VLAN 1 por defecto.

- No se puede eliminar ni renombrar la VLAN 1.

Si no se configuran otras VLAN, todos los puertos permanecen en la VLAN 1 y esta actúa como VLAN nativa y de administración, lo que representa un riesgo de seguridad, ya que concentra todo el tráfico crítico en una sola VLAN.

![](<./ANEXOS/Pasted image 20260218100133.png>)

2. *VLAN de datos:*

Las VLAN de datos se utilizan para separar el tráfico generado por los usuarios, agrupando dispositivos según áreas, funciones o necesidades de la organización. En redes modernas suelen existir varias VLAN de datos para organizar mejor la red.  
Es importante que el tráfico de administración, voz o control de red no circule por estas VLAN, ya que deben usarse exclusivamente para el tráfico de usuarios.

3. *VLAN nativa:*

La VLAN nativa se utiliza en los enlaces troncales para transportar tráfico sin etiquetar. Normalmente, el tráfico entre switches se envía etiquetado con el ID de VLAN usando **802.1Q**, pero algunos dispositivos o situaciones generan tráfico sin etiqueta.

En los switches Cisco, ese tráfico sin etiquetar se asigna a la VLAN nativa, que por defecto es la VLAN 1. Sin embargo, por seguridad, se recomienda no usar la VLAN 1 como VLAN nativa. En su lugar, se configura una VLAN específica y sin uso como VLAN nativa y se utiliza la misma en todos los enlaces troncales, reduciendo riesgos y mejorando la organización de la red.

4. *VLAN de administración:*

La VLAN de administración es una VLAN dedicada al tráfico de gestión de red, como SSH, Telnet, HTTP/HTTPS y SNMP. Se usa para administrar y monitorear los dispositivos de red de forma segura.

En los switches de capa 2, la VLAN 1 se utiliza por defecto como VLAN de administración. Sin embargo, por buenas prácticas de seguridad, se recomienda configurar una VLAN distinta exclusivamente para la administración y no usar la VLAN 1.

5. *VLAN de voz:*

La VLAN de voz se utiliza para manejar el tráfico VoIP, separándolo del tráfico de datos para garantizar buena calidad de llamadas. Para ello, la red debe asegurar ancho de banda, prioridad en la transmisión, capacidad de enrutamiento en congestión y baja latencia (menos de 150 ms).

Por esta razón, la red se diseña específicamente para VoIP. En el ejemplo, la VLAN 150 transporta la voz, mientras que la computadora PC5 usa la VLAN 20 para datos, aunque esté conectada a través del teléfono IP, manteniendo ambos tipos de tráfico separados y optimizados.

![](<./ANEXOS/Pasted image 20260218101104.png>)

---

## Redes VLAN en un entorno conmutado múltiple

### Definición de troncos de VLAN

Los enlaces troncales de VLAN permiten que el tráfico de múltiples VLAN se transporte entre switches, haciendo posible que dispositivos en la misma VLAN, aunque estén en switches distintos, se comuniquen sin usar un router.

Un enlace troncal es un enlace punto a punto que transporta varias VLAN usando el estándar IEEE 802.1Q. No pertenece a una VLAN específica; funciona como un canal que extiende las VLAN a través de la red. En switches Cisco, todas las VLAN están permitidas por defecto en un troncal, y también puede usarse hacia routers o dispositivos con NIC compatibles con 802.1Q.

En el ejemplo, los enlaces entre S1–S2 y S1–S3 transportan las VLAN 10, 20, 30 y 99, lo que permite que la red funcione correctamente.

![](<./ANEXOS/Pasted image 20260218225200.png>)

---

### Redes sin VLAN

Cuando un switch recibe una trama de difusión, la reenvía por todos los puertos excepto el de entrada. En el ejemplo, toda la red está configurada en la misma subred 172.17.40.0/24 y no existen VLAN, por lo que se forma un único dominio de difusión. Como resultado, cuando la computadora del cuerpo docente (PC1) envía una trama de difusión, el switch S2 la propaga por todos sus puertos y toda la red recibe la difusión.

![](<./ANEXOS/Pasted image 20260218225536.png>)

---

### Red con VLAN

Al segmentar la red en dos VLAN, los dispositivos del cuerpo docente se asignan a la VLAN 10 y los de estudiantes a la VLAN 20. Así, cuando PC1 envía una trama de difusión al switch S2, el switch solo la reenvía por los puertos pertenecientes a la VLAN 10, evitando que llegue a los dispositivos de la VLAN 20.

![](<./ANEXOS/Pasted image 20260218230307.png>)

Los enlaces entre S2–S1 (F0/1) y S1–S3 (F0/3) son troncales y permiten el tráfico de todas las VLAN. Cuando una trama de difusión de la VLAN 10 llega a S1 por F0/1, este la reenvía solo por F0/3, el puerto que admite la VLAN 10. Luego, S3 la envía por F0/11, el único puerto de acceso de la VLAN 10, alcanzando únicamente a PC4 (cuerpo docente).

En general, al implementar VLAN, el tráfico de unidifusión, multidifusión y difusión se limita a los dispositivos de la misma VLAN, evitando que se propague al resto de la red.

---

### Identificación de VLAN con etiqueta (Tag)

Las tramas Ethernet normales no incluyen información de VLAN, por lo que al viajar por un enlace troncal es necesario agregarla mediante un proceso llamado etiquetado. Esto se logra usando el estándar IEEE 802.1Q, que inserta una etiqueta de 4 bytes en el encabezado de la trama para indicar a qué VLAN pertenece.

Cuando un switch recibe una trama por un puerto de acceso asignado a una VLAN, agrega la etiqueta 802.1Q, recalcula la FCS y envía la trama etiquetada por el enlace troncal.

La etiqueta VLAN (802.1Q) contiene:

- **TPID (Tipo)**: valor de 2 bytes (0x8100) que indica que la trama está etiquetada.

- **Prioridad de usuario**: 3 bits para calidad de servicio (QoS).

- **CFI**: 1 bit para compatibilidad con otros formatos.

- **VLAN ID (VID)**: 12 bits que identifican la VLAN (hasta 4096 VLAN).

Después de insertar la etiqueta, el switch vuelve a calcular la FCS para garantizar la integridad de la trama.

![](<./ANEXOS/Pasted image 20260218231151.png>)

---

### VLAN nativas y etiquetado de 802.1Q

El estándar IEEE 802.1Q define una VLAN nativa para los enlaces troncales, que por defecto es la VLAN 1.  
Toda trama sin etiqueta que llega o sale por un enlace troncal se asigna automáticamente a esta VLAN. Un ejemplo típico de tráfico sin etiquetar es el tráfico de administración entre switches.

#### VLAN nativa y tramas etiquetadas

- En switches Cisco, el tráfico de la VLAN nativa no debe ir etiquetado.

- Si un puerto troncal Cisco recibe una trama etiquetada con el mismo ID de la VLAN nativa, la descarta.

- Algunos dispositivos no Cisco (teléfonos IP, servidores, routers, otros switches) sí pueden enviar tramas etiquetadas en la VLAN nativa, por lo que es importante configurarlos correctamente para evitar problemas.

#### VLAN nativa y tramas sin etiqueta

- Si un troncal recibe tramas sin etiqueta, las envía a la VLAN nativa.
    
- La VLAN nativa define la PVID (Port VLAN ID).
    
    - Ejemplo: si la VLAN nativa es 99, la PVID = 99 y todo el tráfico sin etiqueta se reenvía a la VLAN 99.
    
    - Si no se cambia la configuración, la PVID queda en VLAN 1.
    
- Si no hay dispositivos en la VLAN nativa, las tramas sin etiqueta se descartan.

La VLAN nativa sirve para manejar el tráfico sin etiqueta en enlaces troncales; por buenas prácticas, se recomienda cambiarla de VLAN 1 a otra (como VLAN 99) y evitar enviar tráfico etiquetado por ella.

![](<./ANEXOS/Pasted image 20260218231822.png>)

La PC1 envía tráfico sin etiquetar, por lo que los switches lo asocian a la VLAN nativa del enlace troncal y lo reenvían según esa configuración. En cambio, el tráfico etiquetado que llega a la PC1 se descarta.

Este escenario representa un mal diseño de red porque:

- Se usa un hub.

- Hay un host conectado directamente a un enlace troncal.

- Obliga a que los switches tengan puertos de acceso en la VLAN nativa.

La situación explica por qué el estándar IEEE 802.1Q define la VLAN nativa: permitir compatibilidad con entornos antiguos que no soportan etiquetado de VLAN.

---

### Etiquetado de VLAN de voz

Para VoIP, se necesita una VLAN de voz separada que permita aplicar calidad de servicio (QoS) y seguridad específicas al tráfico de voz, sin mezclarlo con los datos.

Un teléfono IP de Cisco se conecta al switch y puede, a su vez, conectar una PC. El puerto del switch se configura con dos VLAN:

- **VLAN de voz**: transporta el tráfico del teléfono.

- **VLAN de datos**: transporta el tráfico de la PC.

El enlace switch–teléfono funciona como un troncal, llevando ambas VLAN.

El teléfono IP Cisco incluye un switch interno 10/100 de tres puertos:

1. **Puerto 1**: conecta al switch (o a otro dispositivo VoIP).

2. **Puerto 2**: interfaz interna para el tráfico del teléfono.

3. **Puerto 3**: conecta la PC (puerto de acceso).

El switch usa CDP para indicar al teléfono cómo enviar el tráfico de voz, que normalmente va etiquetado con prioridad CoS de Capa 2 para asegurar buena calidad.

**Ejemplo**: la PC5 (datos) está en la VLAN 20, conectada al teléfono IP; el tráfico de voz viaja por la VLAN 150. Así, voz y datos se mantienen separados y optimizados.

![](<./ANEXOS/Pasted image 20260218232239.png>)

---

### Ejemplo de verificación de VLAN de voz

El comando **`show interface fa0/18 switchport`** permite verificar cómo está configurado un puerto del switch a nivel de VLAN y modo de operación.

En la salida mostrada, se observa que la interfaz FastEthernet 0/18 (F0/18) está configurada para trabajar con dos VLAN diferentes:

- **VLAN 20 (datos)**: es la VLAN de acceso asociada al tráfico de la PC conectada al teléfono IP.

- **VLAN 150 (voz)**: es la VLAN dedicada al tráfico de voz generado por el teléfono IP.

Esto indica que el puerto está preparado para soportar VoIP, ya que:

- El tráfico de datos se maneja como en un puerto de acceso normal (VLAN 20).

- El tráfico de voz se envía por una VLAN especial (VLAN 150), generalmente etiquetada y priorizada para garantizar calidad de llamada.

En la práctica, aunque el puerto se configure como acceso, funciona de forma similar a un enlace troncal entre el switch y el teléfono IP, permitiendo transportar simultáneamente voz y datos sin mezclarlos.

![](<./ANEXOS/Pasted image 20260218232445.png>)

---

## Configuración de VLAN 

### Rangos de VLAN en los switches Catalyst

Crear VLAN en un switch Cisco consiste simplemente en ingresar los comandos adecuados para configurarlas y luego verificar su funcionamiento.

Los switches Cisco Catalyst admiten una gran cantidad de VLAN, suficiente para la mayoría de las redes empresariales. Por ejemplo, los modelos Catalyst 2960 y 3560 pueden manejar más de 4000 VLAN.

Las VLAN se dividen en dos rangos:

- **VLAN de rango normal:** van desde la 1 hasta la 1005 y son las más usadas en redes comunes.

- **VLAN de rango extendido:** van desde la 1006 hasta la 4094 y se utilizan en redes más grandes o con necesidades especiales.

En un switch Catalyst 2960 que ejecuta IOS de Cisco versión 15.x, estas VLAN están disponibles y listas para ser configuradas según las necesidades de la red.

![](<./ANEXOS/Pasted image 20260221114043.png>)

**VLAN de Rango Normal**

- Se usan en redes pequeñas y medianas y en la mayoría de empresas.

- Sus ID van de 1 a 1005.

- Las VLAN 1002 a 1005 están reservadas para tecnologías antiguas como Token Ring y FDDI.

- Las VLAN 1 y 1002–1005 se crean automáticamente y no se pueden eliminar.

- Su configuración se guarda en el archivo **`vlan.dat`**, almacenado en la memoria flash del switch.

- El protocolo VTP permite sincronizar automáticamente las VLAN entre switches.

**VLAN de Rango Extendido**

- Se usan en redes muy grandes o por proveedores de servicios que manejan muchos clientes.

- Sus ID van de 1006 a 4094.

- La configuración se guarda en el archivo de configuración en ejecución (_running-config_).

- Tienen menos funcionalidades que las VLAN de rango normal.

- Requieren que VTP esté en modo transparente para poder funcionar.

*Nota importante*

- El número máximo de VLAN posibles es 4096, porque el campo VLAN ID tiene 12 bits en el encabezado del estándar IEEE 802.1, usado por equipos como los switches Cisco Catalyst.

---

### Comandos de creación de VLAN

Al crear VLAN de rango normal, la información se guarda automáticamente en el archivo **`vlan.dat`**, que está en la memoria flash del switch y no se pierde al reiniciar, por lo que no es necesario usar `copy running-config startup-config` solo para las VLAN.

Sin embargo, como normalmente se configuran otras opciones del switch al mismo tiempo, se recomienda guardar la configuración completa para no perder cambios adicionales.

Para crear una VLAN en Cisco IOS, se usa un comando específico que permite agregar la VLAN y asignarle un nombre, y es buena práctica nombrar todas las VLAN para facilitar la administración y comprensión de la red.

| Tarea                                                 | Comando de IOS                        |
| ----------------------------------------------------- | ------------------------------------- |
| Ingresa al modo de configuración global.              | `Switch# configure terminal`          |
| Cree una VLAN con un número de ID válido.             | `Switch(config)# vlan vlan-id`        |
| Especificar un nombre único para identificar la VLAN. | `Switch(config-vlan)# name vlan-name` |
| Vuelva al modo EXEC privilegiado.                     | `Switch(config-vlan)# end`            |

---

### Ejemplo de creación de VLAN

En el ejemplo de topología, la computadora del estudiante (PC2) todavía no se asoció a ninguna VLAN, pero tiene la dirección IP 172.17.20.22, que pertenece a la VLAN 20.

![](<./ANEXOS/Pasted image 20260221114557.png>)

En la figura, se muestra cómo se configura la VLAN para estudiantes (VLAN 20) en el switch S1.

![](<./ANEXOS/Pasted image 20260221114619.png>)

El comando `vlan vlan-id` permite crear una o varias VLAN al mismo tiempo.  
Se pueden especificar:

- VLAN individuales, separadas por comas

- Rangos de VLAN, usando guiones

Por ejemplo, el comando `vlan 100,102,105-107` crea las VLAN 100, 102, 105, 106 y 107, lo que facilita y acelera la configuración del switch.

---

### Comandos de asignación de puertos VLAN

Después de crear una VLAN, se deben asignar los puertos del switch a esa VLAN.  
Para ello, se configura el puerto como puerto de acceso y se le asigna la VLAN correspondiente.

El comando **`switchport mode access`** es opcional, pero muy recomendado por seguridad, ya que fuerza al puerto a funcionar solo como puerto de acceso, evitando que negocie como troncal.  
Así se garantiza que el puerto quede permanentemente asociado a una única VLAN.

| Tarea                                         | Comando de IOS                                      |
| --------------------------------------------- | --------------------------------------------------- |
| Ingrese al modo de configuración global.      | `Switch# configure terminal`                        |
| Ingrese el modo de configuración de interfaz. | `Switch(config)# interface interface-id`            |
| Establezca el puerto en modo de acceso.       | `Switch(config-if)# switchport mode access`         |
| Asigne el puerto a una VLAN.                  | `Switch(config-if)# switchport access vlan vlan-id` |
| Vuelva al modo EXEC privilegiado.             | `Switch(config-if)# end`                            |

*Nota:* Use el `interface range` comando para configurar simultáneamente varias interfaces.

---

### Ejemplo de asignación de puerto VLAN

En la figura, el puerto F0/6 en el conmutador S1 se configura como un puerto de acceso y se asigna a la VLAN 20. Cualquier dispositivo conectado a ese puerto está asociado con la VLAN 20. Por lo tanto, en nuestro ejemplo, PC2 está en la VLAN 20.

![](<./ANEXOS/Pasted image 20260221114952.png>)

El ejemplo muestra la configuración de S1 para asignar F0/6 a VLAN 20.

![](<./ANEXOS/Pasted image 20260221115003.png>)

Las VLAN se configuran en el puerto del switch y no en el terminal. La PC2 se configura con una dirección IPv4 y una máscara de subred asociadas a la VLAN, que se configura en el puerto de switch. En este ejemplo, es la VLAN 20. Cuando se configura la VLAN 20 en otros switches, el administrador de red debe configurar las otras computadoras de alumnos para que estén en la misma subred que la PC2 (172.17.20.0/24).

---

### VLAN de voz, datos

Un puerto de acceso normalmente pertenece a una sola VLAN, pero puede manejar dos VLAN cuando se conecta a un teléfono IP:

- Una VLAN de datos para la PC.

- Una VLAN de voz para el tráfico VoIP.

En el ejemplo, la PC5 se conecta al teléfono IP de Cisco, y este al puerto FastEthernet 0/18 del switch S3.  
Para que esta conexión funcione correctamente, se configuran una VLAN de datos y una VLAN de voz en ese mismo puerto.

![](<./ANEXOS/Pasted image 20260221121055.png>)

---

### Ejemplo de VLAN de voz y datos

Para configurar voz sobre IP (VoIP) en un switch, se siguen estos pasos clave:

1. **Asignar una VLAN de voz al puerto**  
    Con el comando `switchport voice vlan vlan-id`, se indica que el puerto usará una VLAN exclusiva para el tráfico de voz, separada de la VLAN de datos.
    
2. **Habilitar Calidad de Servicio (QoS)**  
    En redes con tráfico de voz, es fundamental activar QoS para garantizar buena calidad en llamadas.  
    El comando `mls qos trust ...` le indica al switch que confíe en las etiquetas de prioridad que vienen en los paquetes (por ejemplo, CoS) para clasificar y priorizar el tráfico de voz.
    
3. **Configuración del ejemplo**
    
    - Se crean dos VLAN:
        
        - VLAN 20 → datos (PC)
            
        - VLAN 150 → voz (teléfono IP)
            
    - El puerto FastEthernet 0/18 del switch S3 se configura como:
        
        - Puerto de acceso en VLAN 20 para datos.
            
        - Puerto con VLAN 150 para tráfico de voz.
            
    - El switch confía en la Clase de Servicio (CoS) que asigna el teléfono IP, permitiendo que el tráfico de voz tenga mayor prioridad que otros tipos de tráfico.

![](<./ANEXOS/Pasted image 20260221121349.png>)

El comando **`switchport access vlan`** crea automáticamente una VLAN si esta no existe en el switch.  
Por ejemplo, si la VLAN 30 no aparece en la salida de `show vlan brief` y se configura un puerto con `switchport access vlan 30`, el switch crea la VLAN 30 de forma automática y asigna ese puerto a dicha VLAN, sin necesidad de crearla previamente de manera manual.

![](<./ANEXOS/Pasted image 20260221121511.png>)

---

### Verificar la información de la VLAN

Una vez creadas las VLAN, se pueden verificar y validar usando comandos `show` en Cisco IOS.

El comando principal es `show vlan`, que muestra todas las VLAN configuradas en el switch.  
Además, permite usar opciones para obtener información más específica:

- `show vlan brief`: muestra un resumen rápido, con las VLAN y los puertos asignados.

- `show vlan id vlan-id`: muestra información solo de una VLAN específica.

- `show vlan name vlan-name`: muestra la información de una VLAN según su nombre.

- `show vlan summary`: muestra un resumen general, como la cantidad de VLAN existentes.

Estos comandos ayudan a confirmar que las VLAN fueron creadas correctamente y que los puertos están asignados como se esperaba.

| Tarea                                                                                                                  | Opción de comando |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Muestra el nombre de VLAN, el estado y sus puertos una VLAN por línea.                                                 | `brief`           |
| Muestra información sobre el número de ID de VLAN identificado. Para vlan-id, el rango es 1 a 4094.                    | `id vlan-id`      |
| Muestra información sobre el número de ID de VLAN identificado. El vlan-name es una cadena ASCII de 1 a 32 caracteres. | `name vlan-name`  |
| Mostrar el resumen de información de la VLAN.                                                                          | `summary`         |

El show vlan summary comando muestra la lista de todas las VLAN configuradas.

![](<./ANEXOS/Pasted image 20260221121825.png>)

Existen otros comandos útiles para verificar la configuración de VLAN en un switch.  
El comando **`show interfaces interface-id switchport`** permite comprobar cómo está configurado un puerto específico. Por ejemplo, **`show interfaces fa0/18 switchport`** confirma si el puerto FastEthernet 0/18 está asignado correctamente a la VLAN de datos y a la VLAN de voz.

Por su parte, el comando **`show interfaces vlan vlan-id`** muestra el estado y la información de una VLAN específica.

![](<./ANEXOS/Pasted image 20260221122250.png>)

---

### Cambio de pertenencia de puertos de una VLAN

Cambiar la VLAN de un puerto de acceso es un proceso sencillo.  
Si un puerto fue asignado a una VLAN incorrecta, basta con volver a ejecutar el comando `switchport access vlan vlan-id` con el ID correcto. Por ejemplo, para mover el puerto Fa0/18 a la VLAN 20, se usa `switchport access vlan 20`.

Si se desea que el puerto vuelva a la VLAN 1 predeterminada, se utiliza el comando `no switchport access vlan`, lo que elimina la asignación manual.  
La configuración final se puede verificar con el comando `show vlan brief`, que muestra a qué VLAN pertenece cada puerto.

![](<./ANEXOS/Pasted image 20260221122651.png>)

La VLAN 20 permanece activa en el switch aunque no tenga puertos asignados, ya que las VLAN no se eliminan automáticamente cuando dejan de usarse.  
Para confirmar que el puerto F0/18 fue restablecido a la VLAN 1 predeterminada, se puede usar el comando **`show interfaces f0/18 switchport`**, el cual muestra que la VLAN de acceso de esa interfaz ahora es la VLAN 1.

![](<./ANEXOS/Pasted image 20260221122739.png>)

---

### Eliminar las VLAN

- Para eliminar una VLAN específica, se usa el comando `no vlan vlan-id`, que la borra del archivo `vlan.dat` del switch.

- Antes de borrar una VLAN, es obligatorio reasignar sus puertos a otra VLAN activa; de lo contrario, esos puertos quedarán sin comunicación hasta que se les asigne una VLAN válida.

	- Si se desea eliminar todas las VLAN configuradas, se puede borrar el archivo completo con `delete flash:vlan.dat` (o `delete vlan.dat`). Tras reiniciar el switch, se perderán todas las VLAN creadas y el switch quedará con la configuración de VLAN por defecto. 

- Para restaurar completamente el switch a estado de fábrica en cuanto a VLAN y configuración:
    
    1. Desconectar todos los cables excepto consola y energía.
        
    2. Ejecutar **`erase startup-config`**.
        
    3. Ejecutar **`delete vlan.dat`**.
        

Esto asegura que no queden configuraciones previas de VLAN ni ajustes guardados.

---

## Enlaces troncales de la VLAN

Una vez configuradas y verificadas las VLAN, el siguiente paso es configurar y comprobar los enlaces troncales. Un troncal VLAN permite que por un mismo enlace circule el tráfico de todas las VLAN existentes. Esto evita tener que usar un enlace físico por cada VLAN.

De forma predeterminada, el troncal transporta todas las VLAN, aunque es posible restringir cuáles VLAN pueden pasar, ya sea mediante una configuración manual o dinámica, para mejorar el control y la seguridad de la red.

Para que un enlace funcione como troncal, es necesario configurar los puertos que conectan los switches utilizando comandos específicos de configuración de interfaz. Estos comandos habilitan el modo troncal y permiten el etiquetado del tráfico VLAN, asegurando que los datos lleguen correctamente a su VLAN correspondiente en el otro switch.

| Tarea | Comando de IOS |
|------|----------------|
| Ingrese al modo de configuración global. | `Switch# configure terminal` |
| Ingrese el modo de configuración de interfaz. | `Switch(config)# interface interface-id` |
| Establezca el puerto en modo de enlace troncal permanente. | `Switch(config-if)# switchport mode trunk` |
| Cambie la configuración de la VLAN nativa a otra opción que no sea VLAN 1. | `Switch(config-if)# switchport trunk native vlan vlan-id` |
| Especifique la lista de VLAN que se permitirán en el enlace troncal. | `Switch(config-if)# switchport trunk allowed vlan vlan-list` |
| Vuelva al modo EXEC privilegiado. | `Switch(config-if)# end` |

---

### Ejemplo de configuración de troncal

En la figura 2, las VLAN 10, 20 y 30 admiten las computadoras de Cuerpo docente, Estudiante e Invitado (PC1, PC2 y PC3). El puerto F0/1 del switch S1 se configuró como puerto de enlace troncal y reenvía el tráfico para las VLAN 10, 20 y 30. La VLAN 99 se configuró como VLAN nativa.

![](<./ANEXOS/Pasted image 20260301130113.png>)

El ejemplo muestra la configuración del puerto F0/1 en el conmutador S1 como puerto troncal. La VLAN nativa se cambia a VLAN 99 y la lista de VLAN permitidas se restringe a 10, 20, 30 y 99.

![](<./ANEXOS/Pasted image 20260301130315.png>)

Los switches Cisco Catalyst 2960 configuran automáticamente la encapsulación 802.1Q en enlaces troncales. Es importante que ambos extremos del troncal tengan la misma VLAN nativa, ya que una configuración diferente genera errores en el IOS de Cisco.

---

### Verifique la configuración de enlaces troncales.

La salida del switch muestra la configuración del puerto del switch F0/1 en el switch S1. La configuración se verifica con el `show interfaces` comando `switchport interface-ID`.

![](<./ANEXOS/Pasted image 20260301130743.png>)

En el área superior resaltada, se muestra que el modo administrativo del puerto F0/1 se estableció en trunk. El puerto está en modo de enlace troncal. En la siguiente área resaltada, se verifica que la VLAN nativa es la VLAN 99. Más abajo en el resultado, en el área inferior resaltada, se muestra que las VLAN 10,20,30 y 99 están habilitadas en el enlace troncal.

---

### Restablecimiento del enlace troncal al estado predeterminado

Para restablecer un enlace troncal a su configuración predeterminada, se utilizan los comandos `no switchport trunk allowed vlan` y `no switchport trunk native vlan`.

Al aplicarlos:

- Se elimina cualquier restricción de VLAN permitidas, haciendo que el troncal permita todas las VLAN.
    
- La VLAN nativa vuelve a ser la VLAN 1, que es el valor por defecto.

![](<./ANEXOS/Pasted image 20260301131052.png>)

El comando `show interfaces fa0/1 switchport` revela que la troncal se ha reconfigurado a un estado predeterminado.

![](<./ANEXOS/Pasted image 20260301131122.png>)

La figura muestra el resultado de los comandos utilizados para eliminar la característica de enlace troncal del puerto F0/1 del switch S1. El `show interfaces f0/1 switchport` comando revela que la interfaz F0/1 ahora está en modo de acceso estático.

![](<./ANEXOS/Pasted image 20260301131410.png>)

---

## Protocolo de enlace troncal dinámico

Algunos switches Cisco usan un protocolo propio llamado DTP (Dynamic Trunking Protocol) que sirve para negociar automáticamente si un enlace debe ser troncal entre dos dispositivos. Esto facilita la configuración porque el switch puede decidir solo si usar trunk o no.

DTP:

- Funciona solo entre dispositivos Cisco.
    
- Solo trabaja en enlaces punto a punto.
    
- Está activado por defecto en switches como Catalyst 2960 y 3560.
    
- Solo negocia correctamente si ambos lados soportan DTP.

Los dispositivos que no son Cisco no entienden DTP y pueden causar errores si reciben estas tramas. Por eso, no se recomienda usar DTP con equipos de otros fabricantes.

Si conectas un switch Cisco a un dispositivo que no soporta DTP, debes:

- Forzar el puerto como troncal con `switchport mode trunk`
    
- Desactivar la negociación automática con `switchport nonegotiate`

Así:

- El enlace será troncal fijo
    
- No se enviarán tramas DTP
    
- Se evitan errores de configuración

![](<./ANEXOS/Pasted image 20260301132442.png>)

Para volver a habilitar el protocolo de enlace troncal dinámico, utilice el `switchport mode dynamic auto` comando.

![](<./ANEXOS/Pasted image 20260301141445.png>)

Si un puerto se configura con `switchport mode trunk` y `switchport nonegotiate`, ignora DTP y permanece siempre como enlace troncal activo.

En cambio, si los puertos están en modo dinámico automático, no se negocia el troncal y el enlace queda como puerto de acceso, lo que provoca un troncal inactivo entre switches.

---

### Modos de interfaz negociados 

El `switchport mode` comando tiene opciones adicionales para negociar el modo de interfaz. La siguiente es la sintaxis del comando :

| Opción                | Descripción                                                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **access**            | - Configura el puerto como puerto de acceso (no troncal).<br>- Nunca será troncal, aunque el puerto vecino sí lo sea.<br>- Se usa normalmente para conectar PCs, impresoras o dispositivos finales.                                                     |
| **dynamic auto**      | - El puerto espera a que el dispositivo vecino solicite un enlace troncal.<br>- Solo se vuelve troncal si el vecino está en trunk o dynamic desirable.<br>- Es el modo predeterminado en switches Cisco.<br>- Puede causar enlaces troncales inactivos. |
| **dynamic desirable** | - El puerto intenta activamente convertirse en troncal usando DTP.<br>- Se vuelve troncal si el vecino está en auto, desirable o trunk.<br>- Facilita la negociación automática, pero no es el modo más seguro.                                         |
| **trunk**             | - Fuerza el puerto a ser troncal permanente.<br>- El enlace troncal está siempre activo, sin ambigüedades.<br>- Se recomienda para enlaces entre switches.<br>- Puede combinarse con `switchport nonegotiate` para mayor seguridad.                     |
En pocas palabras:

- **access:** puerto no troncal, solo para una VLAN.
- **dynamic auto:** espera que el vecino solicite el troncal; puede quedar inactivo.
- **dynamic desirable:** intenta negociar el troncal automáticamente.
- **trunk:** puerto troncal fijo y siempre activo (recomendado entre switches).

---

### Resultados de una configuración DTP

La tabla ilustra los resultados de las opciones de configuración DTP en extremos opuestos de un enlace troncal conectado a los puertos del switch Catalyst 2960. Una buena practica es configurar los enlaces troncales estáticamente siempre que sea posible.

|                         | Dinámico automático | Dinámico deseado |        Troncal        |        Acceso         |
| ----------------------- | :-----------------: | :--------------: | :-------------------: | :-------------------: |
| **Dinámico automático** |       Acceso        |     Troncal      |        Troncal        |        Acceso         |
| **Dinámico deseado**    |       Troncal       |     Troncal      |        Troncal        |        Acceso         |
| **Troncal**             |       Troncal       |     Troncal      |        Troncal        | Conectividad limitada |
| **Acceso**              |       Acceso        |      Acceso      | Conectividad limitada |        Acceso         |

---

### Verificación del modo de DTP

El modo DTP predeterminado depende de la versión del software Cisco IOS y de la plataforma. Para determinar el modo DTP actual, ejecute el `show dtp interface` comando como se muestra en la salida.

![](<./ANEXOS/Pasted image 20260301142558.png>)

*Nota: Una mejor práctica general cuando se requiere un enlace troncal es establecer la interfaz en `trunk` y `nonegotiate` cuando se necesita un enlace troncal. Se debe inhabilitar DTP en los enlaces cuando no se deben usar enlaces troncales*.
