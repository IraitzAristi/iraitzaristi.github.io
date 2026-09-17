# RedPi - Compromiso del servidor web de TechNova

**Entorno:** laboratorio propio · **Objetivo:** servidor web de la DMZ (10.0.0.10) · **Meta:** conseguir una shell en el servidor web usando la máquina de auditoría RedPi

Forma parte del proyecto **RedPi**, una red empresarial simulada de TechNova
(LAN / DMZ / WAN), auditada con herramientas propias en Python. Este writeup
muestra la cadena ofensiva de principio a fin, desde la máquina RedPi (conectada
por VPN) hasta una shell en el servidor web de la DMZ, usando mis propias
herramientas.

## Reconocimiento

Desde RedPi escaneé la DMZ con mi propio escáner de red (basado en nmap):

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

Un servidor Apache en el puerto 80, con un servicio FTP al lado: el puerto 80
sirve un sitio WordPress, que se convierte en la superficie de ataque más
interesante.

![Escaneo de la DMZ desde RedPi: servidor web en 10.0.0.10](writeups/redpi/img/01-recon-scan.png)

## Enumeración web

Mi herramienta de análisis web hace fuzzing de rutas comunes. Las rutas
interesantes que encontré:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Dos destacan: `wp-json/wp/v2/users` y `xmlrpc.php`, ambas expuestas por defecto en
una instalación estándar de WordPress.

![Fuzzing web: wp-json y xmlrpc.php expuestos por defecto](writeups/redpi/img/02-web-fuzzing.png)

## Enumeración de usuarios

`/wp-json/wp/v2/users` filtra la lista de autores, devolviendo el nombre de
usuario de la cuenta `admin`. WordPress expone este endpoint por defecto, y le
regala al atacante un nombre de usuario válido para empezar.

![wp-json/wp/v2/users filtrando el usuario admin](writeups/redpi/img/03-wpjson-user-enum.png)

## Fuerza bruta XML-RPC

`xmlrpc.php` acepta el método `wp.getUsersBlogs`, que permite probar credenciales
fuera del formulario de login y sin límite de intentos. Mi herramienta de fuerza
bruta al XML-RPC prueba un diccionario contra el usuario `admin`:

```
[*] Probando 7 contraseñas contra http://10.0.0.10/xmlrpc.php
[+] Credenciales válidas: admin:7ujm8ik,9ol.
```

Credenciales obtenidas.

![Fuerza bruta al XML-RPC recuperando las credenciales de admin](writeups/redpi/img/04-xmlrpc-bruteforce.png)

Un matiz que vale la pena: el método system.multicall es el vector detrás de los ataques masivos reales contra xmlrpc.php de WordPress, empaqueta cientos de intentos de login en una sola petición HTTP, evitando el rate limiting por petición y dejando una línea de log en lugar de miles. Mi herramienta usa el método simple de un intento por petición, suficiente para una única cuenta, pero una defensa real tiene que contemplar multicall, donde un WAF o fail2ban ve muchos menos eventos que intentos de login reales.

## Acceso y foothold

Con la contraseña de `admin` inicié sesión en `/wp-admin`. El editor de plugins
estaba accesible desde el panel, así que reemplacé el código del plugin inactivo
**Hello Dolly** con una reverse shell en PHP apuntando a RedPi en el puerto 4444.

Puse un listener a la escucha en la máquina RedPi con Netcat:

```bash
nc -nlvp 4444
```

Al activar el plugin (y recargar la página) se disparó la conexión:

```
Connection received on 10.0.0.10
$ id
uid=33(www-data) gid=33(www-data)
$ pwd
/var/www/html/wordpress/wp-admin
```

Shell como `www-data` en el servidor web de la DMZ. Objetivo cumplido.

![Login en wp-admin con las credenciales recuperadas](writeups/redpi/img/05-wpadmin-login.png)

![Reverse shell en PHP pegada en el plugin Hello Dolly](writeups/redpi/img/06-plugin-reverse-shell.png)

![Reverse shell recibida en RedPi: shell como www-data](writeups/redpi/img/07-shell-www-data.png)

## Nota sobre el punto de origen del ataque (modelo de amenaza)

Un detalle importante sobre la reverse shell: **el resultado depende de desde
dónde se lanza el ataque.**

- En este caso, lancé la cadena **desde RedPi, situada en la LAN interna**
  (conectada por VPN, a través del túnel OpenVPN). El firewall segmenta las zonas
  y bloquea el tráfico DMZ->LAN, así que la conexión de vuelta no llegaba. Para
  completar el ejercicio, añadí una regla temporal permitiendo el puerto 4444
  desde la DMZ hacia RedPi. Esto simula el escenario de un **atacante interno** (o
  de un equipo ya dentro de la red).
- Un **atacante externo** real, el caso típico del cibercriminal, apuntaría la
  reverse shell a una máquina bajo su control **en Internet (WAN)**, no en la LAN.
  En ese escenario, el tráfico saldría de la DMZ hacia fuera, una dirección que
  suele estar permitida, y **no haría falta tocar el firewall**.

Es decir, la necesidad de la regla no es una debilidad de la cadena, sino
consecuencia de atacar desde dentro. La segmentación LAN/DMZ hace *bien* su
trabajo, deteniendo el movimiento hacia la red interna; lo que no detiene es el
tráfico saliente de la DMZ hacia Internet, que es justo por donde escaparía un
compromiso real.

## Medidas (mitigación)

La cadena funcionó por varias configuraciones por defecto, mal puestas o débiles.
Recomendaciones, de mayor a menor impacto:

- **Contraseñas fuertes + MFA**, `admin:7ujm8ik,9ol.` cayó con un diccionario
  minúsculo; es la raíz de todo el compromiso.
- **Desactivar el editor de plugins/temas**, poner `DISALLOW_FILE_EDIT` en
  `wp-config.php` para que un admin comprometido no pueda inyectar código.
- **Desactivar o restringir `xmlrpc.php`**, permitió la fuerza bruta sin límite
  de intentos.
- **Restringir la enumeración de usuarios en `wp-json`**, no regalar nombres de
  usuario válidos al atacante.
- **fail2ban / WAF** para frenar la fuerza bruta, y **mínimo privilegio** para la
  cuenta del servicio web.
- **Filtrado de salida en la DMZ (egress filtering)**, restringir las conexiones
  salientes del servidor web mata la reverse shell, incluso desde un atacante
  externo.

> Auditoría autorizada de mi propio laboratorio. La contraseña débil es
> intencionada y con fines didácticos.
