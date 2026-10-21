[Castellano](README.md) · **Euskara** · [English](README.en.md)

# iraitzaristi.github.io

Nire portfolioa. benetan zer dakidan hemen erakusten dut: Rooteatu ditudan makinak, eraiki ditudan proiektuak eta
tresnak.

**Portfolioa:** https://iraitzaristi.github.io

## Ezaugarriak

- **Profila / azala**: rola, aurkezpena, trebetasunak, ziurtagiriak eta
  estatistikak (makinak, proiektuak, ziurtagiriak).
- **Makinen katalogoa**: makina bakoitza bere plataforma, zailtasun eta SE-arekin,
  filtroak dituen taula batean (plataformaz eta zailtasunez filtratu ahal da).
- **Writeup-ak eta proiektuak**: Markdown-a orrian dago.
- **3 Hizkuntzetan**: ingelesa/gaztelania/euskara, klik batekin aldatzeko hizkuntza eta
  bisiten artean gogoratua. Gaztelania da lehenetsia, nabigatzailearen hizkuntza
  lehen kargan detektatzen da. Ingelesezko bertsioa itzulpen gisa markatuta dago.

## Teknologia

Gune estatikoa (HTML/CSS/JS vanilla) GitHub Pages-en hedatua, frontend-erako **IAren laguntzarekin** eraikia programazio-laguntzaile gisa. Ez naiz front-end garatzaile profesionala, baina gunea **datuek gidatua** dago: eduki guztia (profila, makinak, proiektuak, atalak) `portfolio.json`-etik kudeatzen da, beraz nik neuk mantentzen eta eskalatzen dut fitxategi hori editatuz, kodea ukitu gabe. Edukia (writeup-ak, proiektuak, analisia) erabat nirea da.

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

**Makina bat gehitu**: idatzi `.md`-a `writeups/<plataforma>/`-n, eta gehitu sarrera
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

## Commit historialaren buruzko oharra

2026ko urrian nire GitHub-eko repositorioen commit-historia garbitu nuen. Testu- eta estilo-aldaketa txikiko ehunka commit zituzten, GitHub-eko webetik eginak, eta ez zuten ezer gehitzen historia irakurtzean. Garbiketa hutsa izan zen: edukia ez zen aldatu.

- **Repositorio hau (portfolioa) eta nire profileko README-aren repositorioa:** historia berrabiarazi nuen, eta commit bakarra geratu zen.
- **[osint-actor-profile](https://github.com/IraitzAristi/osint-actor-profile) eta [RedPi-Tools](https://github.com/IraitzAristi/RedPi-Tools):** README-ak aldatzen zituzten commitak bakarrik garbitu nituen, aurrekoekin bateratuz; beraz, haien aldaketak mantentzen dira. Kode-commitak oso-osorik gordetzen dira, jatorrizko datekin.

## Kontaktua

- GitHub: [@IraitzAristi](https://github.com/IraitzAristi)
