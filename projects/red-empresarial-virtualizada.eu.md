# RedPi — enpresa-sare birtualizatua + segurtasun suitea

**Graduko amaierako proiektua · 2026** · azpiegitura osoa + tresna propioak + barne-pentest-a

RedPi enpresa-sare simulatu baten hutsetiko eraikuntza da, bretxe garrantzitsu
bat jasan berri zuen enpresa fiktizio batentzat ("TechNova"). Azpiegituraren
gainean Python-eko tresna propioen suite bat garatu nuen —defentsiboak eta
ofentsiboak—, profil teknikorik gabeko langileek erabiltzeko pentsatuak, eta
haiekin ingurunea hasieratik amaierara auditatu nuen.

## Egoera

TechNova, software-enpresa bat, bretxe bat jasaten du eta 20 GB datu sentikor
filtratzen dira. RedPi eskatzen dute: auditoria-tresna multzo bat eta sare
segmentatu eta segurtatu bat, beren segurtasuna neurtzeko eta hobetzeko.

## Azpiegitura

- **Sare segmentatua** VirtualBox-en: **LAN**, **DMZ** eta **WAN**, hiru
  interfazeko **MikroTik** router batek bideratuta.
- **Suebaki-politika**: DMZ→LAN blokeatua, LAN→DMZ baimendua, NAT masquerade
  WAN-erantz — web-zerbitzari publikoak barne-datuetara zuzenean sar ez dadin.
- **MySQL zerbitzaria** (LAN) enpresaren datu-basearekin.
- **Web/FTP zerbitzaria** **Apache + WordPress + vsftpd**-rekin (DMZ).
- Langile eta zuzendaritzako **Ubuntu lanpostuak** (LAN).
- LAN-era hutsetik eraikitako **OpenVPN** tunel baten bidez iristen den **RedPi
  auditoria-makina** — nire **ziurtagiri-autoritate (CA)** eta bezero-zerbitzari
  ziurtagiri propioekin — MikroTik router-aren gainean.

## Python tresna-suitea

**Defentsiboak** — MySQL datu-basearen kudeatzailea, pasahitzen
sendotasun-analizatzailea eta **SHA-256** hash-a egiten duen pasahitz-sortzailea.

**Ofentsiboak** — sare-eskanerra (nmap), web-fuzzer-a, HTTP/FTP sniffer-a, **ARP
spoofer**-a (MITM) eta **XMLRPC indar-gordina**.

## Auditoria martxan

Suitearekin eraso-kate oso bat exekutatu nuen DMZ-ko web-zerbitzariaren aurka —
errekonozimendua → web-fuzzing-a → `wp-json` bidezko erabiltzaile-enumerazioa →
XMLRPC indar gordina → `wp-admin` sarbidea → plugin bidezko reverse shell-a —
web-zerbitzariko shell batean amaituz. Writeup osoa:
[RedPi — TechNovaren web-zerbitzariaren konpromisoa](#writeups/redpi/redpi-technova.md).

## Zer erakusten duen

- **Sare oso bat** hasieratik amaierara diseinatu eta segurtatzea (segmentazioa,
  firewalling-a, routing-a, VPN).
- **PKI**-ren menderatze praktikoa: CA bat sortu eta OpenVPN tunelerako
  ziurtagiriak jaulki.
- Segurtasunaren bi aldeetan **tresna propioak** garatzea.
- **Barne-pentest errealista** bat exekutatu eta dokumentatzea.
- **Ingeniaritza-heldutasuna**: identifikatutako hurrengo urratsak (MITM tresneria
  osoa, barne DNS zerbitzari bat, HTTPS web-zerbitzarian eta zerbitzari ispilu bat).

## Demo

- **Bideo-demoa** (eraso-kate osoa, ~5 min): [YouTube-n ikusi](https://youtu.be/TU_VIDEO)
- **Tresnen kodea**: [github.com/IraitzAristi/redpi-tools](https://github.com/IraitzAristi/redpi-tools)

Laborategia bera ez da banagarria —6+ GB RAM behar ditu eta sare zehatz bati
lotuta dago—, baina bideoak kate osoa erakusten du hasieratik amaierara, eta
tresnak modu autonomoan exekutatzen dira baimendutako edozein helbururen aurka.
Zuzeneko demoa eskuragarri eskaeraren arabera.

## Dokumentazioa

- Proiektuaren aurkezpena (euskaraz):
  <a href="projects/redpi-presentacion.pdf" target="_blank" rel="noopener">redpi-presentacion.pdf</a>
- Memoria tekniko osoa (55 orrialde, euskaraz):
  <a href="projects/redpi-memoria.pdf" target="_blank" rel="noopener">redpi-memoria.pdf</a>

## Teknologiak

VirtualBox · MikroTik RouterOS · OpenVPN · PKI (CA eta ziurtagiriak) · Apache ·
WordPress · MySQL · vsftpd · Python (scapy, nmap) · Linux · Firewall · Routing.
