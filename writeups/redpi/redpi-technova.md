# RedPi — TechNova web server compromise

**Environment:** self-built lab · **Target:** DMZ web server (10.0.0.10) · **Goal:** reach the web server from the RedPi audit machine

Part of the RedPi project — a simulated TechNova enterprise network (LAN / DMZ /
WAN) audited with a custom Python toolset. This writeup walks the offensive path
end to end, from the RedPi machine (connected over VPN) to a shell on the DMZ web
server, using my own tools.

## Recon

From RedPi I scanned the DMZ with my own network scanner (nmap-based):

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

An Apache server on 80 with FTP alongside — a WordPress site.

## Web enumeration

My web-analysis tool fuzzes common paths. Interesting hits:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Two findings stand out: `wp-json/wp/v2/users` and `xmlrpc.php`, both exposed by
default in a stock WordPress install.

## Username enumeration

`/wp-json/wp/v2/users` leaks the author list — it returns the `admin` account
name. WordPress exposes this endpoint by default, handing an attacker a valid
username for free.

## XMLRPC brute force

`xmlrpc.php` accepts `wp.getUsersBlogs`, which lets you test credentials away
from the login form and without rate limiting. My XMLRPC brute-forcer runs a
wordlist against the `admin` user:

```
[*] Trying 7 passwords against http://10.0.0.10/xmlrpc.php
PASSWORD: admin:7ujm8ik,9ol.
```

Credentials recovered.

## Access & foothold

With the admin password I logged into `/wp-admin`. The plugin editor was
reachable from the panel, so I replaced the code of the inactive **Hello Dolly**
plugin with a PHP reverse shell pointing back to RedPi on port 4444.

One catch: RedPi sits on the LAN and the firewall drops DMZ→LAN traffic, so the
callback couldn't reach it. I added a targeted firewall rule allowing port 4444
from the DMZ to RedPi, then started a listener:

```bash
nc -nlvp 4444
```

Activating the plugin (and reloading the page) triggered the callback:

```
Connection received on 10.0.0.10
$ id
uid=33(www-data) gid=33(www-data)
$ pwd
/var/www/html/wordpress/wp-admin
```

Shell as `www-data` on the DMZ web server. Objective met.

## Remediation

The chain worked because of several default-on, misconfigured or weak settings:

- **Disable or restrict `xmlrpc.php`** — it enabled unthrottled credential brute forcing.
- **Restrict `wp-json` user enumeration** — don't hand out valid usernames.
- **Disable the plugin/theme editor** — set `DISALLOW_FILE_EDIT` in `wp-config.php` so a compromised admin can't drop code.
- **Strong passwords + MFA** — `7ujm8ik,9ol.` fell to a tiny wordlist.
- **fail2ban / WAF** and **least privilege** for the web user.

> Authorized audit of my own lab. The weak password is intentional and didactic.
