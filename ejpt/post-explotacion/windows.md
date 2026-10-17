maquina 192.168.1.136 Linux (emisor):

1. Abrimos puerto 80 (http) usando Python para que otro host de nuestra red pueda descargarse un archivo.
```
python3 -m http.server 80
```


maquina 2 Windows (receptor):

Opción 1:

1. Buscamos en un navegador (Firefox, Chrome...) la IP del emisor y nos descargamos el archivo que queremos.

Opción 2:

1. Para descargarte el archivo:
```
certutil -split -urlcache -f http://192.168.1.136/compartir.mp4 compartir.mp4
```
*El segundo "compartir.mp4" es por si quieres cambiarle el nombre, en caso de querer descargarlo con otro nombre hay que cambiarlo ahí (Ej. "certutil -split -urlcache -f http://192.168.1.136/compartir.mp4 nombre_cambiado.mp4")*