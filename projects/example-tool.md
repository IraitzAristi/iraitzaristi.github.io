# autoenum — script de enumeración

Herramienta propia en Python que automatiza la fase de enumeración inicial:
lanza `nmap`, detecta servicios web y dispara `feroxbuster` y `whatweb` según lo
encontrado. Nació de repetir siempre los mismos comandos al empezar una máquina.

## Qué hace

- Escaneo de puertos y servicios con salida ordenada por carpetas.
- Enumeración web automática cuando detecta 80/443.
- Resumen final con los vectores más prometedores.

## Uso

```bash
python3 autoenum.py -t 10.10.11.x -o loot/
```

## Ejemplo de la lógica principal

```python
import subprocess, pathlib

def scan_ports(target, out):
    pathlib.Path(out).mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "nmap", "-sC", "-sV", "-oA", f"{out}/initial", target
    ], check=True)

def web_enum(target, port, out):
    subprocess.run([
        "feroxbuster", "-u", f"http://{target}:{port}",
        "-o", f"{out}/ferox_{port}.txt"
    ])
```

## Estado

En desarrollo. El objetivo es añadir detección de tecnologías y sugerir
exploits conocidos a partir de las versiones halladas.

> El código completo está en mi GitHub. Este doc es solo la ficha del proyecto.
