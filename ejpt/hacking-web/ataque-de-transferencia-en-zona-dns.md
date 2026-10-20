***TEROIA****: Un **Ataque de Transferencia en Zona DNS** es un ataque que permite al atacante obtener mucha información de la zona **DNS** de la maquina victima (es un servidor DNS la maquina victima), se pueden encontrar subdominios, información... Utilizaremos una herramienta llamada **Dig**.*

1. Hacer un con **nmap** a la victima (Puerto 53/TCP abierto, el puerto del DNS y también aparece el puerto 80 con una web llamada "**hunterzone.nyx**"):
```
sudo nmap -p- --open -sS -sVC -Pn -n -vvv 192.168.1.133
```
![Ataque de Transferencia en Zona DNS 1](ejpt/img/ataque-de-transferencia-en-zona-dns-1.png)

2. Añadimos el dominio "**hunterzone.nyx**" dentro del archivo **/etc/hosts** (**Virtual Hosting**):
```
sudo nano /etc/hosts
```
![Ataque de Transferencia en Zona DNS 2](ejpt/img/ataque-de-transferencia-en-zona-dns-2.png)

3. Utilizamos la herramienta **Dig** para realizar el **Ataque de Transferencia de Zona DNS**, esto también se llama **Enumeración DNS**:
```
dig axfr hunterzone.nyx @192.168.1.133
```
- **hunterzone.nyx**: El dominio que nos encontró **Nmap**.
- **@192.168.1.133**: La **IP** de la victima (el servidor **DNS**).
![Ataque de Transferencia en Zona DNS 3](ejpt/img/ataque-de-transferencia-en-zona-dns-3.png)

4. Se aplica **Virtual Hosting** en todos los **subdominios** encontrados en la **enumeración DNS**, entonces hay que añadirlos todos en el archivo **/etc/hosts** (solo investigaremos el subdominio **devhunter.nyx**, pero en el examen hay que investigar **TODOS**):
```
sudo nano /etc/hosts
```
![Ataque de Transferencia en Zona DNS 4](ejpt/img/ataque-de-transferencia-en-zona-dns-4.png)

5. Utilizamos **Wfuzz** para enumerar los subdominios del dominio **devhunter.nyx**:
```
wfuzz -c --hc=404 -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-topmillion-20000.txt -H "Host: FUZZ.devhunter.nyx" -u 192.168.1.133
```
- *Tambien se puede usar el diccionario **/usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt**, pero ese diccionario este hecho para enumerar directorios y este para enumerar subdominios, entonces es mas optimo en la enumeración de subdominios en este caso, pero en principio deberían de funcionar los dos pero es mas recomendable este: **/usr/share/wordlists/seclists/Discovery/DNS/subdomains-topmillion-20000.txt**.*
![Ataque de Transferencia en Zona DNS 5](ejpt/img/ataque-de-transferencia-en-zona-dns-5.png)
- *Yo he utilizado otro diccionario porque no tengo instalado el del curso*
- ***Wfuzz** nos muestra demasiada "basura", entonces tenemos que aplicar un filtro de numero de líneas o numero de letras.*
- *El comando de **Wfuzz** con las lineas filtradas (nos encunetra el subdominio **file**)*:
```
wfuzz -c --hc=404 --hl=367 -w /usr/share/wordlists/dirbuster/direcotory-list-lowercase-2.3-medium.txt -H "Host: FUZZ.devhunter.nyx" -u 192.168.1.133
```
![Ataque de Transferencia de Zona DNS 6](ejpt/img/ataque-de-transferencia-de-zona-dns-6.png)

6. **Wfuzz** nos ha encontrado el subdominio **files**, entonces lo tenemos que añadir también al archivo **/etc/hosts** (**files.devhunter.nyx**):
```
sudo nano /etc/hosts
```
![Ataque de Transferencia en Zona DNS 7](ejpt/img/ataque-de-transferencia-en-zona-dns-7.png)

7. Buscamos el dominio completo (http://files.devhunter.nyx) en el navegador:
![Ataque de Transferencia en Zona DNS 8](ejpt/img/ataque-de-transferencia-en-zona-dns-8.png)
- *Aquí terminamos el ataque al servidor **DNS** porque la explotación de esta maquina es mas avanzada que la **eJPTv2**.*