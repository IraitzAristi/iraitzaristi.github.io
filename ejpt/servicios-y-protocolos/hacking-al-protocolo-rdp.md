- El protocolo **RDP (Remote Desktop Protocol)** corre por el puerto **TCP 3389**, es un protocolo para acceder gráficamente a un sistema **Windows** en remoto una vez obtenido el usuario y la contraseña del sistema.

1. Le hacemos un escaneo de puertos a la maquina victima para confirmar que el propietario no ha cambiado el puerto por defecto del protocolo **RDP** (2289):
```
sudo nmap -p- --open -sS -sVC --min-rate 5000 -n -Pn 10.81.159.146
```
![Hacking al Protocolo RDP 1](ejpt/img/hacking-al-protocolo-rdp-1.png)
- **Vemos que el protocolo *RDP* corre en su puerto por defecto *(TCP 3389)*.**

2. Usamos la herramienta **xfreerdp3** para tener acceso remoto gráficamente a la victima proporcionando un usuario del sistema con su contraseña:
```
xfreerdp3 /u:Administrator /p:letmein123! /v:10.81.159.146:3389
```
![Hacking al Protocolo RDP 2](ejpt/img/hacking-al-protocolo-rdp-2.png)

3. Recibimos una interfaz grafica de la maquina victima **(Windows Server 2016)**:
![Hacking al Protocolo RDP 3](ejpt/img/hacking-al-protocolo-rdp-3.png)

4. Si en el examen nos preguntan el **Sistema Operativo**, la **Version de Windows**, Hardware, Sistema... buscamos **"about"** en el **Windows** victima y le damos al "intro".
![Hacking al Protocolo RDP 4](ejpt/img/hacking-al-protocolo-rdp-4.png)

5. Se nos abrirá el explorador de archivos, hacemos klik derecho, le damos a propiedades:
![Hacking al Protocolo RDP 5](ejpt/img/hacking-al-protocolo-rdp-5.png)

6. Nos aparecerá información sobre el sistema:
![Hacking al Protocolo RDP 6](ejpt/img/hacking-al-protocolo-rdp-6.png)

7. Si nos preguntan sobre enumerar usuarios del sistema, le damos al icono de **Windows** y luego al botón **"search"**:
![Hacking al Protocolo RDP 7](ejpt/img/hacking-al-protocolo-rdp-7.png)

8. Buscamos **CMD** y le damos al "intro" para iniciarla:
![Hacking al Protocolo RDP 8](ejpt/img/hacking-al-protocolo-rdp-8.png)

9. Ponemos el comando **"net user"** para ver los usuarios del sistema:
![Hacking al Protocolo RDP 9](ejpt/img/hacking-al-protocolo-rdp-9.png)

10. Ponemos el comando **"whoami"** para ver que usuario somos:
![Hacking al Protocolo RDP 10](ejpt/img/hacking-al-protocolo-rdp-10.png)

11. Ponemos el comando **"net user {usuario}"** para conseguir mas información sobre un usuario (por ejemplo del usuario **John**):
![Hacking al Protocolo RDP 11](ejpt/img/hacking-al-protocolo-rdp-11.png)

12. Ponemos el comando **"localgroup Administrators"** para ver que usuarios están en el grupo de administración:
![Hacking al Protocolo RDP 12](ejpt/img/hacking-al-protocolo-rdp-12.png)