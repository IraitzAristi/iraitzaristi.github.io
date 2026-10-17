1. NETDISCOVER sirve para descubrir todos los host de una red usando el siguiente comando:
```
sudo netdiscover -i eth0 -r 192.168.1.0/24
```

*"eth0" es la interfaz de la red, en caso de ser otra como "enp0s3" habría que sustituirlo en el comando de NETDISCOVER.*