# Enpresa-sare birtualizatua + zibersegurtasun suitea

**Graduko amaierako proiektua · 2026** · azpiegitura osoa + tresna propioak

**Enpresa-sare oso birtualizatu** baten diseinua eta hedapena, sarearen
arkitekturatik segurtasun-tresneriaraino. Helburua: azpiegitura errealista,
segmentatua eta gogortua hutsetik muntatzea, eta haren gainean tresna propioen
multzo bat sortzea, defentsiboak zein ofentsiboak.

## Azpiegitura

- Sare osoaren **birtualizazioa** VirtualBox-en, **LAN/DMZ** segmentazioarekin
  eta zonen arteko suebakiarekin.
- **Apache web-zerbitzaria** SSH/FTP bidezko sarbidearekin.
- **MySQL zerbitzaria**, datu-base batekin eta langile zein zuzendaritzarako
  lanpostu bereiziekin.
- Raspberry Pi batetik LAN sarerako **urruneko sarbide segurua**, **hutsetik
  konfiguratutako OpenVPN** baten bidez — ziurtagiri-autoritate (CA) eta
  bezero-zerbitzari konfiantzazko ziurtagiri propioak — **MikroTik** router
  baten gainean.

## Python tresna-suitea

Raspberry Pi-tik exekutatuta, bi frontetan banatuta:

**Defentsiboak**
- MySQL datu-basearen kudeatzailea.
- Pasahitzen sendotasun-neurgailua.
- Pasahitz-sortzailea **SHA-256** hash-arekin.

**Ofentsiboak**
- **ARP spoofer**-a man-in-the-middle erasoetarako.
- HTTP/FTP trafikoaren **sniffer**-a.
- Web **fuzzer**-a.
- **Indar gordina** WordPress-en XML-RPC-aren aurka.
- Ataka, zerbitzu eta host/sare bertsioen **eskanerra**.

## Zer erakusten duen

- **Sare-azpiegitura oso bat diseinatzeko eta segurtatzeko** gaitasuna,
  hasieratik amaierara, ez pieza solteak soilik.
- **PKI**-ren menderatze praktikoa: CA bat sortu eta VPN baterako ziurtagiriak
  jaulki.
- Sare-segmentazioa eta **firewalling**-a irizpidez (LAN/DMZ).
- Python-en **tresna propioak** garatzea segurtasunaren bi aldeetan: defentsa
  eta erasoa.

## Teknologiak

Birtualizazioa · OpenVPN · MikroTik RouterOS · Apache · MySQL · Python ·
Raspberry Pi · Linux · Firewall · Routing · PKI (CA eta ziurtagiriak).

> SMR zikloaren amaierako proiektua. Tresnen kodea eta hedapenaren
> dokumentazioa nire GitHub-en argitaratuko dira.
