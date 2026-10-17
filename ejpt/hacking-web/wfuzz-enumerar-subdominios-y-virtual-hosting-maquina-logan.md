
***TEORIA***: ***Virtual Hosting** es cuando tu maquina local no puede asociar la URL (en este caso http://logan.hmv) con la IP de la victima (192.168.1.138). Cuando se aplica **Virtual Hosting** siempre hay que hacer la comprobación de **subdominios (Wfuzz).***


1. Hacemos un **nmap** a la victima:
```
sudo nmap -p- --open -sS -sVC -n -Pn -vvv -A 192.168.1.138 -oN logan.txt
```

2. Vemos el puerto 80 abierto y en el reporte de **nmap** nos sale un host en el puerto 80:
![Virtual Hosting 1](ejpt/img/virtual-hosting-1.png)

3. Nos metemos al puerto 80 y podemos confirmar que hay **Virtual Hosting** (sale el **logan.hmv** en la URL y eso es una señal de **Virtual Hosting**):
![Virtual Hosting 2](ejpt/img/virtual-hosting-2.png)

4. En el archivo "**/etc/hosts**" tenemos que escribir la IP de la victima y le tenemos que indicar que apunte a "**logan.hmv**":
```
sudo nano /etc/hosts
```
![Virtual Hosting 3](ejpt/img/virtual-hosting-3.png)

5. Recargamos el navegador con la URL http://logan.hmv y se nos muestra la pagina web:
![Virtual Hosting 4](ejpt/img/virtual-hosting-4.png)

6. Cuando se aplica **Virtual Hosting** ***SIEMPRE*** hay que hacer la comprobación de **subdominios (Wfuzz)**:
```
wfuzz -c --hc=404 -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -H "Host: FUZZ.logan.hmv" -u 192.168.1.138
```
**--hc=404**: Para que no muestre las paginas no encontradas (error 404 Not Found).
**-w**: Para introducir el diccionario de **subdominios**.
**-H**: En forma de **stringe**, escribes "**"Host: "**", despues escribes donde quieres que **wfuzz** haga el ataque de **subdominios** introducioendo la palabra "**FUZZ**.", luego escribes delante el dominio que conocemos (**logan.hmv** en este caso), quedaría de esta forma todo junto "**"Host: FUZZ.logan.hmv"**".
![Virtual Hosting 5](ejpt/img/virtual-hosting-5.png)

7. Como sale demasiada "basura" y reportes tendremos que filtrar lineas, caracteres o "ch" (nosotros filtraremos por lineas, porque que las lineas sean mas de 1 de normal significa que encontró algo):
```
wfuzz -c --hc=404 --hl=1 -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -H "Host: FUZZ.logan.hmv" -u 192.168.1.138
```
**--hl=1**(hide line=1): No muestra los subdominios que solo tengan una linea (si tienen mas de una linea de normal significa que **Wfuzz** encontró algo).
- ***Nos ha encontrado el subdirectorio "admin".***
![Virtual Hosting 6](ejpt/img/virtual-hosting-6.png)

8. Nos encontró el subdirectorio **admin**, pero no lo podemos ver debido que también aplica **Virtual Hosting** (tenemos que añadirlo en el archivo **/etc/hosts**):
```
sudo nano /etc/hosts
```
![Virtual Hosting 7](ejpt/img/virtual-hosting-7.png)

9. Ya podemos ver la web http://admin.logan.hmv:
![Virtual Hosting 8](ejpt/img/virtual-hosting-8.png)