1. **ARCHIVOS .zip**:
	1.  Extraer el diccionario **rockyou.txt.gz**:
	```
	gunzip /usr/share/wordlists/rockyou.txt.gz
	```

	2. Extraer el **HASH** del **.zip** (bot.zip en mi caso):
	```
	zip2john bot.zip > hash
	```
	
	3. Ver el **HASH**:
	```
	cat hash
	```

	4. Iniciar el ataque de fuerza bruta usando **John The Ripper**:
	```
	john --wordlist=/usr/share/wordlists/rockyou.txt hash
	```
	![John The Ripper 1](ejpt/img/john-the-ripper-1.png)

2. **ARCHIVOS/BASES DE DATOS .kdbx (KeePass)**:
	1. Extraer el **HASH** de la base de datos **.kdbx** (Database2.kdbx en mi caso):
	```
	keepass2john Database2.kdbx > hash3
	```
	
	2. Ver el **HASH**:
	```
	cat hash3
	```

	3. Iniciar el ataque de fuerza bruta usando **John The Ripper**:
	```
	john --wordlist=/usr/share/wordlists/rockyou.txt hash3
	```
	![John The Ripper 2](ejpt/img/john-the-ripper-2.png)
	
	4. ***OPCIONAL***: Puede ser que salga este error al intentar extraer el **HASH** (paso 2): ***¡ Database.kdbx : File Version '40000' is currently not supported!***. En ese caso habrá que clonarse el repositorio de ***GitHub*** de ***John The Ripper***:
	```
	git clone https://github.com/openwall/john.git
	```

	5. Vamos al directorio **john/src**:
	```
	cd john/src
	```

	6. Actualizamos la configuración del repositorio:
	```
	./configure && make -s clean && make -sj4
	```

	7. Vamos al directorio **john/run** (**NOTA**: *Mover la base de datos a este directorio*):
	```
	mv /home/kali/Desktop/Database.kdbx /home/kali/Desktop/John/run
	```

	```
	cd ../run
	```

	8. Extraemos el **HASH** de la base de datos:
	```
	./keepass2john Database.kdbx > hash
	```

	9. Iniciar el ataque de fuerza bruta usando **John The Ripper** (También en el directorio **john/run**):
	```
	./john --wordlists=/usr/share/wordlists/rockyou.txt
	```
	![John The Ripper 3](ejpt/img/john-the-ripper-3.png)

3. **DESHASHEAR** un **HASH**:
	1. Generar un **HASH** desde la web https://www.md5hashgenerator.com/ y elegir el tipo de **HASH** (**MD5** o **SHA1**), la contraseña **HASHEADA** será **kisses**:
	![John The Ripper 4](ejpt/img/john-the-ripper-4.png)

4. Copiar los **HASHES** y pegarlos en archivos:
```
sudo nano hash_md5
```

```
sudo nano hash_SHA1
```

![John The Ripper 5](ejpt/img/john-the-ripper-5.png)

5. Probamos el ataque de fuerza bruta básico de **John The Ripper** a los dos tipos de **HASH** (No suele dar resultado en estos casos porque de normal hay que especificar el tipo de **HASH** (**MD5**, **SHA1**...), aunque en este caso nos ha funcionado con el **HASH** **SHA1**):
```
john --wordlist=/usr/share/wordlists/rockyou.txt hash_md5
```
**En esta imagen podemos ver que nos pide que especifiquemos el tipo de ***HASH* y nos da el parámetro que le tenemos que añadir a ***John The Ripper* antes de ***--wordlist*****, en este caso ***--format=Raw-MD5* porque sabemos que el ***HASH* es ***MD5* pero habría que descubrirlo con la herramienta ***hash-identifier***.

![John The Ripper 6](ejpt/img/john-the-ripper-6.png)

```
john --wordlist=/usr/share/wordlists/rockyou.txt hash_SHA1
```
**En esta imagen podemos ver que a veces no hace falta especificar el tipo de ***HASH***
![John The Ripper 7](ejpt/img/john-the-ripper-7.png)

6. En caso de no haber resultado (lo normal) y no sepamos que tipo de **HASH** es, utilizaremos la herramienta **hash-identifier** para descubrir el tipo de **HASH**:
```
hash-identifier
```

**MD5**:
![John The Ripper 8](ejpt/img/john-the-ripper-8.png)

**SHA1**:
![John The Ripper 9](ejpt/img/john-the-ripper-9.png)

7. Iniciar el ataque de fuerza bruta usando **John The Ripper** (con el parámetro **--format=Raw-MD5** porque hemos descubierto mediante **hash-identifier** que es un tipo de **HASH MD5** y el otro con el parámetro **--format=Raw-SHA1-AxCrypt** porque también hemos descubierto mediante **hash-identifier** que es un tipo de **HASH SHA1**):
	```
	john --format=Raw-MD5 --wordlist=/usr/share/wordlists/rockyou.txt hash_md5
	```
	![John The Ripper 10](ejpt/img/john-the-ripper-10.png)

	```
	john --format=Raw-SHA1-AxCrypt --wordlist=/usr/share/wordlists/rockyou.txt hash_SHA1
	```
	![John The Ripper 11](ejpt/img/john-the-ripper-11.png)

8. Para ver todos los **HASHES DESHASHEADOS** con **John The Ripper** (el arhivo suele estar en el directorio **/home/kali/.john**):
```
cat ~/.john/john.pot
```

![John The Ripper 12](ejpt/img/john-the-ripper-12.png)

9. ***OPCIONAL***: Puedes eliminar los **HASHES** del archivo **/home/kali/.john/john.pot** con **NANO** para poder volverlos a **DESHASHEAR** con **John The Ripper**:
```
sudo nano /home/kali/.john/john.pot
```
- También puedes crear otro archivo **.pot** en el que se guardara el **HASH DESHASHEADO** con **John The Ripper** añadiendo el parámetro **--pot=empty.pot** antes del nombre del archivo que contiene el **HASH**:

```
john --format=Raw-MD5 --wordlist=/usr/share/wordlists/rockyou.txt --pot=empty_md5.pot hash_md5
```

```
john --format=Raw-SHA1-AxCrypt --wordlist=/usr/share/wordlists/rockyou.txt --pot=empty_SHA1.pot hash_SHA1
```