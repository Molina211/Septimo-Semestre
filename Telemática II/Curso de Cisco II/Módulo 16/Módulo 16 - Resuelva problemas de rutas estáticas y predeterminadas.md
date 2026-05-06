# Módulo 16: Resuelva problemas de rutas estáticas y predeterminadas

---

## Contenido

- **Procesamiento de paquetes con rutas estáticas:** Explicar como un router procesa los paquetes cuando una ruta estática es configurada.

- **Resuelva problemas de configuracion de rutas estáticas y predeterminadas IPv4:** Resolver problemas comunes de configuracion de rutas estáticas y predeterminadas.

---

## Procesamiento de paquetes con rutas estáticas

### Rutas estáticas y envío de paquetes

Antes de abordar la solución de problemas, es importante comprender cómo se reenvían los paquetes mediante rutas estáticas.

Cuando un dispositivo, como PC1, envía un paquete a una red remota (por ejemplo, hacia PC3):

- El router revisa la dirección de destino.
- Busca una coincidencia en su tabla de routing.
- Selecciona la ruta estática correspondiente.
- Reenvía el paquete por la interfaz de salida o hacia el siguiente salto configurado.

Este proceso permite una entrega controlada y predefinida del tráfico dentro de la red.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503111856.png]]

En la siguiente imagen se describe el proceso de reenvío de paquetes con rutas estáticas.

1. El paquete entra al router R1 desde PC1.
2. R1 revisa su tabla de routing y, como no tiene una ruta específica al destino, utiliza la ruta predeterminada.
3. R1 vuelve a encapsular el paquete en una nueva trama para enviarlo hacia R2.
4. El paquete sale de R1 y llega a R2.
5. R2 revisa la dirección destino y encuentra una ruta estática hacia la red objetivo.
6. R2 encapsula nuevamente el paquete para enviarlo hacia R3.
7. El paquete sale de R2 y llega a R3.
8. R3 identifica que la red de destino está conectada directamente a una de sus interfaces.
9. R3 busca la dirección MAC de PC3 mediante ARP si aún no la conoce.
10. R3 encapsula el paquete con la dirección MAC de PC3 como destino final.
11. El paquete se envía a PC3 y llega correctamente a su tarjeta de red.

---

## Resuelva problemas de configuración de rutas estáticas y predeterminadas IPv4

### Cambios en la red

Sin importar qué tan bien esté configurada una red, siempre pueden surgir problemas como fallas de interfaces, interrupciones del proveedor, saturación de enlaces o errores de configuración.

Estos cambios pueden causar pérdida de conectividad, por lo que el administrador de red debe:

- Identificar rápidamente el problema.
- Aislar fallas de routing.
- Aplicar soluciones efectivas.

Para ello, es fundamental conocer y utilizar herramientas de diagnóstico que permitan resolver inconvenientes de manera rápida y eficiente.

---

### Comandos comunes para la solución de problemas

Entre los comandos comunes para la resolución de problemas de IOS, se encuentran los siguientes:

- `ping`
- `traceroute`
- `show ip route`
- `show ip interface brief`
- `show cdp neighbors detail`

La figura muestra la topología de referencia OSPF utilizada para demostrar estos comandos.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503112527.png]]

- *ping*

El ejemplo muestra el resultado de un ping extendido desde la interfaz fuente de R1 a la interfaz LAN de R3. Un ping extendido es una versión mejorada de la utilidad de un ping. El ping extendido permite especificar la dirección IP de origen para los paquetes ping.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503113717.png]]

- *traceroute*

Este ejemplo muestra el resultado de un trazado de ruta desde R1 a la LAN R3. Tenga en cuenta que cada ruta de salto devuelve una respuesta ICMP.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503113737.png]]

- *show ip route*

El comando `show ip route` en este ejemplo muestra la tabla de ruteo de R1.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503113855.png]]

- *show ip interface brief*

Se muestra un estado rápido de todas las interfaces del router mediante el comando `show ip interface brief` de este ejemplo.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503113937.png]]

- *show cdp neighbors*

El comando `show cdp neighbors` muestra los dispositivos Cisco conectados directamente y permite verificar la conectividad de Capa 2 (y por extensión, Capa 1).

Si un vecino aparece en el comando pero no responde a ping, el problema probablemente se encuentra en la configuración de Capa 3, como direccionamiento IP o routing.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114145.png]]

---

### Resolución de un problema de conectividad

Detectar una ruta faltante o mal configurada es más sencillo si se emplean herramientas de diagnóstico de forma ordenada.

Proceso básico:

- Verificar el problema reportado por el usuario.
- Realizar pruebas de conectividad, como ping.
- Usar una interfaz específica como origen para aislar mejor el problema.
- Analizar tablas de routing y configuraciones.

Por ejemplo, si PC1 no puede acceder a la LAN de R3, se puede hacer ping desde la interfaz LAN de R1 hacia la interfaz LAN de R3 para comprobar dónde se pierde la conectividad.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114223.png]]

- *Hacer ping al servidor remoto*

El administrador puede verificar la conectividad entre las dos LAN realizando un ping desde la interfaz G0/0/0 de R1 hacia la interfaz G0/0/0 de R3. Si la prueba falla, se confirma que existe un problema de conectividad entre ambas redes.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114252.png]]

- *Hacer ping al router de salto siguiente*

A continuación, el un ping a la interfaz S0/1/0 en R2 es exitoso. Este ping proviene de la interfaz S0/1/0 de R1. Por lo tanto, el problema no es la pérdida de conectividad entre R1 y R2.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114335.png]]

- *Ping LAN R3 desde S0/1/0*

El ping exitoso desde R1 hacia la interfaz de R3 confirma que R1 puede llegar a la red remota. Sin embargo, si los dispositivos de la LAN de R1 no tienen acceso, el problema probablemente se debe a una ruta incorrecta o faltante en R2 o R3 hacia la red LAN de R1.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114421.png]]

- *Verifique la tabla de enrutamiento R2*

Al revisar la tabla de routing de R2, se detecta una configuración incorrecta: la ruta hacia la red 172.16.3.0/24 apunta al siguiente salto equivocado.

Consecuencia:

- Los paquetes destinados a esa red se envían incorrectamente hacia R3.
- Esto provoca errores de enrutamiento y pérdida de conectividad.

La solución es corregir la ruta estática para dirigir el tráfico hacia el router correcto (R1).

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114509.png]]

- *Hay que corregir la configuración de la ruta estática R2*

A continuación, la configuración en ejecución, de hecho, revela la declaración incorrecta `ip route`. Se elimina la ruta incorrecta y luego se introduce la correcta.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114556.png]]

- *Verificar que está instalada la nueva ruta estática*

La tabla de enrutamiento en R2 se comprueba una vez más para confirmar que la entrada de ruta a la LAN en R1, 172.16.3.0, es correcta y apunta hacia R1.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114626.png]]

- *Hacer ping a la LAN remota de nuevo*

A continuación, se utiliza un ping de R1 procedente de G0/0/0 para verificar que R1 ahora puede llegar a la interfaz LAN de R3. Como último paso de confirmación, el usuario de la PC1 también debe probar la conectividad a la LAN 192.168.2.0/24.

![[Telemática II/Curso de Cisco II/Módulo 16/ANEXOS/Pasted image 20260503114649.png]]

---