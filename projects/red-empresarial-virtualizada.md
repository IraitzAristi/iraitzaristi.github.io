# Red empresarial virtualizada + suite de ciberseguridad

**Proyecto de fin de grado · 2026** · infraestructura completa + herramientas propias

Diseño y despliegue de una **red empresarial completa virtualizada**, de la
arquitectura de red al tooling de seguridad. El objetivo: montar de cero una
infraestructura realista, segmentada y securizada, y sobre ella un conjunto de
herramientas propias tanto defensivas como ofensivas.

## Infraestructura

- **Virtualización** de toda la red en VirtualBox con segmentación **LAN/DMZ** y
  firewall entre zonas.
- **Servidor web Apache** con acceso por SSH/FTP.
- **Servidor MySQL** con base de datos y puestos diferenciados de empleados y
  dirección.
- **Acceso remoto seguro** de una Raspberry Pi a la red LAN mediante **VPN
  OpenVPN configurada desde cero** — autoridad certificadora (CA) y certificados
  de confianza cliente-servidor propios — sobre un router **MikroTik**.

## Suite de herramientas en Python

Ejecutadas desde la Raspberry Pi, divididas en dos frentes:

**Defensivas**
- Gestor de base de datos MySQL.
- Medidor de robustez de contraseñas.
- Generador de contraseñas con hashing **SHA-256**.

**Ofensivas**
- **ARP spoofer** para ataques man-in-the-middle.
- **Sniffer** de tráfico HTTP/FTP.
- **Fuzzer web**.
- **Fuerza bruta** contra el XML-RPC de WordPress.
- **Escáner** de puertos, servicios y versiones de host/red.

## Qué demuestra

- Capacidad de **diseñar y securizar una infraestructura de red completa** de
  principio a fin, no solo piezas sueltas.
- Dominio práctico de **PKI**: montar una CA y emitir certificados para una VPN.
- Segmentación de red y **firewalling** con criterio (LAN/DMZ).
- Desarrollo de **tooling propio** en Python a ambos lados de la seguridad:
  defensa y ataque.

## Tecnologías

Virtualización · OpenVPN · MikroTik RouterOS · Apache · MySQL · Python ·
Raspberry Pi · Linux · Firewall · Routing · PKI (CA y certificados).

> Proyecto de fin de grado del ciclo SMR. El código de las herramientas y la
> documentación de despliegue se publicarán en mi GitHub.
