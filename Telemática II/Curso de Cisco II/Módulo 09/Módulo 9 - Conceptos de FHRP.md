# Módulo 9: Conceptos de FHRP

---

## Contenido

- **Protocolos de Redundancia de Primer Salto:** Describe el propósito y el funcionamiento de los protocolos de redundancia de primer salto.

- **HSRP:** Explica cómo funciona el HSRP.

---

## Protocolos de Redundancia de Primer Salto

Cuando un router o su interfaz (gateway predeterminado) falla, los hosts que lo usan quedan aislados de redes externas. Aunque exista otro router disponible, los dispositivos siguen enviando el tráfico al gateway configurado y este se pierde.

Para solucionar esto, se utilizan los protocolos de redundancia de primer salto (FHRP), que permiten tener gateways alternativos en redes con varios routers conectados a la misma VLAN.

En una red conmutada, cada host solo puede tener un gateway predeterminado, por lo que no puede cambiar automáticamente a otro aunque exista una ruta alternativa.

Por ejemplo, si R1 es el gateway de una PC y falla, aunque R2 pueda enrutar tráfico externo, los dispositivos seguirán enviando datos a R1, causando pérdida de comunicación interna y externa.

Finalmente, no hay diferencia funcional entre un router y un switch de capa 3 en este contexto, ya que ambos pueden actuar como gateway predeterminado en redes conmutadas.

![[Telemática II/Curso de Cisco II/Módulo 09/ANEXOS/Pasted image 20260415083304.png]]

Los dispositivos finales suelen configurarse con una única dirección IPv4 como gateway predeterminado, la cual no cambia automáticamente si la red cambia.  
Si ese gateway deja de estar disponible, el dispositivo no puede enviar tráfico fuera de su red local, quedando completamente desconectado.

Aunque exista un router redundante, los dispositivos no tienen un mecanismo dinámico para detectar y cambiar a un nuevo gateway predeterminado.

En IPv6, en cambio, los dispositivos obtienen su gateway dinámicamente mediante anuncios de router (ICMPv6). Aun así, el uso de FHRP mejora la rapidez de la conmutación por error hacia una nueva puerta de enlace.

---

### Redundancia del Router

Para evitar que el gateway predeterminado sea un único punto de falla, se puede usar un router virtual.

Esto consiste en configurar dos o más routers para que trabajen juntos y se comporten como si fueran un solo router ante los hosts de la red.

- Los routers comparten una misma dirección IP (gateway).
- También comparten una dirección MAC virtual.
- Si un router falla, otro toma el control automáticamente.

Para los dispositivos de la LAN:

- Solo ven un único gateway, aunque en realidad hay varios routers detrás.

Entonces, el router virtual proporciona redundancia y alta disponibilidad, evitando que la red se caiga si un router deja de funcionar.

![[Telemática II/Curso de Cisco II/Módulo 09/ANEXOS/Pasted image 20260415083710.png]]

En una red con router virtual, la dirección IP del router virtual se configura como gateway predeterminado en los hosts.

Cuando los dispositivos envían tráfico:

- Usan ARP para obtener la dirección MAC del gateway.
- El resultado es la MAC del router virtual, no de un router físico específico.

El router que esté activo en ese momento:

- Es el que realmente procesa y reenvía el tráfico.
- Pero esto es transparente para los hosts, que creen que solo existe un router.

Para coordinar esto, se utilizan protocolos de redundancia, que:

- Determinan qué router será el activo.
- Definen cuándo un router de respaldo debe tomar el control si el principal falla.

Este cambio ocurre sin que los dispositivos finales lo noten.

Este mecanismo se conoce como redundancia de primer salto (FHRP), y permite que la red:

- Siga funcionando automáticamente si el gateway falla.

Entonces, los hosts siempre envían tráfico al router virtual, mientras los routers físicos se organizan entre sí para garantizar alta disponibilidad y continuidad del servicio.

---

### Pasos para la Conmutación por Falta del Router

Cuando el router activo falla, el protocolo de redundancia actúa automáticamente para mantener la red funcionando:

1. El router de respaldo detecta la falla porque deja de recibir mensajes de saludo (hello) del router activo.
2. El router de respaldo asume el rol de router activo.
3. El nuevo router activo toma la misma dirección IP y MAC del router virtual, por lo que los dispositivos host:
    - No notan el cambio
    - No pierden conectividad

![[Telemática II/Curso de Cisco II/Módulo 09/ANEXOS/Pasted image 20260415084759.png]]

---

### Opciones de FHRP

La FHRP utilizada en un entorno de producción depende en gran medida del equipo y las necesidades de la red. La tabla muestra todas las opciones disponibles para FHRP.

| Protocolo                                   | Descripción                                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| HSRP (Hot Standby Router Protocol)          | Protocolo de Cisco que usa un router activo y otro en espera. Si el activo falla, el de respaldo toma su lugar automáticamente. |
| HSRP para IPv6                              | Igual que HSRP pero para IPv6. Usa una dirección virtual y envía anuncios cuando está activo.                                   |
| VRRPv2 (Virtual Router Redundancy Protocol) | Protocolo estándar. Varios routers comparten una IP virtual; uno es el principal y los demás son respaldo.                      |
| VRRPv3                                      | Versión mejorada de VRRP que soporta IPv4 e IPv6 y es más escalable.                                                            |
| GLBP (Gateway Load Balancing Protocol)      | Protocolo de Cisco que permite usar varios routers al mismo tiempo, repartiendo el tráfico entre ellos y dando respaldo.        |
| GLBP para IPv6                              | Igual que GLBP pero para IPv6. Varios routers funcionan como un solo gateway y comparten la carga.                              |
| IRDP (ICMP Router Discovery Protocol)       | Protocolo antiguo que permite a los dispositivos encontrar routers en la red. Solo funciona con IPv4.                           |

---

## HSRP

HSRP es un protocolo exclusivo de Cisco que se utiliza para evitar la pérdida de conexión si falla el gateway predeterminado.

Su objetivo es proporcionar redundancia de primer salto (FHRP), asegurando que los hosts siempre tengan acceso a la red.

- Se configura un grupo de routers.
- Dentro del grupo se definen dos roles:
    - **Router activo** → es el que enruta el tráfico normalmente.
    - **Router de reserva (standby)** → está listo para tomar el control si el activo falla.

*Funcionamiento clave:*

- El router activo maneja todo el tráfico.
- El router de reserva monitorea constantemente al activo.
- Si el activo falla, el de reserva:
    - Asume el rol inmediatamente.
    - Continúa el reenvío de paquetes sin que los hosts lo noten.

*Importancia:*

- Proporciona alta disponibilidad.
- Evita interrupciones en la red.
- Hace que la conmutación sea transparente para los dispositivos finales.

HSRP permite que varios routers trabajen como uno solo, garantizando que siempre haya un gateway disponible incluso si uno falla.

---

### Prioridad e intento de prioridad del HSRP

En HSRP, los roles de router activo y router de reserva se determinan mediante un proceso de elección.

1. *Elección del router activo*

- Por defecto:
    - El router con la dirección IPv4 más alta se convierte en activo.
- Pero esto no es recomendable dejarlo al azar, por lo que se usa la prioridad HSRP.

2. *Prioridad HSRP*

- Es un valor entre 0 y 255 (por defecto es 100).
- El router con mayor prioridad será el activo.
- Si hay empate:
    - Gana el que tenga la IPv4 más alta.

Se configura con:  
`standby priority`

3. *Preferencia (Preempt)*

Por defecto:

- Si un router ya es activo, no pierde su rol, aunque aparezca otro con mayor prioridad.

Para cambiar esto:

- Se usa el comando `standby preempt`.

Esto permite que:

- Un router con mayor prioridad que entra en línea  
    → reemplace al activo automáticamente.

Importante:

- Solo funciona si tiene mayor prioridad.
- Si tiene la misma prioridad (aunque tenga mayor IP), no lo reemplaza.

**Resumen**

- La prioridad decide quién es el router activo.
- El preempt permite que un router “mejor” recupere el control cuando vuelve a la red.
- Esto asegura un control más preciso y estable del comportamiento de la red.

![[Telemática II/Curso de Cisco II/Módulo 09/ANEXOS/Pasted image 20260415090410.png]]

En este escenario con HSRP:

- R1 tiene prioridad 150 y R2 tiene prioridad 100 (por defecto).
- Como R1 tiene mayor prioridad, inicia como router activo, y R2 como reserva.

Cuando ocurre una falla:

- R1 se apaga (por ejemplo, corte de energía).
- R2 detecta la falla y asume el rol de router activo automáticamente.

Cuando R1 vuelve:

- Como tiene mayor prioridad y tiene habilitado preempt (intento de prioridad):
    - Fuerza una nueva elección.
    - Recupera su rol como router activo.
    - R2 vuelve a ser router de reserva.

Nota importante:  
Si preempt estuviera desactivado, el router que se vuelve activo (R2) permanecería como activo, incluso cuando R1 regrese con mayor prioridad.

Entonces el preempt permite que el router con mayor prioridad recupere automáticamente su rol activo cuando vuelve a estar disponible.

---

### Estados y temporizadores de HSRP

En HSRP, un router puede tener dos roles principales:

- **Activo** → se encarga de reenviar el tráfico de la red.
- **De reserva (standby)** → permanece listo para asumir el control si el activo falla.

Cuando se configura HSRP en una interfaz:

- El router comienza a enviar y recibir mensajes de saludo (hello).
- Estos mensajes permiten que los routers del grupo determinen qué estado asumir.

| Estado | Descripción |
|--------|------------|
| Inicial | El router entra a este estado cuando se enciende o se activa la interfaz. |
| Aprendizaje | El router aún no conoce la IP virtual y espera información del router activo. |
| Escucha | El router ya conoce la IP virtual, pero no es activo ni de respaldo; solo escucha. |
| Hablar | El router envía mensajes de saludo y participa en la elección del activo o respaldo. |
| En espera | El router está listo para ser el siguiente activo si el actual falla. |

En HSRP, los routers activo y de reserva envían mensajes de saludo (hello) cada 3 segundos por defecto.

Si el router de reserva deja de recibir estos mensajes durante 10 segundos:

- Asume que el router activo falló.
- Se convierte automáticamente en el nuevo router activo.

Estos valores se pueden ajustar para:

- Detectar fallas más rápido.
- Mejorar el tiempo de recuperación.

Sin embargo, hay límites recomendados:

- No configurar el temporizador hello por debajo de 1 segundo.
- No configurar el temporizador de espera (hold) por debajo de 4 segundos.

Esto evita:

- Uso excesivo de CPU.
- Cambios innecesarios entre estados (inestabilidad).

Los temporizadores de HSRP controlan qué tan rápido se detectan fallas, pero deben ajustarse con cuidado para mantener la estabilidad de la red.