- ***wfuzz***:

	1. Enumeración de subdominios:
```
wfuzz -c --hc=404 -w /usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt http://192.168.1.138/FUZZ
```
- *Tambien se puede usar el diccionario **/usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt**, en principio deberían de funcionar los dos pero es mas recomendable este: **/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt**.*
![Fuzzing Web 8](ejpt/img/fuzzing-web-8.png)

- ***Dirsearch*** (puede no estar instalado, utiliza un diccionario malo por defecto como **Dirb**):

	1. Enumeración de subdominios:
	```
	dirsearch -u http://192.168.1.138/ -w /usr/share/wordlists/seclists/Web-Content/directory-list-lowercase-2.3-medium.txt
	```
*Tambien se puede usar el diccionario **/usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt**, en principio deberían de funcionar los dos pero es mas recomendable este: **/usr/share/wordlists/seclists/Discovery/Web-Content/directory-list-lowercase-2.3-medium.txt**.*
![Fuzzing Web 9](ejpt/img/fuzzing-web-9.png)
