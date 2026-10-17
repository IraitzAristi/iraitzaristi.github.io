1. *Hay que entender dos cosas de los EXPLOITS:*
	1. Está el *EXPLOIT*
	2. Y dentro del *EXPLOIT* está el *PAYLOAD*
	
2. Definiciones:
	1. *EXPLOIT:* El *EXPLOIT* entra dentro de la maquina victima y después se ejecuta el *PAYLOAD*.
	2. *PAYLOAD:* Es la carga útil del *EXPLOIT*, una vez que el *EXPLOIT* haya entrado en la maquina victima se ejecutará el *PAYLOAD*. El *PAYLOAD* será lo que nos da *Reverse Shell* (para tener acceso a ejecución remota de comandos).
	
3. Ejemplo de *EXPLOIT* y *PAYLOAD* con la vulnerabilidad *EternalBlue:*
	1. *EXPLOIT:* **exploit/windows/smb/ms17_010_eternalblue**
	2. *PAYLOAD:* **/windows/x64/meterpreter/reverse_tcp**
		1. *Meterpreter* es una sesión, eso significa que con este *PAYLOAD* conseguiremos una sesión de *Meterpreter.*