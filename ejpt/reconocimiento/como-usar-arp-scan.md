ARP-SCAN sirve para descubrir todos los host de una red usando el siguiente comando:
```
sudo arp-scan -I eth0 --localnet
```

*"eth0" es la interfaz de la red, en caso de ser otra como "enp0s3" habría que sustituirlo en el comando de ARP-SCAN. Si no estas seguro que te haya mostrado todos los hosts probar a sustituir "--localnet" por "--local"*