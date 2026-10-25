**Castellano** · [Euskara](README.eu.md) · [English](README.en.md)

# iraitzaristi.github.io

Mi portfolio. Aquí muestro lo que de verdad sé hacer: máquinas que he rooteado, proyectos que he construido y herramientas.

**Portfolio:** https://iraitzaristi.github.io

## Funciones

- **Perfil / portada**: rol, presentación, skills, certificaciones y estadísticas (máquinas, proyectos, certificaciones).
- **Catálogo de máquinas**: cada máquina con su plataforma, dificultad y SO, en una tabla filtrable (por plataforma y dificultad).
- **Writeups y proyectos**: Markdown renderizado en la página.
- **En 3 idiomas**: inglés/castellano/euskera, conmutable con un clic y recordado entre visitas. El castellano es el idioma por defecto; el del navegador se detecta en la primera carga. La versión en inglés está marcada como traducción.

## Tecnología

Sitio estático (HTML/CSS/JS vanilla) desplegado en GitHub Pages, construido **con ayuda de IA** como asistente de programación para el frontend. No soy desarrollador front-end profesional, pero el sitio está **dirigido por datos**: todo el contenido (perfil, máquinas, proyectos, secciones) se gestiona desde `portfolio.json`, así que lo mantengo y lo escalo yo mismo editando ese archivo, sin tocar el código. El contenido (writeups, proyectos, análisis) es íntegramente mío.

## Estructura

```
.
├── index.html          # toda la app
├── portfolio.json      # todos los datos: perfil, máquinas, secciones
├── writeups/           # writeups de máquinas (Markdown)
│   └── htb/
└── projects/           # fichas de proyecto (Markdown, con versiones por idioma)
```

## Modelo de datos

Todo lo que muestra el sitio viene de `portfolio.json`.

**Añadir una máquina**: escribe el `.md` en `writeups/<plataforma>/` y añade una entrada a `machines`:

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

`difficulty` acepta `Easy`, `Medium`, `Hard`, `Insane`, cada uno con su color, y los filtros de plataforma/dificultad se generan solos a partir de los datos.

## Ejecutar en local

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Nota sobre el historial

En octubre de 2026 limpié el historial de commits de mis repositorios de GitHub. Tenían cientos de commits pequeños de ajustes de texto y estilo, hechos desde la web de GitHub, que no aportaban nada al leer el historial. Fue solo limpieza: el contenido no cambió.

- **Este repositorio (portfolio) y el del README de mi perfil:** reinicié el historial, que quedó en un solo commit.
- **[osint-actor-profile](https://github.com/IraitzAristi/osint-actor-profile) y [RedPi-Tools](https://github.com/IraitzAristi/RedPi-Tools):** solo limpié los commits que modificaban los README, fusionándolos con los anteriores, así que sus cambios se mantienen. Los commits de código se conservan intactos, con sus fechas originales.

## Contacto

- Gmail: [@IraitzAristi](mailto:iraitzaristi@gmail.com]
