# ~/writeups

Sitio estático hecho a mano para publicar writeups en Markdown. Sin frameworks:
un solo `index.html` lee tus `.md`, los agrupa por secciones y los renderiza con
resaltado de código.

## Estructura

```
.
├── index.html          # la app entera (HTML + CSS + JS)
├── writeups.json       # tu índice: editas esto a mano
├── README.md
└── writeups/
    ├── web/
    │   └── example-xss.md
    └── pwn/
        └── example-bof.md
```

## Añadir un writeup nuevo

1. Escribe el `.md` y guárdalo en la carpeta de su categoría
   (p. ej. `writeups/crypto/rsa-comun.md`).
2. Añade una entrada en `writeups.json`, dentro de la sección que corresponda:

   ```json
   {
     "title": "RSA con módulo común",
     "file": "writeups/crypto/rsa-comun.md",
     "date": "2026-02-01",
     "tags": ["rsa", "medium"]
   }
   ```

   Para crear una sección nueva, añade otro objeto al array `sections`.
3. Haz commit y push. Eso es todo.

Las etiquetas que contengan `high`/`alta`/`crit` se pintan en rojo y las de
`med` en ámbar, para señalar severidad de un vistazo.

## Desplegar en GitHub Pages

1. Sube todo a un repositorio.
2. Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/root`.
3. Tu sitio queda en `https://tu-usuario.github.io/tu-repo`.

## Probarlo en local

`fetch()` no funciona abriendo `index.html` con doble clic (bloqueo de origen
`file://`). Sirve la carpeta con un servidor cualquiera:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```
