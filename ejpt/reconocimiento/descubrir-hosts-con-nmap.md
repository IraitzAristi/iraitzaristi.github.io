También puedes descubrir IPs dentro de tu red usando Nmap con el siguiente comando:
```
sudo nmap -sn 192.168.1.0/24 -oN IPs_disponibles.txt
```

*-sn:* Para encontrar los hosts en un rango de IPs.
*-oN:* Para guardar la salida del escaneo en un archivo.

![Nmap 4](ejpt/img/nmap-4.png)