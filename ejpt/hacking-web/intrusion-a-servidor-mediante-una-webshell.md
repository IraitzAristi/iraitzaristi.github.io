1. Nos creamos un archivo llamado **webshell.php** y pegamos la **WebShell** en **PHP** dentro del archivo:
![Intrusión a Servidor Mediante una WebShell 1](ejpt/img/intrusion-a-servidor-mediante-una-webshell-1.png)

2. Subimos el archivo a un panel de subida de archivos:
![Intrusión a Servidor Mediante una WebShell 2](ejpt/img/intrusion-a-servidor-mediante-una-webshell-2.png)

3. Le damos al botón "**Save Changes**":
![Intrusión a Servidor Mediante una WebShell 3](ejpt/img/intrusion-a-servidor-mediante-una-webshell-3.png)

4. Vamos al directorio uploads, vemos el archivo **webshell.php** que acabo de subir y klikamos encima del archivo:
![Intrusión a Servidor Mediante una WebShell 4](ejpt/img/intrusion-a-servidor-mediante-una-webshell-4.png)

5. Veremos una pantalla en blanco, pero si cambio la **URL** de la siguiente manera podré ejecutar comandos desde la **URL**:
![Intrusión a Servidor Mediante una WebShell 5](ejpt/img/intrusion-a-servidor-mediante-una-webshell-5.png)

- *El comando **whoami** es un ejemplo, también funcionan otros como **dir**, **ls**, **pwd**...*

5. Ahora tenemos que **URLcodear** una **Reverse Shell** para tener acceso a la maquina victima:
![Intrusión a Servidor Mediante una WebShell 6](ejpt/img/intrusion-a-servidor-mediante-una-webshell-6.png)

6. Mandamos la **Reverse Shell** **URLcodeada** al servidor mediante la **webshell** obtenida:
![Intrusión a Servidor Mediante una WebShell 7](ejpt/img/intrusion-a-servidor-mediante-una-webshell-7.png)

7. Así obtenemos acceso por terminal:
![Intrusión a Servidor Mediante una WebShell 8](ejpt/img/intrusion-a-servidor-mediante-una-webshell-8.png)