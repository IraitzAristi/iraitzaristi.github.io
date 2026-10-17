1. Descubrimos los hosts que hay en mi red. (una MAC que empiece por *"08:00"* significa que es una maquina virtual de *VirtualBox*)
```
sudo arp-scan -I eth0 --localnet
```
![Hydra 5](ejpt/img/hydra-5.png)

2. Ver el panel de login de la web que esta alojada dentro de la victima (Se puede encontrar mediante *Fuzzing Web*):
```
192.168.1.136/my_weblog/admin.php
```

3. Abrimos BurpSuite, cambiamos al proxy manual (local host127.0.0.1, puerto 8080) en el navegador, vamos al menu *"proxy"* de BurpSuite y le damos a *"Intercept is off"*.
4. Probamos de nombre de usuario *"admin"* (normalmente suele ser el nombre de usuario por defecto) y nos inventamos una contraseña (por ejemplo *admin1234*).
![Hydra 6](ejpt/img/hydra-6.png)

5. Al darle al botón de *"Login"* se nos abrirá BurpSuite con toda la informació que necesitamos:
![Hydra 7](ejpt/img/hydra-7.png)

6. Pasarle la información que nos da BurpSuite a Hydra:
![Hydra 8](ejpt/img/hydra-8.png)

```
sudo hydra -t 64 -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.136 http-post-form "/my_weblog/admin.php:username=admin&password^PASS^:Incorrect username or password."
```
1. *-t 64:* Para que encuentre la contraseña mas rápido de lo normal (No recomendable en el examen eJPTv2 porque puede dar errores).
2. *-l admin:* Le decimos el usuario de inicio de sesión (La *"-l"* minúscula es para indicar que sabemos el usuario, en caso de no saberlo habría que ponerla en mayúsculas seguido al diccionario de usuarios: *"-L /usr/share/wordlists/metasploit/unix_users.txt"* ).
3. *-P /usr/share/wordlists/rockyou.txt:* Le decimos que diccionario queremos utilizar para hacer fuerza bruta contra la contraseña del panel de login (En caso de sabernos la contraseña habría que marcarlo poniendo *"-p"* en minúscula seguido de la contraseña).
4. *192.168.1.136:* IP de la victima.
5. *http-post-form:* La forma en el que se tramita la petición HTTP (POST o GET, normalmente POST).
6. -"/my_weblog/admin.php:username=admin&password^PASS^:Incorrect username or password.":* La ruta del panel de Login:username=usuario (o ^USER^ si no sabes el usuario)&password=^PASS^ (o contraseña si sabes la contraseña):el mensaje que sale al fallar un intento.
