[English](README.md) · [Castellano](README.es.md) · **Euskara**

# iraitzaristi.github.io

Nire segurtasun ofentsiboko portfolioa — benetan zer dakidan erakusten duen
"bigarren curriculuma": errotu ditudan makinak, eraiki ditudan proiektuak eta
horien atzeko tresnak. Eskuz egina HTML, CSS eta JavaScript hutsarekin.
Framework-ik gabe.

**Zuzenean:** https://iraitzaristi.github.io

## Ezaugarriak

- **Profila / azala** — rola, aurkezpena, trebetasunak, ziurtagiriak eta zuzeneko
  estatistikak (makinak, proiektuak, ziurtagiriak) datuetatik zuzenean kalkulatuak.
- **Makinen katalogoa** — makina bakoitza bere plataforma, zailtasun eta SE-arekin,
  taula iragazgarri batean (plataformaz eta zailtasunez iragazi), CV bat bezala eskaneatzeko.
- **Writeup-ak eta proiektuak** — Markdown-a orrian bertan errendatua, kode-nabarmentzearekin.
- **Hirueleduna** — ingelesa / gaztelania / euskara, klik batekin aldagarria eta
  bisiten artean gogoratua. Ingelesa da lehenetsia; nabigatzailearen hizkuntza
  lehen kargan detektatzen da.

## Teknologia

HTML/CSS/JS hutsa, konpilazio-urratsik gabe. Errendatze-liburutegiak CDNtik kargatuta:
[marked](https://github.com/markedjs/marked) (Markdown),
[highlight.js](https://github.com/highlightjs/highlight.js) (kodea) eta
[DOMPurify](https://github.com/cure53/DOMPurify) (garbiketa).
GitHub Pages-en hedatua.

## Egitura

```
.
├── index.html          # app osoa (HTML + CSS + JS)
├── portfolio.json      # datu guztiak: profila, makinak, atalak
├── writeups/           # makinen writeup-ak (Markdown)
│   └── htb/
└── projects/           # proiektu-fitxak (Markdown, hizkuntzako bertsioekin)
```

## Datu-eredua

Guneak erakusten duen guztia `portfolio.json`-etik dator. Itzulpena behar duten
eremu laburrak hizkuntzaz indexatutako objektuak dira; dokumentu luzeek hizkuntzako
Markdown fitxategietara egiten dute erreferentzia.

**Makina bat gehitu** — idatzi `.md`-a `writeups/<plataforma>/`-n, eta gehitu sarrera
bat `machines`-i:

```json
{
  "title": "Makinaren izena",
  "platform": "HackTheBox",
  "difficulty": "Medium",
  "os": "Linux",
  "date": "2026-02-01",
  "file": "writeups/htb/izena.md",
  "tags": ["web", "sqli"]
}
```

`difficulty`-k `Easy`, `Medium`, `Hard`, `Insane` onartzen ditu — bakoitzak bere
kolorea du, eta plataforma/zailtasun iragazkiak datuetatik sortzen dira.

**Itzulitako dokumentu bat gehitu** — oinarrizko `file`-a lehenetsitako hizkuntzan
idazten da (ingelesa). Seinalatu `file_i18n` itzulitako bertsioetara:

```json
"file": "projects/izena.md",
"file_i18n": {
  "es": "projects/izena.es.md",
  "eu": "projects/izena.eu.md"
}
```

Dokumentu bat oraindik itzulita ez badago, guneak oinarrizko hizkuntzara jotzen du
eta ohar txiki bat erakusten du — inoiz ez da hausten.

## Tokian tokian exekutatu

`fetch()`-ek ez du `file://`-tik funtzionatzen, beraz zerbitzatu karpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Kontaktua

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
- LinkedIn: [Iraitz Aristi](https://www.linkedin.com/in/iraitz-a-897731297)
- HackTheBox: [profila](https://profile.hackthebox.com/profile/019ff283-2707-724f-babf-ca805a383f08)
