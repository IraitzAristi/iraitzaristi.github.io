# RedPi - Compromising TechNova's web server

**Environment:** personal lab · **Target:** DMZ web server (10.0.0.10) · **Goal:** get a shell on the web server using the RedPi auditing machine

Part of the **RedPi** project, a simulated TechNova enterprise network
(LAN / DMZ / WAN), audited with custom Python tools. This writeup shows the
offensive chain from start to finish, from the RedPi machine (connected over VPN)
to a shell on the DMZ web server, using my own tools.

## Reconnaissance

From RedPi I scanned the DMZ with my own network scanner (built on nmap):

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

An Apache server on port 80, with an FTP service alongside: port 80 serves a
WordPress site, which becomes the most interesting attack surface.

![DMZ scan from RedPi: web server on 10.0.0.10](writeups/redpi/img/01-recon-scan.png)

## Web enumeration

My web analysis tool fuzzes common paths. The interesting paths I found:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Two stand out: `wp-json/wp/v2/users` and `xmlrpc.php`, both exposed by default in
a standard WordPress installation.

![Web fuzzing: wp-json and xmlrpc.php exposed by default](writeups/redpi/img/02-web-fuzzing.png)

## User enumeration

`/wp-json/wp/v2/users` leaks the list of authors, returning the `admin` account's
username. WordPress exposes this endpoint by default, handing the attacker a valid
username to start from.

![wp-json/wp/v2/users leaking the admin user](writeups/redpi/img/03-wpjson-user-enum.png)

## XML-RPC brute force

`xmlrpc.php` accepts the `wp.getUsersBlogs` method, which allows credentials to be
tested outside the login form and with no rate limiting. My XML-RPC brute-force
tool runs a wordlist against the `admin` user:

```
[*] Trying 7 passwords against http://10.0.0.10/xmlrpc.php
[+] Valid credentials: admin:7ujm8ik,9ol.
```

Credentials obtained.

![XML-RPC brute force recovering admin's credentials](writeups/redpi/img/04-xmlrpc-bruteforce.png)

One nuance worth noting: the system.multicall method is the vector behind real-world mass attacks against WordPress xmlrpc.php, it packs hundreds of login attempts into a single HTTP request, sidestepping per-request rate limiting and leaving one log line instead of thousands. My tool uses the simpler one-attempt-per-request method, which is enough for a single account, but a real defense has to account for multicall, where a WAF or fail2ban sees far fewer events than actual login attempts.

## Access and foothold

With `admin`'s password I logged into `/wp-admin`. The plugin editor was reachable
from the dashboard, so I replaced the code of the inactive **Hello Dolly** plugin
with a PHP reverse shell pointing back to RedPi on port 4444.

I set up a listener on the RedPi machine using Netcat:

```bash
nc -nlvp 4444
```

Activating the plugin (and reloading the page) triggered the connection:

```
Connection received on 10.0.0.10
$ id
uid=33(www-data) gid=33(www-data)
$ pwd
/var/www/html/wordpress/wp-admin
```

Shell as `www-data` on the DMZ web server. Goal achieved.

![Logging into wp-admin with the recovered credentials](writeups/redpi/img/05-wpadmin-login.png)

![PHP reverse shell pasted into the Hello Dolly plugin](writeups/redpi/img/06-plugin-reverse-shell.png)

![Reverse shell caught on RedPi: www-data shell](writeups/redpi/img/07-shell-www-data.png)

## A note on the attack's origin point (threat model)

An important detail about the reverse shell: **the outcome depends on where the
attack is launched from.**

- In this case, I launched the chain **from RedPi, located on the internal LAN**
  (connected over VPN, through the OpenVPN tunnel). The firewall segments the
  zones and blocks DMZ->LAN traffic, so the callback wasn't getting through. To
  complete the exercise, I added a temporary rule allowing port 4444 from the DMZ
  to RedPi. This simulates the scenario of an **internal attacker** (or of a team
  already inside the network).
- A real **external attacker**, the typical cybercriminal case, would point the
  reverse shell at a machine under their control **on the Internet (WAN)**, not on
  the LAN. In that scenario, the traffic would leave the DMZ outbound, a direction
  that is usually allowed, and **the firewall would not need to be touched**.

In other words, the need for the rule is not a weakness in the chain, but a
consequence of attacking from the inside. The LAN/DMZ segmentation does its job
*well*, stopping movement toward the internal network; what it doesn't stop is
outbound traffic from the DMZ to the Internet, which is exactly where a real
compromise would escape.

## Remediation

The chain worked because of several default, misconfigured or weak settings.
Recommendations, from highest to lowest impact:

- **Strong passwords + MFA**, `admin:7ujm8ik,9ol.` fell to a tiny wordlist; it's
  the root of the whole compromise.
- **Disable the plugin/theme editor**, set `DISALLOW_FILE_EDIT` in
  `wp-config.php` so a compromised admin can't inject code.
- **Disable or restrict `xmlrpc.php`**, it enabled brute forcing with no rate
  limiting.
- **Restrict user enumeration in `wp-json`**, don't hand valid usernames to the
  attacker.
- **fail2ban / WAF** to throttle brute force, and **least privilege** for the web
  service account.
- **Egress filtering on the DMZ**, restricting the web server's outbound
  connections kills the reverse shell, even from an external attacker.

> Authorized audit of my own lab. The weak password is intentional and for
> teaching purposes.
