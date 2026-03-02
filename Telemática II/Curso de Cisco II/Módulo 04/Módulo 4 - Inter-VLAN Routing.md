# Módulo 4: Inter-VLAN Routing

---

## Contenido

- **Funcionamiento del inter-VLAN routing:** Describir las opciones para configurar inter-VLAN routing.

- **Router-on-a-Stick Inter-VLAN Routing:** Configurar router-on-a-Stick inter-VLAN Routing.

- **Inter-VLAN Routing usando switches de capa 3:** Configurar inter-VLAN routing mediante un switch de capa 3.

- **Solución de problemas de Inter-VLAN Routing:** Solución de problemas comunes de configuración de inter-VLAN

---

## Funcionamiento de Inter-VLAN Routing

### ¿Qué es Inter-VLAN Routing?

Las VLAN permiten segmentar redes de capa 2, pero los dispositivos de distintas VLAN no pueden comunicarse sin enrutamiento de capa 3.  
El inter-VLAN routing permite esa comunicación y puede implementarse de tres formas:

- **Inter-VLAN heredado:** solución antigua y poco escalable.
    
- **Router-on-a-stick:** adecuada para redes pequeñas y medianas.
    
- **Switch de capa 3 con SVIs:** la opción más eficiente y escalable para redes medianas y grandes.

La elección depende del tamaño y los requerimientos de la red.

---

### Inter-VLAN Routing heredado

La primera solución de inter-VLAN routing utilizaba un router con múltiples interfaces Ethernet, donde cada interfaz se conectaba a una VLAN diferente del switch. Cada interfaz del router actuaba como gateway predeterminado para los hosts de su VLAN.
Por ejemplo, consulte la topología donde R1 tiene dos interfaces conectadas al switch S1.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301201713.png)

Observe que en el ejemplo la tabla de direcciones MAC de S1 se completa de la siguiente manera:

- El puerto Fa0/1 está asignado a la VLAN 10 y está conectado a la interfaz R1 G0/0/0.
- El puerto Fa0/11 está asignado a la VLAN 10 y está conectado a la PC1.
- El puerto Fa0/12 está asignado a la VLAN 20 y está conectado a la interfaz R1 G0/0/1.
- El puerto Fa0/24 está asignado a la VLAN 20 y está conectado a la PC2.

---

**Tabla de direcciones MAC para S1**

| Puerto | Dirección MAC | VLAN |
| ------ | ------------- | ---- |
| F0/1   | R1 G0/0/0 MAC | 10   |
| F0/11  | PC1 MAC       | 10   |
| F0/12  | R1 G0/0/1 MAC | 20   |
| F0/24  | PC2 MAC       | 20   |
Cuando PC1 quiere comunicarse con PC2 en otra VLAN, envía el paquete a su gateway. El router (R1) recibe el paquete por una interfaz, analiza el destino y lo envía por otra interfaz hacia la VLAN correspondiente, hasta que el switch lo entrega a PC2.

Este método de inter-VLAN routing heredado funciona, pero tiene un problema importante: no es escalable. Cada VLAN necesita una interfaz física dedicada en el router, y los routers tienen un número limitado de interfaces. Si hay muchas VLAN, el router se queda sin puertos rápidamente.

Por eso, este método ya no se usa en redes modernas y solo se estudia con fines educativos.

---

### Router-on-a-Stick Inter-VLAN Routing

El método router-on-a-stick permite que un solo puerto físico del router enrute el tráfico entre varias VLAN, evitando el problema del método heredado.

Esto se logra conectando el router al switch mediante un enlace troncal 802.1Q. En lugar de usar varias interfaces físicas, el router crea subinterfaces virtuales, una para cada VLAN.  
Cada subinterfaz tiene:

- Su propia dirección IP
    
- Una VLAN asignada
    
- Su subred correspondiente

Cuando un paquete llega al router con una etiqueta VLAN, el router lo envía a la subinterfaz correcta, decide a qué VLAN debe ir y lo devuelve por el mismo puerto físico, etiquetado con la nueva VLAN.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301204646.png)

Como se ve en la animación, PC1 en la VLAN 10 se comunica con PC3 en la VLAN 30. El router R1 acepta el tráfico de unidifusión etiquetado en la VLAN 10 y lo enruta a la VLAN 30 mediante sus subinterfaces configuradas. El switch S2 elimina la etiqueta de la VLAN de la trama de unidifusión y reenvía la trama a PC3 en el puerto F0/23.

*Nota: El método router-on-a-stick de inter-VLAN routing no escala mas allá de 50 VLANs.

---

### Inter-VLAN Routing en un switch de capa 3

El método moderno de inter-VLAN routing usa switches de capa 3, también llamados switches multicapa.

Estos switches crean interfaces virtuales (SVI), una por cada VLAN. Cada SVI tiene una dirección IP y funciona como puerta de enlace para los dispositivos de esa VLAN.

Así, el propio switch puede enrutar el tráfico entre VLANs sin necesidad de un router externo, lo que hace la red más rápida, simple y escalable.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301210556.png)

Los SVI se configuran en un switch de capa 3 para VLAN que ya existen y funcionan como lo haría una interfaz de router, actuando como gateway y manejando el enrutamiento de capa 3 para todos los dispositivos de esa VLAN.

**Ventajas del switch de capa 3 para inter-VLAN routing:**

- Es más rápido que router-on-a-stick porque el routing se hace por hardware.
    
- No necesita un router ni enlaces externos.
    
- Permite mayor ancho de banda usando enlaces troncales y EtherChannel.
    
- Tiene menor latencia, ya que el tráfico no sale del switch.
    
- Es muy usado en LAN de campus.

**Desventaja:**

- Su costo es más alto que otras soluciones.

---

## Routing entre VLAN con router-on-a-stick

Este tema explica cómo configurar inter-VLAN routing con router-on-a-stick. En esta topología, el router se conecta al switch mediante un enlace troncal, ubicado en el borde de la red, lo que da origen a su nombre.

La interfaz del router se conecta a un puerto troncal del switch, y los switches entre sí también usan enlaces troncales, permitiendo que el tráfico de múltiples VLAN circule dentro de la red y entre VLANs usando una sola interfaz física del router.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301224428.png)

Para enrutar entre VLAN, la interfaz R1 GigabitEthernet 0/0/1 se divide lógicamente en tres subinterfaces, como se muestra en la tabla. La tabla también muestra las tres VLAN que se configurarán en los switches.

**Router R1 Subinterfaces**

| subinterfaz | VLAN | Dirección IP    |
| ----------- | ---- | --------------- |
| G0/0/1.10   | 10   | 192.168.10.1/24 |
| G0/0/1.20   | 20   | 192.168.20.1/24 |
| G0/0/1.99   | 99   | 192.168.99.1/24 |
Suponga que R1, S1 y S2 tienen configuraciones básicas iniciales. Actualmente, PC1 y PC2 no pueden ping entre sí porque están en redes separadas. Sólo S1 y S2 pueden ping uno al otro, pero son inalcanzables por PC1 o PC2 porque también están en diferentes redes.

Para permitir que los dispositivos se hagan ping entre sí, los switches deben configurarse con VLAN y trunking, y el router debe configurarse para el inter-VLAN routing.

---

### S1 VLAN and configuraciones de enlaces troncales

Complete los siguientes pasos para configurar S1 con VLAN y trunking:

**Paso 1**. Crear y nombrar las VLANs.

**Paso 2**. Crear la interfaz de administración

**Paso 3**. Configurar puertos de acceso.

**Paso 4**. Configurar puertos de enlace troncal.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301224838.png)

#### Paso 1 - Crear y nombrar las VLANs

En primer lugar, las VLAN se crean y nombran. Las VLAN sólo se crean después de salir del modo de subconfiguración de VLAN.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301225058.png)

#### Paso 2 - Crear la interfaz de administración

A continuación, se crea la interfaz de administración en VLAN 99 junto con el default gateway de R1.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301225135.png)

#### Paso 3 - Configurar puertos de acceso

A continuación, el puerto Fa0/6 que se conecta a PC1 se configura como un puerto de acceso en la VLAN 10. Supongamos que PC1 se ha configurado con la dirección IP correcta y el default gateway.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301225226.png)

#### Paso 4 - Configurar puertos de enlace troncal

Por último, los puertos Fa0/1 que se conectan a S2 y Fa05 que se conectan a R1 se configuran como puertos troncal.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301225302.png)

---

### S2 VLAN y configuraciones de enlaces troncales

La configuración para S2 es similar a S1.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301225343.png)

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301225349.png)

---

### Configuración de subinterfaces de R1

En router-on-a-stick, el router necesita una subinterfaz por cada VLAN que vaya a enrutar.

Una subinterfaz es una interfaz virtual que se crea sobre una sola interfaz física del router. Se nombra usando la interfaz física seguida de un punto y un número (por ejemplo, `G0/0/1.10`). Normalmente, ese número coincide con el ID de la VLAN para facilitar la identificación.

Cada subinterfaz se configura con:

- **`encapsulation dot1q vlan_id`** → indica a qué VLAN pertenece el tráfico.
    
- **`ip address`** → asigna la IP que actúa como gateway para esa VLAN.

Este proceso se repite para cada VLAN (por ejemplo VLAN 10, 20 y 99), y cada una debe tener una subred distinta para que el enrutamiento funcione.

Finalmente, se debe activar la interfaz física con `no shutdown`, ya que si esta está apagada, todas las subinterfaces también lo estarán.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301230302.png)

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301230309.png)

---

### Verificar la conectividad entre PC1 y PC2

La configuración de router-on-a-stick se completa al configurar los enlaces troncales del switch y las subinterfaces del router.

Para verificar que funciona:

- Desde un host, primero revise su configuración IP con `ipconfig`.
    
- Luego, use el comando **`ping`** para comprobar la conectividad con un host de otra VLAN.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301230928.png)

El resultado confirma la dirección IPv4 y el default gateway de PC1. A continuación, utilice `ping` para verificar la conectividad con PC2 y S1, como se muestra en la figura. El `ping` resultado confirma correctamente que el enrutamiento entre VLANs está funcionando.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301231015.png)

---

### Verificación de Router-on-a-Stick Inter-VLAN Routing

Además de utilizar `ping` entre dispositivos, se pueden utilizar los siguientes `show` comandos para verificar y solucionar problemas de la configuración del router-on-a-stick.

- `show ip route`
- `show ip interface brief`
- `show interfaces`
- `show interfaces trunk`


1. **Show ip route**

Se verifica la configuración usando el comando **`show ip route`** en el router.  
La presencia de rutas conectadas (C) con sus subinterfaces correspondientes confirma que las VLAN, subredes y subinterfaces están correctamente configuradas y activas.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301231552.png)


2. **Show ip interface brief**

Otro comando útil del router es `show ip interface brief`, como se muestra en el resultado. El resultado confirma que las subinterfaces tienen configurada la dirección IPv4 correcta y que están operativas.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301231723.png)


3. **Show interfaces**

Las subinterfaces se pueden verificar mediante el comando `show interfaces subinterface-id`, como se muestra.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301231817.png)

4. **Show interfaces trunk**

También es importante verificar que el puerto troncal del switch esté bien configurado.  
Con el comando **`show interfaces trunk`** se comprueba que el enlace hacia el router esté funcionando como troncal y transportando las VLAN necesarias.

Aunque la VLAN 1 no se configure de forma explícita, aparece automáticamente porque el tráfico de control siempre se envía por la VLAN 1 en los enlaces troncales.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301231911.png)

---

## Inter-VLAN Routing usando switches de capa 3

En redes empresariales grandes, el método router-on-a-stick casi no se usa porque no escala bien y puede volverse lento. Aunque es fácil de implementar y funciona bien en redes pequeñas y medianas, no cumple con las necesidades de alto tráfico de una empresa grande.

Por eso, las LAN de campus empresariales usan switches de capa 3, que hacen el enrutamiento entre VLANs directamente por hardware, logrando mayor velocidad y menor latencia que un router.

Un switch de capa 3 puede:

- Enrutar tráfico entre VLANs usando SVIs (una interfaz virtual por VLAN).
    
- Convertir un puerto de capa 2 en un puerto de capa 3, similar a una interfaz de router.

Para que el inter-VLAN routing funcione, se crea un SVI por cada VLAN, usando el comando `interface vlan`, y cada SVI actúa como gateway para su VLAN.

---

### Escenario de switch de capa 3

En la figura, el switch de capa 3, D1, está conectado a dos hosts en diferentes VLAN. PC1 está en VLAN 10 y PC2 está en VLAN 20, como se muestra. El switch de capa 3 proporcionará servicios inter-VLAN routing a los dos hosts.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260301232346.png)

La tabla muestra las direcciones IP de cada VLAN.

**D1 VLAN IP Addresses**

| VLAN Interface | Dirección IP    |
|----------------|-----------------|
| 10             | 192.168.10.1/24 |
| 20             | 192.168.20.1/24 |

---

### Configuración de switch de capa 3

Complete los siguientes pasos para configurar S1 con VLAN y trunking :

**Paso 1**. Crear las VLAN.

**Paso 2**. Crear las interfaces VLAN SVI.

**Paso 3**. Configurar puertos de acceso.

**Paso 4**. Habilitar IP routing.

#### Paso 1 - Crear las VLAN

Primero, cree las dos VLAN como se muestra en el ejemplo.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302001232.png)

#### Paso 2 - Crear las interfaces VLAN SVI

Configurar el SVI para VLANs 10 y 20 Las direcciones IP configuradas servirán como `default gateways` para los hosts de las VLAN respectivas. Observe que los mensajes informativos que muestran el protocolo de línea en ambos SVIs cambiaron a funcionales.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302001404.png)

#### Paso 3 - Configurar puertos de acceso

A continuación, configure los puertos de acceso que se conectan a los hosts y asígnelos a sus respectivas VLAN.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302001452.png)

#### Paso 4 - Habilitar IP routing

Por último, habilite el enrutamiento IPv4 con el comando de configuración `ip routing` global para permitir el intercambio de tráfico entre las VLAN 10 y 20. Este comando debe configurarse para habilitar el inter-VAN routing en un switch de capa 3 para IPv4.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302001617.png)

---

### Verificación Inter-VLAN Routing del switch de capa 3

El inter-VLAN routing con un switch de capa 3 es más simple que con router-on-a-stick.  
Una vez configurado, se verifica fácilmente desde los hosts:

1. Primero se revisa la configuración IP del host con `ipconfig`, para confirmar su dirección IPv4 y gateway.
    
2. Luego se usa **`ping`** hacia un host de otra VLAN.

Si el `ping` responde, significa que el enrutamiento entre VLANs está funcionando correctamente.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302001756.png)

A continuación, verifique la conectividad con PC2 mediante el comando host de `ping` Windows, como se muestra en el ejemplo. El `ping` resultado confirma correctamente que el enrutamiento entre VLANs está funcionando.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302001824.png)

---

### Enrutamiento en un switch de capa 3

Para que otros dispositivos de capa 3 (como routers u otros switches de capa 3) puedan acceder a las VLAN, estas deben anunciarse usando enrutamiento estático o dinámico.

En un switch de capa 3, esto se logra creando un puerto enrutado.  
Un puerto enrutado es un puerto del switch que deja de funcionar como puerto de capa 2 y pasa a funcionar como capa 3, similar a una interfaz de router.

Esto se hace con el comando **`no switchport`** en el puerto.  
Después, se le asigna una dirección IP, lo que permite conectar el switch directamente con un router u otro switch de capa 3 y así enrutar tráfico entre redes.

---

### Escenario de enrutamiento en un switch de capa 3

En este escenario, el switch de capa 3 D1 está conectado al router R1, y ambos participan en el mismo protocolo de enrutamiento OSPF.

El inter-VLAN routing ya funciona correctamente en D1, y la interfaz G0/0/1 de R1 está activa. R1 usa OSPF para anunciar sus redes (10.10.10.0/24 y 10.20.20.0/24), permitiendo que otros dispositivos de capa 3 conozcan estas rutas.

Aunque OSPF se estudia en otro curso, aquí solo se utiliza para que el enrutamiento entre redes funcione, sin necesidad de comprender su configuración en detalle.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302002037.png)

---

### Configuración de enrutamiento en un switch de capa 3

Complete los siguientes pasos para configurar D1 para enrutar con R1:

**Paso 1**. Configure el puerto enrutado.

**Paso 2**. Activar el routing.

**Paso 3**. Configurar el enrutamiento

**Paso 4**. Verificar enrutamiento.

**Paso 5**. Verificar la conectividad

#### Paso 1 - Configure el puerto enrutado

Configure G1/0/1 para que sea un puerto enrutado, asígnele una dirección IPv4 y habilítelo.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302003846.png)

#### Paso 2 - Activar el routing

Asegúrese de que el enrutamiento IPv4 esté habilitado con el comando de configuración **ip routing** global.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302003927.png)

#### Paso 3 - Configurar el enrutamiento

Configure el protocolo de enrutamiento OSPF para anunciar las redes VLAN 10 y VLAN 20, junto con la red que está conectada a R1. Observe el mensaje informándole de que se ha establecido una adyacencia con R1.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302003952.png)

#### Paso 4 - Verificar enrutamiento

Verifique la tabla de enrutamiento en D1. Observe que D1 ahora tiene una ruta a la red 10.20.20.0/24.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302004024.png)

#### Paso 5 - Verificar la conectividad

En este momento, PC1 y PC2 pueden hacer ping al servidor conectado a R1.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302004052.png)

---

## Solución de problemas de Inter-VLAN Routing

### Problemas comunes de Inter-VLAN routing

Al configurar inter-VLAN routing, no solo hay que verificar que funcione, sino también saber solucionar problemas cuando falla.

Los fallos de conectividad entre VLAN suelen deberse a problemas de conexión.  
El primer paso siempre es revisar la capa física, asegurándose de que los cables estén conectados a los puertos correctos.

Si todo está bien físicamente, se deben revisar otras configuraciones comunes que pueden causar errores, como VLAN mal asignadas, enlaces troncales incorrectos o gateways mal configurados.

| **Tipo de problema**                             | **Cómo arreglar**                                                                                                                                                                               | **Cómo verificar**                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **VLAN faltantes**                               | - Cree (o vuelva a crear) la VLAN si no existe.<br><br>- Asegúrese de que el puerto host está asignado a la VLAN correcta.                                                                      | `show vlan [brief]`<br><br>`show interfaces switchport`<br><br>`ping`                 |
| **Problemas con el puerto troncal del switch**   | - Asegúrese de que los enlaces troncales estén configurados correctamente.<br><br>- Asegúrese de que el puerto es un puerto troncal y está habilitado.                                          | `show interfaces trunk`<br><br>`show running-config`                                  |
| **Problemas en los puertos de acceso de switch** | - Asigne el puerto a la VLAN correcta.<br><br>- Asegúrese de que el puerto es un puerto de acceso y está habilitado.<br><br>- El host está configurado incorrectamente en la subred incorrecta. | `show interfaces switchport`<br><br>`show running-config interface`<br><br>`ipconfig` |
| **Temas de configuración del router**            | - La dirección IPv4 de la subinterfaz del router está configurada incorrectamente.<br><br>- La subinterfaz del router se asigna al ID de VLAN.                                                  | `show ip interface brief`<br><br>`show interfaces`                                    |

---

### Escenario de resolución de problemas de Inter-VLAN Routing

Los ejemplos de algunos de estos problemas de Inter-VLAN Routing ahora se trataran con mas detalle.

Esta topología se utilizara para todos estos problemas.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302010310.png)

La información de direccionamiento VLAN e IPv4 para R1 se muestra en la tabla.

**Router R1 Subinterfaces**

| subinterface | VLAN | Dirección IP     |
|--------------|------|------------------|
| G0/0/0.10    | 10   | 192.168.10.1/24  |
| G0/0/0.20    | 20   | 192.168.20.1/24  |
| G0/0/0.30    | 99   | 192.168.99.1/24  |

---

### VLAN faltantes 

Un problema de conectividad entre VLAN podría deberse a la falta de una VLAN. La VLAN podría faltar si no se creó, se eliminó accidentalmente o no se permite en el enlace troncal.

Por ejemplo, PC1 está conectado actualmente a la VLAN 10, como se muestra en el ejemplo del `show vlan brief` comando.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302010540.png)

Ahora suponga que la VLAN 10 se elimina accidentalmente, como se muestra en el siguiente resultado.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302010616.png)

Observe que ahora falta VLAN 10 en el resultado Observe también que el puerto Fa0/6 no se ha reasignado a la VLAN predeterminada.
Cuando elimina una VLAN, cualquier puerto asignado a esa VLAN queda inactivo. Permanecen asociados con la VLAN (y, por lo tanto, inactivos) hasta que los asigne a una nueva VLAN o vuelva a crear la VLAN que falta.

Utilice el `show interface` comando `switchport interface-id` para verificar la pertenencia a VLAN.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302010717.png)

Si se vuelve a crear la VLAN que falta, se reasignarán automáticamente los hosts a ella, como se muestra en el siguiente resultado.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302010748.png)

Observe que la VLAN no se ha creado como se esperaba. La razón se debe a que debe salir del modo de subconfiguración de VLAN para crear la VLAN, como se muestra en el siguiente resultado.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302010801.png)

Ahora observe que la VLAN esta incluida en la lista y que el host conectado a Fa0/6 esta en la VLAN 10.

---

### Problemas con el puerto troncal del switch

Un problema común en el inter-VLAN routing es la mala configuración de puertos del switch.

- En el método heredad, suele ocurrir porque el puerto del router no está en la VLAN correcta.
    
- En router-on-a-stick, el error más frecuente es un puerto troncal mal configurado.

Por ejemplo, si PC1 antes tenía conectividad entre VLANs y de repente deja de funcionar, y se sabe que el switch fue modificado recientemente, es razonable sospechar que el problema está en la configuración del switch, especialmente en el enlace troncal.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011009.png)

En S1, verifique que el puerto que se conecta a R1 (es decir, F0/5) esté configurado correctamente como enlace troncal utilizando el `show interfaces trunk` comando, como se muestra.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011045.png)

El puerto Fa0/5 que conecta a R1 falta misteriosamente en el resultado. Verifique la configuración de la interfaz mediante el show running-config interface fa0/5 comando, como se muestra.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011120.png)

Como pueden ver, el puerto fue apagado accidentalmente. Para corregir el problema, vuelva a habilitar el puerto y verifique el estado de enlace troncal, como se muestra en el ejemplo.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011148.png)

Para reducir el riesgo de una falla en el enlace entre switch es que interrumpa el inter-VLAN routing, el diseño de red debe contar con enlaces redundantes y rutas alternativas.

---

### Problemas en el puertos de acceso de switch

Cuando se sospecha de un problema en la configuración del switch, se deben usar comandos de verificación para revisar la configuración e identificar el error.

Por ejemplo, si PC1 tiene correctamente su dirección IPv4 y su gateway, pero no puede hacer ping a su propio gateway, es muy probable que el problema esté en el switch.  
En este caso, lo primero que se debe revisar es que PC1 esté conectado a un puerto configurado en la VLAN 10, como corresponde.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011310.png)

Verifique la configuración del puerto en S1 mediante el show interfaces comando `switchport interface-id`.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011351.png)

El puerto Fa0/6 se ha configurado como un puerto de acceso como se indica en «acceso estático». Sin embargo, parece que no se ha configurado para estar en VLAN 10. Verifique la configuración de la interfaz.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011415.png)

Asigne el puerto Fa0/6 a la VLAN 10 y verifique la asignación del puerto.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011432.png)

PC1 ahora puede comunicarse con hosts de otras VLAN.

---

### Temas de configuración del router

En router-on-a-stick, los problemas más comunes se deben a errores en las subinterfaces del router, como una IP incorrecta o un ID de VLAN mal asignado.

Por ejemplo, aunque R1 debería enrutar entre las VLAN 10, 20 y 99, si los usuarios de VLAN 10 no pueden comunicarse con otras VLAN, es probable que la subinterfaz de la VLAN 10 esté mal configurada.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011602.png)

Verificó el enlace troncal del switch y todo parece estar en orden. Verificar el estatus de las interfaces usando el `show ip interface brief` comando.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011635.png)

A las subinterfaces se les han asignado las direcciones IPv4 correctas y están operativas.

Compruebe en qué VLAN se encuentra cada una de las subinterfaces. Para ello, el `show interfaces` comando es útil, pero genera una gran cantidad de resultados adicionales no requeridos. El resultado del comando se puede reducir utilizando filtros de comando IOS como se muestra en el ejemplo.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011753.png)

El símbolo de tubería ( | ) se usa para filtrar la salida de comandos y facilitar la búsqueda de información específica.  
En este caso, se utilizó `include` para mostrar solo las líneas que contienen “Gig” o “802.1Q”, lo que permite ver rápidamente las subinterfaces y las VLAN asociadas.

Gracias a este filtrado, se detecta el error: la subinterfaz G0/0/1.10 está asignada a la VLAN 100 en lugar de la VLAN 10, lo cual se confirma revisando su configuración.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011848.png)

Para corregir este problema, configure la subinterfaz G0/0/1.10 para que este en la VLAN correcta mediante el comando `encapsulation dot1q 10` en el modo de configuración de subinterfaz.

![](Telemática II/Curso de Cisco II/Módulo 04/ANEXOS/Pasted image 20260302011928.png)

Una vez asignada la subinterfaz a la VLAN correcta, los dispositivos en esa VLAN pueden acceder a ella, y el router puede realizar inter-VLAN routing.

Con la correcta verificación, los problemas de configuración del router se resuelven rápidamente, lo que permite que el inter-VLAN routing funcione de forma adecuada.
