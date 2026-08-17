# RedPi — compromiso del servidor web de TechNova

**Entorno:** laboratorio propio · **Objetivo:** servidor web de la DMZ (10.0.0.10) · **Meta:** obtener una shell en el servidor web partiendo de la máquina de auditoría RedPi

Forma parte del proyecto **RedPi** — una red empresarial simulada de TechNova
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

Un Apache en el puerto 80 con FTP al lado: el 80 sirve un sitio WordPress, que
se convierte en la superficie de ataque más prometedora.

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
atacante un usuario válido con el que empezar.

## Fuerza bruta al XML-RPC

`xmlrpc.php` acepta el método `wp.getUsersBlogs`, que permite probar credenciales
fuera del formulario de login y sin límite de intentos. Mi herramienta de fuerza
bruta al XML-RPC lanza un diccionario contra el usuario `admin`:

```
[*] Probando 7 contraseñas contra http://10.0.0.10/xmlrpc.php
[+] Credenciales válidas: admin:7uj*******
```

Credenciales obtenidas.

## Acceso y foothold

Con la contraseña de `admin` inicié sesión en `/wp-admin`. El editor de plugins
era accesible desde el panel, así que reemplacé el código del plugin inactivo
**Hello Dolly** por una reverse shell en PHP apuntando a RedPi en el puerto 4444.

Puse un listener a la escucha:

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

## Nota sobre el punto de origen del ataque (modelo de amenaza)

Un detalle importante sobre la reverse shell: **el resultado depende de desde
dónde se lance el ataque.**

- En este caso ejecuté la cadena desde **RedPi, situada en la LAN interna**. El
  firewall segmenta las zonas y bloquea el tráfico DMZ→LAN, así que la conexión
  de vuelta no llegaba. Para completar el ejercicio añadí una regla puntual
  permitiendo el puerto 4444 desde la DMZ hacia RedPi. Esto simula el escenario
  de un **atacante interno** (o de un equipo ya dentro de la red).
- Un **atacante externo** real —el caso típico de un cibercriminal— lanzaría la
  reverse shell contra una máquina bajo su control **en Internet (WAN)**, no en
  la LAN. En ese escenario el tráfico saldría de la DMZ hacia fuera, que es una
  dirección normalmente permitida, y **no haría falta tocar el firewall**.

Es decir, la necesidad de la regla no es una debilidad de la cadena, sino una
consecuencia de haber atacado desde dentro. La segmentación LAN/DMZ hace *bien*
su trabajo conteniendo el movimiento hacia la red interna; lo que no frena es la
salida de la DMZ hacia el exterior, que es justo por donde escaparía un
compromiso real.

## Mitigación

La cadena funcionó por varias configuraciones por defecto, mal puestas o débiles.
Recomendaciones, de mayor a menor impacto:

- **Contraseñas fuertes + MFA** — `admin:7uj*******` cayó con un diccionario
  mínimo; es la raíz de todo el compromiso.
- **Desactivar el editor de plugins/temas** — establecer `DISALLOW_FILE_EDIT` en
  `wp-config.php` para que un admin comprometido no pueda inyectar código.
- **Desactivar o restringir `xmlrpc.php`** — cerró la vía de fuerza bruta sin
  límite de intentos.
- **Restringir la enumeración de usuarios en `wp-json`** — no regalar usuarios
  válidos al atacante.
- **fail2ban / WAF** para frenar la fuerza bruta, y **mínimo privilegio** para el
  usuario del servicio web.
- **Filtrado de salida (egress) en la DMZ** — restringir las conexiones salientes
  del servidor web corta la reverse shell incluso desde un atacante externo.

> Auditoría autorizada de mi propio laboratorio. La contraseña débil es
> intencionada y didáctica.
