# RedPi - sare birtualizatua + segurtasun/pentesting suitea

**Gradu amaierako proiektua · 2026** · azpiegitura osoa + tresna propioak + pentest

RedPi Proiektua soluzio bat da, zibereraso bat sufritu zuen enpresa fiktizio batentzat ("TechNova"). Azpiegituraren
gainean Python-ekin tresna propioen suite bat garatu nuen (defentsiboak eta
ofentsiboak), profil teknikorik gabeko langileek erabiltzeko pentsatuta daude, eta
tresna haiekin ingurunea hasieratik amaierara auditatu nuen.

## Egoera

TechNova, software enpresa bat, segurtasun arazo bat dauka eta zibereraso bat sufritzen du, zibererasoaren ondorioz 20 GB datu sentikor
filtratzen dira. RedPi eskatzen dute: auditoria-tresna multzo bat eta sare
segmentatu eta segurtatu bat, sarearen eta ekipoen segurtasuna neurtzeko eta hobetzeko.

## Azpiegitura

- **Sare segmentatua** VirtualBox-en: **LAN**, **DMZ** eta **WAN**, hiru
  interfazeko **MikroTik** router batek bideratuta.
- **Suebakia**: DMZ->LAN blokeatua, LAN->DMZ baimendua, NAT masquerade
  WAN-erantz, web-zerbitzari publikoak barne sarera/datuetara zuzenean ez sartzeko.
- **MySQL zerbitzaria** (LAN) enpresaren datu basearekin.
- **Web/FTP zerbitzaria**: **Apache + WordPress + vsftpd** (DMZ).
- Langile eta zuzendaritzako **Ubuntu lanpostuak** (LAN).
- **RedPi auditoria makina** (Pentesting-erako makina), 0-tik muntatutako **OpenVPN** tunel batetik iristen da LANera, nire **ziurtagiri-autoritate (CA)** eta bezero-zerbitzari
  ziurtagiri propioekin (PKI), MikroTik router-aren gainean.

## Python tresna-suitea

**Defentsiboak** — MySQL datu-basearen kudeatzailea, pasahitzen
segurtasun-analizatzailea eta pasahitzak **SHA-256** algoritmoarekin/funtzioarekin hasheatzen dituen pasahitz generadorea.

**Ofentsiboak** — sare-eskanerra (python-nmap), web fuzzer-a, HTTP/FTP sniffer-a, **ARP
spoofer**-a (MitM) eta **XMLRPC indar basatia**.

## Auditoria martxan

Suitearekin eraso kate oso bat exekutatu nuen DMZ-ko web-zerbitzariaren aurka,
errekonozimendua -> web fuzzing-a -> `wp-json/wp/v2/users` erabiltzaileak enumeratzeko ->
XMLRPC indar basatia -> `wp-admin` sarbidea -> PHP plugin bidezko reverse shell-a
web zerbitzarian www-data erabiltzailea bezala sarbidea lortzeko. Writeup osoa:
[RedPi — TechNovaren web-zerbitzariaren konpromisoa](#writeups/redpi/redpi-technova.md).

## Zer erakusten duen

- **Sare oso bat** hasieratik amaierara diseinatu eta segurtatzea (segmentazioa,
  firewalling-a, routing-a, VPN).
- **PKI**-ren ulermen praktikoa: CA bat sortu eta OpenVPN tunelerako
  ziurtagiriak sortu eta sinatu.
- Segurtasunaren bi aldeetan **tresna propioak** garatzea.
- **Barne pentest errealista** bat exekutatu eta dokumentatzea.
- **Ingeniaritza heldutasuna**: identifikatutako hurrengo urratsak (MITM tresneria
  osoa, barne DNS zerbitzari bat, HTTPS web-zerbitzarian eta zerbitzari ispilu bat).

## Demo

- **Tresnen kodea**: [github.com/IraitzAristi/redpi-tools](https://github.com/IraitzAristi/redpi-tools)

Laborategia bera ez da banagarria, RAM GB asko behar ditu eta sare zehatz bati
lotuta dago, baina tresnak modu autonomoan exekutatzen dira baimendutako edozein
helbururen aurka. Zuzeneko demoa eskuragarri eskaeraren arabera.

## Teknologiak

VirtualBox · MikroTik RouterOS · WinBox · OpenVPN · PKI (CA eta ziurtagiriak) ·
Apache · WordPress · MySQL · vsftpd · Python (scapy, nmap) · Linux · Firewall ·
Routing.
