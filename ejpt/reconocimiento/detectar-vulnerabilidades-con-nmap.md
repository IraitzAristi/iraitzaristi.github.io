> **Nota:** este apunte lo hice sobre un laboratorio exclusivo del curso. He sustituido sus IPs por marcadores (`<IP_VICTIMA>`) y solo incluyo capturas genéricas, que no muestran contenido del curso.

1. Detección de vulnerabilidades básica:
```
sudo nmap --script "vuln" -p445 <IP_VICTIMA>
```

2. Parametros:
	1. *--script:* Para usar scripts de Nmap.
	2. *"vuln":* Para utilizar el script "vuln" de Nmap. Este script es muy ruidoso pero en el examen  eJPTv2 puedes hacer ruido entonces es recomendable usarlo en entornos controlados o en la certificación eJPTv2. Este script busca las vulnerabilidades mas comunes en el puerto que le indiques.
	3. *-p445:* Sirve para seleccionar el puerto al que le quieres lanzar el script "vuln" (Si no pones este parametro se lanzara el script "vuln" a todos los puertos abiertos, eso significa que tardara mucho en completarse). El puerto 445 es el del protocolo SMB (Protocolo para transferir archivos por red)
	4. *<IP_VICTIMA>:* IP de la maquina victima

3. Resultado:
	1. Al ejecutarlo te dará el CVE(La vulnerabilidad publica) del servicio que corre en el puerto indicado. Esta vulnerabilidad consiste en la ejecucion remota de comandos. (Ej. En el puerto "445" corre el servicio "SMB"; si la máquina víctima usa una versión vulnerable de "SMB", como la que explota *"EternalBlue"* en Windows 7, el script lo detectará y mostrará su CVE)

	![Nmap 3](ejpt/img/nmap-3.png)

4. Explotar la vulnerabilidad:
	1. Buscar la CVE en el navegador (Chrome, Firefox...) y buscar scripts para explotar esa vulnerabilidad en plataformas como "rapid7", "GitHub"...
	2. Usar Metasploit:
		```
		msfconsole
		```