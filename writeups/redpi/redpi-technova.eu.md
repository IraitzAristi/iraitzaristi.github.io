# RedPi — TechNovaren web-zerbitzariaren konpromisoa

**Ingurunea:** norberaren laborategia · **Helburua:** DMZ-ko web-zerbitzaria (10.0.0.10) · **Xedea:** web-zerbitzarira iristea RedPi auditoria-makinatik

RedPi proiektuaren parte — TechNovaren enpresa-sare simulatu bat (LAN / DMZ /
WAN), Python-eko tresna propioekin auditatua. Writeup honek eraso-katea
hasieratik amaierara jarraitzen du, RedPi makinatik (VPN bidez konektatuta)
DMZ-ko web-zerbitzariko shell bateraino, nire tresnak erabiliz.

## Errekonozimendua

RedPi-tik DMZ eskaneatu nuen nire sare-eskanerrarekin (nmap-en oinarritua):

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

Apache zerbitzari bat 80. portuan, FTP ondoan — WordPress gune bat.

## Web-enumerazioa

Nire web-analisi tresnak ohiko bideen fuzzing-a egiten du. Aurkikuntza
interesgarriak:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Bi nabarmentzen dira: `wp-json/wp/v2/users` eta `xmlrpc.php`, biak lehenetsita
agerian WordPress instalazio estandar batean.

## Erabiltzaileen enumerazioa

`/wp-json/wp/v2/users`-ek egileen zerrenda filtratzen du — `admin` kontuaren
izena itzultzen du. WordPress-ek endpoint hau lehenetsita erakusten du,
erasotzaileari erabiltzaile baliozko bat oparituz.

## XMLRPC indar gordina

`xmlrpc.php`-k `wp.getUsersBlogs` onartzen du, eta horrek kredentzialak
login-formularioaz kanpo eta mugarik gabe probatzeko aukera ematen du. Nire
XMLRPC indar-gordineko tresnak hiztegi bat probatzen du `admin` erabiltzailearen
aurka:

```
[*] 7 pasahitz probatzen http://10.0.0.10/xmlrpc.php-ren aurka
PASAHITZA: admin:7ujm8ik,9ol.
```

Kredentzialak lortuta.

## Sarbidea eta foothold-a

Admin pasahitzarekin `/wp-admin`-en saioa hasi nuen. Plugin-editorea eskuragarri
zegoen paneletik, beraz **Hello Dolly** plugin inaktiboaren kodea PHP reverse
shell batekin ordezkatu nuen, RedPi-ra 4444. portura seinalatuz.

Xehetasun bat: RedPi LAN-ean dago eta suebakiak DMZ→LAN trafikoa mozten du, beraz
itzulerako konexioa ez zen iristen. Suebaki-arau puntual bat gehitu nuen 4444.
portua DMZ-tik RedPi-ra baimentzeko, eta listener bat jarri nuen:

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

Shell-a `www-data` gisa DMZ-ko web-zerbitzarian. Helburua beteta.

## Mitigazioa

Katea funtzionatu zuen lehenetsitako, gaizki konfiguratutako edo ahuleko ezarpen
batzuengatik:

- **`xmlrpc.php` desgaitu edo mugatu** — mugarik gabeko indar gordina ahalbidetu zuen.
- **`wp-json`-en erabiltzaile-enumerazioa mugatu** — ez oparitu baliozko erabiltzaileak.
- **Plugin/gai-editorea desgaitu** — `DISALLOW_FILE_EDIT` jarri `wp-config.php`-n, arriskatutako admin batek koderik injektatu ez dezan.
- **Pasahitz sendoak + MFA** — `7ujm8ik,9ol.` hiztegi txiki batekin erori zen.
- **fail2ban / WAF** eta **pribilegio minimoa** web-erabiltzailearentzat.

> Nire laborategiaren auditoria baimendua. Pasahitz ahula nahita eta didaktikoa da.
