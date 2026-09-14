**English** · [Castellano](README.es.md) · [Euskara](README.eu.md)

# iraitzaristi.github.io

My portfolio. Here I show what I actually know how to do: machines I've rooted, projects I've built and tools.

**Portfolio:** https://iraitzaristi.github.io

## Features

- **Profile / landing**: role, pitch, skills, certifications and stats (machines, projects, certifications).
- **Machines catalog**: each machine with its platform, difficulty and OS, in a filterable table (filter by platform and difficulty).
- **Writeups & projects**: Markdown rendered in-page.
- **In 3 languages**: English/Spanish/Basque, switchable with one click and remembered across visits. English is the default, the browser language is detected on first load.

## Technology

Deployed on GitHub Pages.

## Structure

```
.
├── index.html          # the whole app
├── portfolio.json      # all the data: profile, machines, sections
├── writeups/           # machine writeups (Markdown)
│   └── htb/
└── projects/           # project cards (Markdown, with per-language versions)
```

## Data model

Everything the site shows comes from `portfolio.json`.

**Add a machine**: write the `.md` under `writeups/<platform>/`, then add an entry to `machines`:

```json
{
  "title": "Machine name",
  "platform": "HackTheBox",
  "difficulty": "Medium",
  "os": "Linux",
  "date": "2026-02-01",
  "file": "writeups/htb/name.md",
  "tags": ["web", "sqli"]
}
```

`difficulty` accepts `Easy`, `Medium`, `Hard`, `Insane`, each gets its own colour, and the platform/difficulty filters build themselves from the data.

## Run locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Contact

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
- LinkedIn: [Iraitz Aristi](https://www.linkedin.com/in/iraitz-a-897731297)
- HackTheBox: [profile](https://profile.hackthebox.com/profile/019ff283-2707-724f-babf-ca805a383f08)
