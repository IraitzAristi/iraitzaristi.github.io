```
sudo nmap -sU --top-ports 200 -Pn 192.168.1.141
```

1. *-su:* Le indicamos a Nmap que nos haga la enumeración de puertos UDP.
2. *--top-ports: 200* Escanea los 200 puertos mas comunes que funcionan por UDP.
3. *--min-rate 500:* Hace un escaneo mucho mas rapido pero satura la red. Sirve para no enviar menos de 5000 paquetes por segundo.
4. *-Pn (No ping):* Es posible que la maquina victima tenga un firewall que este bloqueando paquetes ICMP, eso significa que esta bloqueando el comando ping. Por lo tanto utilizamos "-Pn" para que no ejecute el comando ping y no hayan problemas.
5. *192.168.1.141:* IP de la maquina victima (Maquina "Chain" de "VulNyx").

![Nmap 5](ejpt/img/nmap-5.png)