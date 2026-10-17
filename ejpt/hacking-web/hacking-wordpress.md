1. Buscamos la IP victima en **Firefox** y vemos una pagina **Default Apache**:
![Pasted image 20251207211446](ejpt/img/pasted-image-20251207211446.png)

2. Hacemos **Fuzzing Web** con **Gobuster**:
```
gobuster dir -u http://10.80.173.211 -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
```
![Pasted image 20251207211145](ejpt/img/pasted-image-20251207211145.png)

3. Encontramos el directorio **"blog"**, buscamos en el navegador la **URL** completa: "http://10.80.173.211/blog":
![Pasted image 20251207211728](ejpt/img/pasted-image-20251207211728.png)

4. Vemos que se ve mal, entonces miramos el código fuente de la pagina web **(Control + U o View Page Source)**:
![Pasted image 20251207212020](ejpt/img/pasted-image-20251207212020.png)

5. En varias líneas se hace una llamada **(href)** a un dominio llamado **"internal.thm"**, lo añadimos a el archivo **/etc/hosts** junto a la IP de la victima:
```
sudo nano /etc/hosts
```
![Pasted image 20251207212307](ejpt/img/pasted-image-20251207212307.png)

6. Entonces si recargamos la web, deberíamos verla bien:
![Pasted image 20251207212437](ejpt/img/pasted-image-20251207212437.png)

7. Le hacemos **Fuzzing Web** con **Gobuster** a esta web **(http://10.80.173.211/blog o http://internal.thm/blog)**:
```
gobuster dir -u http://10.80.173.211/blog -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
```
![Pasted image 20251207212943](ejpt/img/pasted-image-20251207212943.png)

8. Encontramos el subdirectorio **"wp-login.php"**, vemos que es el panel de iniciar sesión de **Wordpress**:
![Pasted image 20251207213117](ejpt/img/pasted-image-20251207213117.png)

9. Utilizaremos la herramienta **WPscan** para enumerar usuarios y **Plugins** vulnerables o desactualizados (poco frecuente) de **Wordpress** en esta pagina web:
```
wpscan --url http://internal.thm/blog --enumerate u,vp
```
![Pasted image 20251207214030](ejpt/img/pasted-image-20251207214030.png)
![Pasted image 20251207214231](ejpt/img/pasted-image-20251207214231.png)
![Pasted image 20251207214308](ejpt/img/pasted-image-20251207214308.png)
- Hemos encontrado el usuario **"admin"**, no hemos encontrado ningún **Plugin** vulnerable o desactualizado.

10. Ya tenemos los usuarios **""** ahora les haremos un ataque de **Fuerza Bruta** con **WPscan** al archivo **XMLRPC.php*** (casi todas las paginas web hechas es **Wordpress** tienen este archivo):
![Pasted image 20251207214909](ejpt/img/pasted-image-20251207214909.png)
![Pasted image 20251207215341](ejpt/img/pasted-image-20251207215341.png)
- El archivo **XMLRPC.php** sirve para hacer llamadas a **Softwares** que estén fuera de **Wordpress**, lo que pasa que este archivo permite a los atacantes hacer ataques **DDoS** y ataques de **Fuerza Bruta** contra la pagina web.

11. Ya tenemos el usuario **"admin"** y la contraseña **"my2boys"**, entonces iniciamos sesión en el panel de **"wp-login.php"**:
![Pasted image 20251207215636](ejpt/img/pasted-image-20251207215636.png)

12. Vamos al apartado **"Apariencia"** y le damos a **"Editor de Temas"**:
![Pasted image 20251208001912](ejpt/img/pasted-image-20251208001912.png)
13. Editamos el archivo **Theme Footer (footer.php)** este es el código del tema de la pagina principal:
![Pasted image 20251208001941](ejpt/img/pasted-image-20251208001941.png)

14. Nos generamos una **Reverse Shell** en **PHP** (o cogemos la de **PentestMonkey PHP** de **Revshells**):
15. Borramos todo el contenido de la plantilla **"Theme Footer"**:
16. Copiamos la **Reverse Shell** generada con **Msfvenom** (o la de **PentestMonkey PHP** de **Revshells**):
17. Pegamos la **Reverse Shell** en la plantilla **"Theme Footer"**:
18. Nos ponemos a escuchar con el modulo **multi/handler** de **Metasploit** por el puerto 4444:
19. Recargamos la pagina web y habremos obtenido una sesión **meterpreter** por el modulo **multi/handler** de **Metasploit**:
20. Nos pasamos una **Reverse Shell** en **Bash** por el puerto 2222 y la recibimos con **Netcat**, porque los **payloads/Reverse Shells** creadas con **Msfvenom** son inestables y se pierde la conexión a los pocos minutos: