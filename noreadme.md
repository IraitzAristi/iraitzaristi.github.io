# ~/portfolio

Portfolio ofensivo hecho a mano — tu "segundo currículum". Sin frameworks: un
solo `index.html` lee `portfolio.json`, muestra tu perfil, un catálogo de
máquinas filtrable (nombre · plataforma · dificultad · SO) y cualquier otra
sección que quieras (proyectos, notas, herramientas).

## Estructura

```
.
├── index.html          # la app entera (HTML + CSS + JS)
├── portfolio.json      # tus datos: perfil + máquinas + secciones
├── README.md
├── writeups/
│   └── htb/
│       ├── example-linux.md
│       └── example-windows.md
└── projects/
    └── example-tool.md
```

## 1. Edita tu perfil

En `portfolio.json`, el bloque `profile` es tu portada: `handle`, `role`,
`pitch`, `links` (GitHub, HackTheBox, LinkedIn…) y `skills`. Todo se pinta solo.

## 2. Añade una máquina

Escribe el `.md` en `writeups/<plataforma>/` y añade una entrada al array
`machines`:

```json
{
  "title": "Nombre de la máquina",
  "platform": "HackTheBox",
  "difficulty": "Medium",
  "os": "Linux",
  "date": "2026-02-01",
  "file": "writeups/htb/nombre.md",
  "tags": ["web", "sqli"]
}
```

- `difficulty` acepta `Easy`, `Medium`, `Hard`, `Insane` → cada una tiene su
  color en el catálogo y en la portada.
- Los filtros de plataforma y dificultad se generan automáticamente a partir de
  tus máquinas. No hay que configurarlos.

## 3. Añade otra sección (proyectos, notas…)

Añade un objeto al array `sections`:

```json
{
  "name": "Notas",
  "docs": [
    { "title": "Cheatsheet de AD", "file": "notes/ad.md", "date": "2026-02-05", "tags": ["ad"] }
  ]
}
```

## Desplegar en GitHub Pages

1. Sube todo a un repositorio.
2. Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/root`.
3. Queda en `https://tu-usuario.github.io/tu-repo`.

## Probarlo en local

`fetch()` no funciona con doble clic (`file://`). Sirve la carpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```
