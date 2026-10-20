1. Vemos que por ejemplo el comando **clear** no funciona. Entonces debemos tratar la **TTY** con los siguientes comandos:

   1.1. Comando:
	```
	script /dev/null -c bash
	```

![Tratamiento de la TTY 1](ejpt/img/tratamiento-de-la-tty-1.png)

- *Pulsamos **Control + z** para dejar la terminal en segundo plano.*

  2.2. Comando:
  ```
	stty raw -echo; fg
								reset xterm
	```
	![Tratamiento de la TTY 2](ejpt/img/tratamiento-de-la-tty-2.png)

- *El **reset xterm** a veces no se ve al escribirlo, lo que hará será reiniciar la terminal.*

	2.3. Exportamos las variables **TERM** y **SHELL**:
	```
	export TERM=xterm
	export SHELL=bash
	```

- Podemos ver que funciona perfectamente (el comando **clear** funciona, **Control + C** funciona sin perder la conexión...)
![Tratamiento de la TTY 3](ejpt/img/tratamiento-de-la-tty-3.png)