**English** · [Castellano](README.es.md) · [Euskara](README.eu.md)

# iraitzaristi.github.io

My offensive-security portfolio — a "second CV" that shows what I can actually
do: machines I've rooted, projects I've built, and the tooling behind them.
Built by hand with vanilla HTML, CSS and JavaScript. No framework.

**Live:** https://iraitzaristi.github.io

## Features

- **Profile / landing** — role, pitch, skills, certifications and live stats
  (machines, projects, certifications) computed straight from the data.
- **Machines catalog** — every box with its platform, difficulty and OS, in a
  filterable table (filter by platform and difficulty) that scans like a CV.
- **Writeups & projects** — Markdown rendered in-page with syntax highlighting.
- **Trilingual** — English / Spanish / Basque, switchable with one click and
  remembered across visits. English is the default; the browser language is
  auto-detected on first load.

## Tech

Plain HTML/CSS/JS, no build step. Rendering libraries loaded from CDN:
[marked](https://github.com/markedjs/marked) (Markdown),
[highlight.js](https://github.com/highlightjs/highlight.js) (code) and
[DOMPurify](https://github.com/cure53/DOMPurify) (sanitisation).
Deployed on GitHub Pages.

## Structure

```
.
├── index.html          # the whole app (HTML + CSS + JS)
├── portfolio.json      # all the data: profile, machines, sections
├── writeups/           # machine writeups (Markdown)
│   └── htb/
└── projects/           # project cards (Markdown, with per-language versions)
```

## Data model

Everything the site shows comes from `portfolio.json`. Short fields that need
translation are objects keyed by language; long documents point to per-language
Markdown files.

**Add a machine** — write the `.md` under `writeups/<platform>/`, then add an
entry to `machines`:

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

`difficulty` accepts `Easy`, `Medium`, `Hard`, `Insane` — each gets its own
colour, and the platform/difficulty filters build themselves from the data.

**Add a translated document** — the base `file` is written in the default
language (English). Point `file_i18n` at the translated versions:

```json
"file": "projects/name.md",
"file_i18n": {
  "es": "projects/name.es.md",
  "eu": "projects/name.eu.md"
}
```

If a document isn't translated yet, the site falls back to the base language and
shows a small notice — it never breaks.

## Run locally

`fetch()` doesn't work from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Contact

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
- LinkedIn: [Iraitz Aristi](https://www.linkedin.com/in/iraitz-a-897731297)
- HackTheBox: [profile](https://profile.hackthebox.com/profile/019ff283-2707-724f-babf-ca805a383f08)
