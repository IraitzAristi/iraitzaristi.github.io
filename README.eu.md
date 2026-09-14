[English](README.md) · [Castellano](README.es.md) · **Euskara**

# iraitzaristi.github.io

Nire portfolioa. benetan zer dakidan hemen erakusten dut: rooteatu ditudan makinak, eraiki ditudan proiektuak eta
tresnak.

**Portfolioa:** https://iraitzaristi.github.io

## Ezaugarriak

- **Profila / azala** — rola, aurkezpena, trebetasunak, ziurtagiriak eta
  estatistikak (makinak, proiektuak, ziurtagiriak).
- **Makinen katalogoa** — makina bakoitza bere plataforma, zailtasun eta SE-arekin,
  filtroak dituen taula batean (plataformaz eta zailtasunez filtratu ahal da).
- **Writeup-ak eta proiektuak** — Markdown-a orrian dago.
- **3 Hizkuntzetan** — ingelesa / gaztelania / euskara, klik batekin aldatzeko hizkuntza eta
  bisiten artean gogoratua. Ingelesa da lehenetsia, nabigatzailearen hizkuntza
  lehen kargan detektatzen da.

## Teknologia

GitHub Pages-en hedatua.

## Egitura

```
.
├── index.html          # app osoa
├── portfolio.json      # datu guztiak: profila, makinak, atalak
├── writeups/           # makinen writeup-ak (Markdown)
│   └── htb/
└── projects/           # proiektu-fitxak (Markdown, hizkuntzako bertsioekin)
```

## Datu-eredua

Guneak erakusten duen guztia `portfolio.json`-etik dator.

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

`difficulty`-k `Easy`, `Medium`, `Hard`, `Insane` onartzen ditu, bakoitzak bere
kolorea du, eta plataforma/zailtasun filtroak datuetatik sortzen dira.


## Tokian exekutatu


```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Kontaktua

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
- LinkedIn: [Iraitz Aristi](https://www.linkedin.com/in/iraitz-a-897731297)
- HackTheBox: [profila](https://profile.hackthebox.com/profile/019ff283-2707-724f-babf-ca805a383f08)
