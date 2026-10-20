- El protocolo **SNMP** corre por el puerto **UDP 161** y sirve para poder intercambiar archivos por la red.
1. Le hacemos un escaneo por el protocolo **UDP** a la victima usando **Nmap**:
```
nmap -sU -sVC --top-ports 200 --min-rate 5000 -n -Pn 192.168.8.136
```
![Hacking al Protocolo SNMP 1](ejpt/img/hacking-al-protocolo-snmp-1.png)
- **El puerto *UDP 161* es el único puerto *UDP* abierto (puerto del protocolo *SNMP*).**

2. Utilizaremos la herramienta **onesixtyone** para hacer un ataque de **Fuerza Bruta** para que me encuentre la **Clave De Comunidad** del protocolo **SNMP**:
```
onesixtyone -c /usr/share/wordlists/rockyou.txt 192.168.8.136
```
![Hacking al Protocolo SNMP 2](ejpt/img/hacking-al-protocolo-snmp-2.png)
- **-c**: Le pasamos el diccionario con el que haremos **Fuerza Bruta** a la **Clave De Comunidad** del protocolo **SNMP**.
- **Probar varios diccionarios si la *Clave De Comunidad* no esta en el diccionario *Rockyou.txt*.**

3. Con esta **Clave De Comunidad** ya podemos enumerar el protocolo **SNMP** con la herramienta **snmpwalk**:
```
snmpwalk -v 2c -c security 192.168.8.136
```
![Hacking al Protocolo SNMP 3](ejpt/img/hacking-al-protocolo-snmp-3.png)
- **-v**: La versión del protocolo **SNMP** (en nuestro caso la versión **"2c"**).
- **-c**: La **Clave De Comunidad** del protocolo **SNMP** (en nuestro caso es **"security"**).
- **Con este comando accedemos a la información que se esta transmitiendo a través del protocolo *SNMP*.**
- **Podemos encontrar *dominios, usurios, contraseñas, infomración importante...*.**

4. Encontramos el dominio **"chaincorp.nyx"**, lo añadimos al archivo **/etc/hosts** con la IP de la victima (**Virtual Hosting**):
```
sudo nano /etc/hosts
```
![Hacking al Protocolo SNMP 5](ejpt/img/hacking-al-protocolo-snmp-5.png)

5. Buscamos el dominio en **Firefox**:
![Hacking al Protocolo SNMP 6](ejpt/img/hacking-al-protocolo-snmp-6.png)