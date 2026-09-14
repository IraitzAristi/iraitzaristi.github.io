[English](README.md) · **Castellano** · [Euskara](README.eu.md)

# iraitzaristi.github.io

Mi portfolio. Aquí muestro lo que de verdad sé hacer: máquinas que he rooteado, proyectos que he construido y herramientas.

**Portfolio:** https://iraitzaristi.github.io

## Funciones

- **Perfil / portada**: rol, presentación, skills, certificaciones y estadísticas (máquinas, proyectos, certificaciones).
- **Catálogo de máquinas**: cada máquina con su plataforma, dificultad y SO, en una tabla filtrable (por plataforma y dificultad).
- **Writeups y proyectos**: Markdown renderizado en la página.
- **En 3 idiomas**: inglés/castellano/euskera, conmutable con un clic y recordado entre visitas. El inglés es el idioma por defecto, el del navegador se detecta en la primera carga.

## Tecnología

Desplegado en GitHub Pages.

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

## Contacto

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
- LinkedIn: [Iraitz Aristi](https://www.linkedin.com/in/iraitz-a-897731297)
- HackTheBox: [perfil](https://profile.hackthebox.com/profile/019ff283-2707-724f-babf-ca805a383f08)
