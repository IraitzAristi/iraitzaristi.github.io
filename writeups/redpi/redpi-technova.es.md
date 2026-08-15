# RedPi — compromiso del servidor web de TechNova

**Entorno:** laboratorio propio · **Objetivo:** servidor web de la DMZ (10.0.0.10) · **Meta:** llegar al servidor web desde la máquina de auditoría RedPi

Forma parte del proyecto RedPi — una red empresarial simulada de TechNova
(LAN / DMZ / WAN) auditada con un conjunto de herramientas propias en Python.
Este writeup recorre la cadena ofensiva de principio a fin, desde la máquina
RedPi (conectada por VPN) hasta una shell en el servidor web de la DMZ, usando
mis propias herramientas.

## Reconocimiento

Desde RedPi escaneé la DMZ con mi propio escáner de red (basado en nmap):

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

Un servidor Apache en el puerto 80 con FTP al lado — un sitio WordPress.

## Enumeración web

Mi herramienta de análisis web hace fuzzing de rutas comunes. Hallazgos
interesantes:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Dos destacan: `wp-json/wp/v2/users` y `xmlrpc.php`, ambos expuestos por defecto
en una instalación estándar de WordPress.

## Enumeración de usuarios

`/wp-json/wp/v2/users` filtra la lista de autores — devuelve el nombre de la
cuenta `admin`. WordPress expone este endpoint por defecto, regalándole al
atacante un usuario válido.

## Fuerza bruta al XMLRPC

`xmlrpc.php` acepta `wp.getUsersBlogs`, que permite probar credenciales fuera del
formulario de login y sin límite de intentos. Mi herramienta de fuerza bruta al
XMLRPC prueba un diccionario contra el usuario `admin`:

```
[*] Probando 7 contraseñas contra http://10.0.0.10/xmlrpc.php
PASAHITZA: admin:7ujm8ik,9ol.
```

Credenciales obtenidas.

## Acceso y foothold

Con la contraseña de admin inicié sesión en `/wp-admin`. El editor de plugins era
accesible desde el panel, así que reemplacé el código del plugin inactivo
**Hello Dolly** por una reverse shell en PHP apuntando a RedPi en el puerto 4444.

Un detalle: RedPi está en la LAN y el firewall bloquea el tráfico DMZ→LAN, así
que la conexión de vuelta no llegaba. Añadí una regla de firewall puntual
permitiendo el puerto 4444 desde la DMZ hacia RedPi, y puse un listener:

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

## Mitigación

La cadena funcionó por varias configuraciones por defecto, mal puestas o débiles:

- **Desactivar o restringir `xmlrpc.php`** — permitió la fuerza bruta sin límite.
- **Restringir la enumeración de usuarios de `wp-json`** — no regalar usuarios válidos.
- **Desactivar el editor de plugins/temas** — poner `DISALLOW_FILE_EDIT` en `wp-config.php` para que un admin comprometido no pueda inyectar código.
- **Contraseñas fuertes + MFA** — `7ujm8ik,9ol.` cayó con un diccionario minúsculo.
- **fail2ban / WAF** y **mínimo privilegio** para el usuario web.

> Auditoría autorizada de mi propio laboratorio. La contraseña débil es intencionada y didáctica.
