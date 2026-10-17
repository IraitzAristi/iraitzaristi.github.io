1. Iniciamos el **Fuzzing** de directorios de la web (utilizar siempre este diccionario para **Fuzzing Web /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt)**:
```
gobuster dir -u http://192.168.0.103/ -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
```

![Fuzzing Web 6](ejpt/img/fuzzing-web-6.png)

2. Para mostrar también los archivos de la web:
```
gobuster dir -u http://192.168.0.103/ -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt -x txt,py,php,sh
```

![Fuzzing Web 7](ejpt/img/fuzzing-web-7.png)