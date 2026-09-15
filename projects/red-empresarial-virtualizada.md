# RedPi — virtualized network + security/pentesting suite

**Final degree project · 2026** · full infrastructure + custom tooling + pentest

RedPi is a solution built for a fictional company ("TechNova") that had suffered a
cyberattack. On top of the infrastructure I developed a suite of custom Python
tools (defensive and offensive), designed to be usable by non-technical staff, and
used them to audit the environment end to end.

## Scenario

TechNova, a software company, suffers a breach: as a result, 20 GB of sensitive
data is leaked. They commission RedPi, an audit toolkit plus a segmented, hardened
network to measure and improve the security of the network and its hosts.

## Infrastructure

- **Segmented network** in VirtualBox: **LAN**, **DMZ** and **WAN**, routed by a
  three-interface **MikroTik** router.
- **Firewall**: DMZ→LAN blocked, LAN→DMZ allowed, NAT masquerade to WAN, so the
  public web server can't reach the internal network/data directly.
- **MySQL server** (LAN) with the corporate database.
- **Web/FTP server**: **Apache + WordPress + vsftpd** (DMZ).
- Worker and management **Ubuntu workstations** (LAN).
- **RedPi audit machine** (the pentesting box), reaching the LAN over an **OpenVPN**
  tunnel built from scratch with my own **certificate authority (CA)** and
  client-server certificates (PKI), over the MikroTik router.

## Python tool suite

**Defensive**: MySQL database manager, password-strength analyzer, and a password
generator that hashes with **SHA-256**.

**Offensive**: Network scanner (python-nmap), web fuzzer, HTTP/FTP sniffer, **ARP
spoofer** (MitM) and **XMLRPC brute force**.

## The audit in action

Using the suite I ran a full attack chain against the DMZ web server: recon -> web
fuzzing -> user enumeration via `wp-json/wp/v2/users` -> XMLRPC brute force ->
`wp-admin` access -> a PHP reverse shell through a plugin to land as `www-data` on
the web server. Full write-up:
[RedPi — TechNova web server compromise](#writeups/redpi/redpi-technova.md).

## What it demonstrates

- Designing and securing a **full network** end to end (segmentation, firewalling,
  routing, VPN).
- Practical **PKI** understanding: standing up a CA and issuing/signing certificates
  for the OpenVPN tunnel.
- Building **custom tooling** on both sides of security.
- Running and documenting a **realistic internal pentest**.
- **Engineering maturity**: identified next steps (full MITM tooling, an internal
  DNS server, HTTPS on the web server, and a server mirror).

## Demo

- **Tools source code**: [github.com/IraitzAristi/redpi-tools](https://github.com/IraitzAristi/redpi-tools)

The lab itself isn't distributable, it needs several GB of RAM and is tied to a
specific network, but the tools run standalone against any authorized target, and
a live walkthrough is available on request.

## Technologies

VirtualBox · MikroTik RouterOS · WinBox · OpenVPN · PKI (CA & certificates) ·
Apache · WordPress · MySQL · vsftpd · Python (scapy, nmap) · Linux · Firewall ·
Routing.
