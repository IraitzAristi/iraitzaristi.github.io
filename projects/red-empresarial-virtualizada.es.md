# RedPi — red virtualizada + suite de seguridad/pentesting

**Proyecto de fin de grado · 2026** · infraestructura completa + tooling propio + pentest

RedPi es una solución construida para una empresa ficticia ("TechNova") que había
sufrido un ciberataque. Sobre la infraestructura desarrollé una suite de
herramientas propias en Python (defensivas y ofensivas), pensadas para que las use
personal sin perfil técnico, y con ellas audité el entorno de principio a fin.

## Escenario

TechNova, una empresa de software, sufre una brecha: como consecuencia se filtran
20 GB de datos sensibles. Encargan RedPi, un conjunto de herramientas de auditoría
más una red segmentada y securizada para medir y mejorar la seguridad de la red y
sus equipos.

## Infraestructura

- **Red segmentada** en VirtualBox: **LAN**, **DMZ** y **WAN**, enrutadas por un
  router **MikroTik** de tres interfaces.
- **Firewall**: DMZ->LAN bloqueado, LAN->DMZ permitido, NAT masquerade hacia WAN,
  para que el servidor web público no acceda directamente a la red/datos internos.
- **Servidor MySQL** (LAN) con la base de datos corporativa.
- **Servidor web/FTP**: **Apache + WordPress + vsftpd** (DMZ).
- **Puestos Ubuntu** de empleados y dirección (LAN).
- **Máquina de auditoría RedPi** (la máquina de pentesting), que llega a la LAN por
  un túnel **OpenVPN** montado desde cero con mi propia **autoridad certificadora
  (CA)** y certificados cliente-servidor (PKI), sobre el router MikroTik.

## Suite de herramientas en Python

**Defensivas**: Gestor de base de datos MySQL, analizador de robustez de
contraseñas y un generador de contraseñas con hashing **SHA-256**.

**Ofensivas**: Escáner de red (python-nmap), fuzzer web, sniffer HTTP/FTP, **ARP
spoofer** (MitM) y **fuerza bruta al XMLRPC**.

## La auditoría en acción

Con la suite ejecuté una cadena de ataque completa contra el servidor web de la
DMZ: reconocimiento -> fuzzing web -> enumeración de usuarios vía
`wp-json/wp/v2/users` -> fuerza bruta al XMLRPC -> acceso a `wp-admin` -> una reverse
shell en PHP a través de un plugin para caer como `www-data` en el servidor web.
Writeup completo:
[RedPi — compromiso del servidor web de TechNova](#writeups/redpi/redpi-technova.md).

## Qué demuestra

- Diseñar y securizar una **red completa** de principio a fin (segmentación,
  firewalling, routing, VPN).
- Comprensión práctica de **PKI**: montar una CA y emitir/firmar certificados para
  el túnel OpenVPN.
- Desarrollar **tooling propio** a ambos lados de la seguridad.
- Ejecutar y documentar un **pentest interno realista**.
- **Madurez de ingeniería**: siguientes pasos identificados (tooling de MITM
  completo, un servidor DNS interno, HTTPS en el servidor web y un servidor espejo).

## Demo

- **Código de las herramientas**: [github.com/IraitzAristi/redpi-tools](https://github.com/IraitzAristi/redpi-tools)

El laboratorio en sí no es distribuible, necesita varios GB de RAM y está atado a
una red concreta, pero las herramientas funcionan de forma autónoma contra
cualquier objetivo autorizado, y hay una demo en vivo disponible bajo petición.

## Tecnologías

VirtualBox · MikroTik RouterOS · WinBox · OpenVPN · PKI (CA y certificados) ·
Apache · WordPress · MySQL · vsftpd · Python (scapy, nmap) · Linux · Firewall ·
Routing.
