
1. Ir a https://revshells.com.
2.  Escribir IP del atacante y puerto por el que quieres recibir la reverse shell.
3. Seleccionar Bash -i si la victima es Linux o PowerShell si la victima es Windows y copiar el comando.
4.  Poner el puerto seleccionado en escucha con netcat (Ejemplo, puerto 443):
```
sudo nc -nlvp 443
```
5.  Pegar el comando generado por https://revshells.com en la maquina victima.
6.  Ya habras recibido la reverse shell de la maquina victima en tu maquina atacante: 
```
$ whoami
victima
```