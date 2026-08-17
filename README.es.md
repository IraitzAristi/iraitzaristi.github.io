[English](README.md) · **Castellano** · [Euskara](README.eu.md)

# iraitzaristi.github.io

Mi portfolio de seguridad ofensiva — un "segundo currículum" que muestra lo que sé
hacer de verdad: máquinas que he rooteado, proyectos que he construido y las
herramientas detrás de ellos. Hecho a mano con HTML, CSS y JavaScript puros. Sin
framework.

**En vivo:** https://iraitzaristi.github.io

## Funciones

- **Perfil / portada** — rol, presentación, skills, certificaciones y estadísticas
  en vivo (máquinas, proyectos, certificaciones) calculadas directamente desde los datos.
- **Catálogo de máquinas** — cada máquina con su plataforma, dificultad y SO, en una
  tabla filtrable (por plataforma y dificultad) que se escanea como un CV.
- **Writeups y proyectos** — Markdown renderizado en la página con resaltado de código.
- **Trilingüe** — inglés / castellano / euskera, conmutable con un clic y recordado
  entre visitas. El inglés es el idioma por defecto; el idioma del navegador se
  detecta en la primera carga.

## Tecnología

HTML/CSS/JS puros, sin paso de compilación. Librerías de renderizado cargadas desde CDN:
[marked](https://github.com/markedjs/marked) (Markdown),
[highlight.js](https://github.com/highlightjs/highlight.js) (código) y
[DOMPurify](https://github.com/cure53/DOMPurify) (saneamiento).
Desplegado en GitHub Pages.

## Estructura

```
.
├── index.html          # toda la app (HTML + CSS + JS)
├── portfolio.json      # todos los datos: perfil, máquinas, secciones
├── writeups/           # writeups de máquinas (Markdown)
│   └── htb/
└── projects/           # fichas de proyecto (Markdown, con versiones por idioma)
```

## Modelo de datos

Todo lo que muestra el sitio viene de `portfolio.json`. Los campos cortos que
necesitan traducción son objetos indexados por idioma; los documentos largos
apuntan a archivos Markdown por idioma.

**Añadir una máquina** — escribe el `.md` en `writeups/<plataforma>/` y añade una
entrada a `machines`:

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

`difficulty` acepta `Easy`, `Medium`, `Hard`, `Insane` — cada uno con su propio
color, y los filtros de plataforma/dificultad se generan solos a partir de los datos.

**Añadir un documento traducido** — el `file` base se escribe en el idioma por
defecto (inglés). Apunta `file_i18n` a las versiones traducidas:

```json
"file": "projects/nombre.md",
"file_i18n": {
  "es": "projects/nombre.es.md",
  "eu": "projects/nombre.eu.md"
}
```

Si un documento aún no está traducido, el sitio cae al idioma base y muestra un
aviso pequeño — nunca se rompe.

## Ejecutar en local

`fetch()` no funciona desde `file://`, así que sirve la carpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Contacto

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
- LinkedIn: [Iraitz Aristi](https://www.linkedin.com/in/iraitz-a-897731297)
- HackTheBox: [perfil](https://profile.hackthebox.com/profile/019ff283-2707-724f-babf-ca805a383f08)
