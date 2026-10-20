- El protocolo **SMB** corre por el puerto **TCP 445** y sirve para compartir recursos compartidos por la red (normalmente en entornos empresariales). En **Windows** este puerto esta abierto por defecto:
![Hacking al Protocolo SMB 1](ejpt/img/hacking-al-protocolo-smb-1.png)

1. Enumeramos recursos compartidos con **smbclient** (sin contraseña):
```
smbclient -L 192.168.8.132 -N
```
![Hacking al Protocolo SMB 2](ejpt/img/hacking-al-protocolo-smb-2.png)
- **-L** : Listar recursos compartidos de la IP de la victima **(Windows)**.
- **-N** : Intenta iniciar una **Null Session** **(Null Session == intentar ver recursos compartidos sin contraseña)**.
- En este caso no funciona, pero puede ser que en algún caso funcione en la **eJPTv2**, recomendable probar siempre.
- Puede ser que en el examen el propio enunciado de la pregunta te diga el usuario, entonces habrá que hacerle fuerza bruta a ese usuario.

2. Si sabemos un usuario, podemos hacer **Fuerza Bruta** con **Hydra** (el usuario que usaremos es **mario**):
```
hydra -l mario -P /usr/share/wordlists/rockyou.txt smb://192.168.8.132
```
![Hacking al Protocolo SMB 3](ejpt/img/hacking-al-protocolo-smb-3.png)

3. Nos metemos al protocolo **SMB** con el usuario **mario** y la contraseña **123123**:
```
smbclient -L //192.168.8.132 -U mario
```
![Hacking al Protocolo SMB 4](ejpt/img/hacking-al-protocolo-smb-4.png)
- **-U**: Usuario con el que veras los recursos compartidos.

4. Con **Smbclient** no sabemos en que recursos compartidos tenemos permisos y en cuales no, entonces usaremos **Smbmap** para obtener mas información:
```
smbmap -H 192.168.132 -u mario -p 123123
```
![Hacking al Protocolo SMB 5](ejpt/img/hacking-al-protocolo-smb-5.png)
- **-H**: Host de la victima (IP victima).
- **-u**: Usuario que utilizaremos para ver los permisos de cada recurso compartido.
- **-p**: La contraseña del usuario que usaremos para ver los permisos de cada recurso compartido.

5. Tenemos permisos de lectura en el recurso compartido **Users**, entonces usaremos **Smbclient** para entrar en ese recurso compartido con el Usuario **mario** y la contraseña **123123**:
```
smbclient -U mario //192.168.8.132/Users
```
![Hacking al Protocolo SMB 6](ejpt/img/hacking-al-protocolo-smb-6.png)

6. Entramos en el escritorio del usuario **mario**:
![Hacking al Protocolo SMB 7](ejpt/img/hacking-al-protocolo-smb-7.png)

7. Podemos descargarnos archivos a nuestro **Kali Linux**:
![Hacking al Protocolo SMB 8](ejpt/img/hacking-al-protocolo-smb-8.png)
