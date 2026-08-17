# RedPi — compromising TechNova's web server

**Environment:** personal lab · **Target:** DMZ web server (10.0.0.10) · **Goal:** get a shell on the web server starting from the RedPi auditing box

Part of the **RedPi** project — a simulated TechNova enterprise network
(LAN / DMZ / WAN) audited with a set of custom Python tools. This writeup walks
the offensive chain end to end, from the RedPi machine (connected over VPN) to a
shell on the DMZ web server, using my own tooling.

## Reconnaissance

From RedPi I scanned the DMZ with my own network scanner (built on nmap):

```
Host: 10.0.0.10
21/tcp  open  ftp   vsftpd 3.0.5
22/tcp  open  ssh   OpenSSH 8.2p1
80/tcp  open  http  Apache 2.4.41
```

An Apache server on port 80 with FTP alongside it: port 80 serves a WordPress
site, which becomes the most promising attack surface.

## Web enumeration

My web analysis tool fuzzes common paths. Interesting findings:

```
[200] /wp-admin
[200] /wp-login.php
[200] /wp-json/wp/v2/users
[405] /xmlrpc.php
[200] /readme.html
```

Two stand out: `wp-json/wp/v2/users` and `xmlrpc.php`, both exposed by default in
a standard WordPress installation.

## User enumeration

`/wp-json/wp/v2/users` leaks the list of authors — it returns the `admin`
account name. WordPress exposes this endpoint by default, handing the attacker a
valid username to start from.

## XML-RPC brute force

`xmlrpc.php` accepts the `wp.getUsersBlogs` method, which allows credentials to
be tested outside the login form and with no rate limiting. My XML-RPC brute
force tool runs a wordlist against the `admin` user:

```
[*] Trying 7 passwords against http://10.0.0.10/xmlrpc.php
[+] Valid credentials: admin:7uj*******
```

Credentials obtained.

## Access and foothold

With the `admin` password I logged into `/wp-admin`. The plugin editor was
reachable from the dashboard, so I replaced the code of the inactive **Hello
Dolly** plugin with a PHP reverse shell pointing back to RedPi on port 4444.

I set up a listener:

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

## A note on the attack's origin point (threat model)

One important detail about the reverse shell: **the outcome depends on where the
attack is launched from.**

- Here I ran the chain from **RedPi, located on the internal LAN** (connected
  over VPN through the OpenVPN tunnel). The firewall segments the zones and
  blocks DMZ→LAN traffic, so the callback wasn't getting through. To complete the
  exercise I added a temporary rule allowing port 4444 from the DMZ to RedPi.
  This simulates the scenario of an **internal attacker** (or of a team already
  inside the network).
- A real **external attacker** — the typical cybercriminal case — would point the
  reverse shell at a machine under their control **on the Internet (WAN)**, not on
  the LAN. In that scenario the traffic would leave the DMZ outbound, a direction
  that is usually allowed, and **no firewall change would be needed**.

In other words, the need for the rule isn't a weakness in the chain, but a
consequence of attacking from the inside. The LAN/DMZ segmentation is doing its
job *well* by containing lateral movement toward the internal network; what it
doesn't stop is outbound traffic from the DMZ to the Internet, which is exactly
where a real compromise would escape.

## Remediation

The chain worked because of several default, misconfigured or weak settings.
Recommendations, from highest to lowest impact:

- **Strong passwords + MFA** — `admin:7uj*******` fell to a tiny wordlist; it's
  the root cause of the whole compromise.
- **Disable the plugin/theme editor** — set `DISALLOW_FILE_EDIT` in
  `wp-config.php` so a compromised admin can't inject code.
- **Disable or restrict `xmlrpc.php`** — it enabled brute forcing with no rate
  limiting.
- **Restrict user enumeration in `wp-json`** — don't hand valid usernames to the
  attacker.
- **fail2ban / WAF** to throttle brute force, and **least privilege** for the web
  service account.
- **Egress filtering on the DMZ** — restricting the web server's outbound
  connections kills the reverse shell even from an external attacker.

> Authorized audit of my own lab. The weak password is intentional and for
> teaching purposes.
