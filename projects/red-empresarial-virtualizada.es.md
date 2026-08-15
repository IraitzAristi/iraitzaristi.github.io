# RedPi — red empresarial virtualizada + suite de ciberseguridad

**Proyecto de fin de grado · 2026** · infraestructura completa + tooling propio + pentest interno

RedPi es la construcción desde cero de una red empresarial simulada para una
empresa ficticia ("TechNova") que acababa de sufrir una brecha importante. Sobre
la infraestructura desarrollé una suite de herramientas propias en Python
—defensivas y ofensivas—, pensadas para que las use personal sin perfil técnico,
y con ellas audité el entorno de principio a fin.

## Escenario

TechNova, una empresa de software, sufre una brecha y se filtran 20 GB de datos
sensibles. Encargan RedPi: un conjunto de herramientas de auditoría más una red
segmentada y securizada para medir y mejorar su seguridad.

## Infraestructura

- **Red segmentada** en VirtualBox: **LAN**, **DMZ** y **WAN**, enrutadas por un
  router **MikroTik** con tres interfaces.
- **Política de firewall**: DMZ→LAN bloqueado, LAN→DMZ permitido, NAT masquerade
  hacia WAN — para que el servidor web público no acceda directamente a los datos
  internos.
- **Servidor MySQL** (LAN) con la base de datos corporativa.
- **Servidor web/FTP** con **Apache + WordPress + vsftpd** (DMZ).
- **Puestos** Ubuntu de empleados y dirección (LAN).
- **Máquina de auditoría RedPi** que llega a la LAN por un túnel **OpenVPN**
  montado desde cero — con mi propia **autoridad certificadora (CA)** y
  certificados cliente-servidor — sobre el router MikroTik.

## Suite de herramientas en Python

**Defensivas** — gestor de base de datos MySQL, analizador de robustez de
contraseñas y generador de contraseñas con hashing **SHA-256**.

**Ofensivas** — escáner de red (nmap), fuzzer web, sniffer HTTP/FTP, **ARP
spoofer** (MITM) y **fuerza bruta al XMLRPC**.

## La auditoría en acción

Con la suite ejecuté una cadena de ataque completa contra el servidor web de la
DMZ — reconocimiento → fuzzing web → enumeración de usuarios vía `wp-json` →
fuerza bruta al XMLRPC → acceso a `wp-admin` → reverse shell vía plugin —
terminando en una shell en el servidor web. Writeup completo:
[RedPi — compromiso del servidor web de TechNova](#writeups/redpi/redpi-technova.md).

## Qué demuestra

- Diseñar y **securizar una red completa** de principio a fin (segmentación,
  firewalling, routing, VPN).
- Dominio práctico de **PKI**: montar una CA y emitir certificados para el túnel
  OpenVPN.
- Desarrollar **tooling propio** a ambos lados de la seguridad.
- Ejecutar un **pentest interno realista** y documentarlo.
- **Madurez de ingeniería**: siguientes pasos identificados (tooling de MITM
  completo, un servidor DNS interno, HTTPS en el servidor web y un servidor espejo).

## Demo

- **Vídeo demostración** (cadena de ataque completa, ~5 min): [ver en YouTube](https://youtu.be/TU_VIDEO)
- **Código de las herramientas**: [github.com/IraitzAristi/redpi-tools](https://github.com/IraitzAristi/redpi-tools)

El laboratorio en sí no es distribuible —necesita 6+ GB de RAM y está atado a una
red concreta—, pero el vídeo muestra la cadena completa de principio a fin, y las
herramientas funcionan de forma autónoma contra cualquier objetivo autorizado.
Disponible una demo en vivo bajo petición.

## Documentación

- Presentación del proyecto (en euskera):
  <a href="projects/redpi-presentacion.pdf" target="_blank" rel="noopener">redpi-presentacion.pdf</a>
- Memoria técnica completa (55 páginas, en euskera):
  <a href="projects/redpi-memoria.pdf" target="_blank" rel="noopener">redpi-memoria.pdf</a>

## Tecnologías

VirtualBox · MikroTik RouterOS · OpenVPN · PKI (CA y certificados) · Apache ·
WordPress · MySQL · vsftpd · Python (scapy, nmap) · Linux · Firewall · Routing.
