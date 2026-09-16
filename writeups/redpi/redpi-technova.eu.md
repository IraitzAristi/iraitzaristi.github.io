# RedPi - TechNovaren web zerbitzariaren konpromisoa

**Ingurunea:** norberaren laborategia · **Helburua:** DMZ-ko web zerbitzaria (10.0.0.10) · **Xedea:** web zerbitzarian shell bat lortzea, RedPi auditoria-makina erabiltzen

**RedPi** proiektuaren parte da, TechNovaren enpresa sare simulatu bat
(LAN / DMZ / WAN), Python-eko tresna propioekin auditatua. Writeup honek
kate ofentsiboa hasieratik amaiera arte erakusten du, RedPi makinatik
(VPN bidez konektatua) DMZ-ko web zerbitzariko shell bateraino, nire tresnak
erabiliz.

## Errekonozimendua

RedPitik DMZ-a nire sare-eskaner propioarekin (nmap-en oinarritua) eskaneatu nuen:

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

80. portuan Apache zerbitzari bat, FTP zerbitzuarekin: 80. portuak WordPress gune
bat zerbitzatzen du, eta hori bihurtzen da erasorako gainazalik interesgarriena.

![DMZ-ren eskaneoa RedPi-tik: web-zerbitzaria 10.0.0.10-ean](writeups/redpi/img/01-recon-scan.png)

## Web enumerazioa

Nire web-analisi tresnak ohiko rutak fuzzing bidez aztertzen ditu. Aurkitu dudan ruta
interesgarriak:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Bik nabarmentzen dira: `wp-json/wp/v2/users` eta `xmlrpc.php`, biak lehenetsita
agertzen dira WordPress instalazio estandar batean.

![Web fuzzing-a: wp-json eta xmlrpc.php lehenetsita agerian](writeups/redpi/img/02-web-fuzzing.png)

## Erabiltzaileen enumerazioa

`/wp-json/wp/v2/users`-ek egileen zerrenda filtratzen du, `admin` kontuaren
erabiltzaile izena itzultzen du. WordPress-ek endpoint hau lehenetsita erakusten du, eta
erasotzaileari baliozko erabiltzaile izen bat oparitzen dio hasteko.

![wp-json/wp/v2/users admin erabiltzailea filtratzen](writeups/redpi/img/03-wpjson-user-enum.png)

## XML-RPC fitxategiari indar basatia

`xmlrpc.php`-k `wp.getUsersBlogs` metodoa onartzen du, eta horrek kredentzialak
login formularioaz kanpo eta mugarik gabe probatzeko aukera ematen du. Nire
XML-RPC indar basatizko tresnak hiztegi bat probatzen du `admin` erabiltzailearen
aurka:

```
[*] 7 pasahitz probatzen http://10.0.0.10/xmlrpc.php aurka
[+] Baliozko kredentzialak: admin:7uj*******
```

Kredentzialak lortuta.

![XML-RPC indar-gordina admin-en kredentzialak berreskuratzen](writeups/redpi/img/04-xmlrpc-bruteforce.png)

## Sarbidea eta foothold-a

`admin`-en pasahitzarekin `/wp-admin`-en saioa hasi nuen. Plugin-editorea
paneletik eskuragarri zegoen, orduan **Hello Dolly** plugin inaktiboaren kodea
PHP reverse shell batekin ordezkatu nuen, RedPi-ra 4444 portura apuntatuz.

Listener bat jarri nuen entzuten RedPi makinan Netcat erabiliz:

```bash
nc -nlvp 4444
```

Plugina aktibatzean (eta orria birkargatzean) konexioa abiarazi zen:

```
Connection received on 10.0.0.10
$ id
uid=33(www-data) gid=33(www-data)
$ pwd
/var/www/html/wordpress/wp-admin
```

Shell-a `www-data` erabiltzailean DMZ-ko web zerbitzarian. Helburua beteta.

![wp-admin-en saioa berreskuratutako kredentzialekin](writeups/redpi/img/05-wpadmin-login.png)

![PHP reverse shell-a Hello Dolly plugin-ean itsatsita](writeups/redpi/img/06-plugin-reverse-shell.png)

![Reverse shell-a RedPi-n jasota: www-data shell-a](writeups/redpi/img/07-shell-www-data.png)

## Erasoaren jatorriari buruzko oharra (mehatxu-eredua)

Reverse shell-ari buruzko xehetasun garrantzitsu bat: **emaitza erasoa nondik
abiarazten den araberakoa da.**

- Kasu honetan, katea **RedPitik abiarazi nuen, barneko LANean kokatua** (VPN
  bidez konektatua, OpenVPN tunelaren bidez). Suebakiak zonak segmentatzen ditu
  eta DMZ->LAN trafikoa blokeatzen du, beraz, itzulerako konexioa ez zen iristen.
  Ariketa osatzeko, aldi baterako arau bat gehitu nuen, 4444 ataka DMZ-tik
  RedPira baimenduz. Honek **barneko erasotzaile** baten agertokia simulatzen du
  (edo sarean dagoeneko sartuta dagoen talde batena).
- **Kanpoko erasotzaile** erreal batek, zibergaizkile ohikoaren kasua, reverse
  shell-a bere kontrolpeko makina batera apuntatuko luke **Interneten (WAN)**, ez
  LANean. Agertoki horretan, trafikoa DMZ-tik kanpora aterako litzateke, normalean
  baimenduta dagoen norabidea, eta **ez litzateke suebakia ukitu beharko**.

Hau da, arauaren beharra ez da katearen ahulezia bat, barnetik erasotzearen
ondorioa baizik. LAN/DMZ segmentazioak *ondo* egiten du bere lana, barne-sarerako
mugimendua geldituz; geldiarazten ez duena DMZ-tik Internetera doan irteerako
trafikoa da, eta hortik ihes egingo luke konpromiso erreal batek.

## Neurriak (mitigazioa)

Katea hainbat konfigurazio lehenetsi, gaizki ezarri edo ahulengatik funtzionatu
zuen. Gomendioak, eraginik handienetik txikienera:

- **Pasahitz sendoak + MFA**, `admin:7uj*******` hiztegi txiki batekin erori zen;
  konpromiso osoaren sustraia da.
- **Plugin/gai editorea desgaitu**, `DISALLOW_FILE_EDIT` ezarri `wp-config.php`-n,
  konprometitutako admin batek kodea injektatu ezin dezan.
- **`xmlrpc.php` desgaitu edo murriztu**, mugarik gabeko indar-gordinezko erasoa
  ahalbidetu zuen.
- **`wp-json`-eko erabiltzaile-enumerazioa murriztu**, ez oparitu baliozko
  erabiltzaile-izenak erasotzaileari.
- **fail2ban / WAF** indar-gordinezko erasoa moteltzeko, eta **pribilegio
  minimoa** web-zerbitzuaren kontuarentzat.
- **DMZ-ko irteerako iragazketa (egress filtering)**, web zerbitzariaren irteerako
  konexioak murrizteak reverse shell-a hiltzen du, kanpoko erasotzaile batengandik
  ere.

> Nire laborategiaren auditoretza baimendua. Pasahitz ahula nahita eta helburu
> didaktikoarekin dago.
