1. Nmap básico (En caso de error utilizar "-Pn"):
```
sudo nmap 192.168.1.128
```

```
sudo nmap -Pn 192.168.1.128
```

![Nmap 1](ejpt/img/nmap-1.png)


2.  Escaneo mas avanzado
```
sudo nmap -p- --open -sS -sVC --min-rate 5000 -n -vvv -Pn 192.168.1.135 -oN escaneo.txt
```

1. *-p-:* Hacer escaneo de todos los puertos (1-65748)
2. *--open:* Hacer el escaneo de puertos abiertos (Normalmente se usa junto al -p-, Ej. "-p- --open")
3. *-sS:* Para que el esacneo sea mas rapido y sigiloso.
4. *-sC:* Ejecuta los scripts por defecto de Nmap a los puertos abiertos.
5. *-sV:* Te dice la version del servicio de cada puerto.
6. -*sVC:* "-sV" y "-sC" combinado (Es lo mismo que usar esos dos parametros por separado).
7. *--min-rate 5000:* Hace un escaneo mucho mas rapido pero satura la red. Sirve para no enviar menos de 5000 paquetes por segundo. En el examen del eJPTv2 es recomendable utlizar "--min-rate 2000" o "1500" para no saturar la red.
8. *-n:* Para no hacer resolución DNS
9. *-Pn (No ping):* Es posible que la maquina victima tenga un firewall que este bloqueando paquetes ICMP, eso significa que esta bloqueando el comando ping. Por lo tanto utilizamos "-Pn" para que no ejecute el comando ping y no hayan problemas (En el examen de eJPTv2 lo normal es que no haga falta porque es una certificación "básica").
10. *-vvv:* Para que Nmap me vaya mostrando los datos mientras los vaya obteniendo, asi no habra que esperar a que termine el escaneo para ver todos los datos.
11. *192.168.1.135:* La IP de la maquina victima.
12. *-oN escaneo.txt:* Para que creé un archivo llamado escaneo.txt en formato Nmap (normal) y guarde el resultado del escaneo en ese archivo creado.
13. Leer el archivo para ver el resultado del escaneo en cualquier momento abriendo el archivo:
```
cat escaneo.txt
```
![Nmap 2](ejpt/img/nmap-2.png)