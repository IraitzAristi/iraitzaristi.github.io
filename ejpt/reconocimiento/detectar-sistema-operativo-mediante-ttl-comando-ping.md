1. Ejecutar el comando ping para verificar si hay conectividad a la maquina victima y mediante su TTL (Time To Life) detectar que sistema operativo usa la victima.
   Ej. La victima tiene la IP 192.168.1.134:
```
ping 192.168.1.134
```
*En caso de querer enviar un numero concreto de peticiones ping (Ej. 4 peticiones ping) habría que añadir el parametro "-c 4" de esta manera: "ping -c 4192.168.1.134"*

2. Detectar sistema operativo según el TTL:
	1. 64 TTL---->LINUX
	2. 128 TTL---->Windows

LINUX:
![Ping Linux](ejpt/img/ping-linux.png)

WINDOWS:
![Ping Windows](ejpt/img/ping-windows.png)
