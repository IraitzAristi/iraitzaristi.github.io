# RedPi — virtualized enterprise network + security suite

**Final degree project · 2026** · full infrastructure + custom tooling + internal pentest

RedPi is a from-scratch build of a simulated enterprise network for a fictional
company ("TechNova") that had just suffered a major breach. On top of the
infrastructure I built a suite of custom Python tools — defensive and offensive —
designed to be usable by non-technical staff, and then used them to audit the
environment end to end.

## Scenario

TechNova, a software company, is breached and 20 GB of sensitive data is leaked.
They commission RedPi: a cybersecurity audit toolkit plus a hardened, segmented
network to test and improve their posture.

## Infrastructure

- **Segmented network** in VirtualBox: **LAN**, **DMZ** and **WAN**, routed by a
  **MikroTik** router with three interfaces.
- **Firewall policy**: DMZ→LAN dropped, LAN→DMZ allowed, NAT masquerade to WAN —
  so the public web server can't reach internal data directly.
- **MySQL server** (LAN) holding the corporate database.
- **Apache + WordPress + vsftpd** web/FTP server (DMZ).
- **Worker and management** Ubuntu desktops (LAN).
- **RedPi audit machine** reaching the LAN over an **OpenVPN** tunnel built from
  scratch — my own **certificate authority (CA)** and client-server certificates —
  over the MikroTik router.

## Custom Python tool suite

**Defensive** — MySQL database manager, password-strength analyzer, and a
password generator that hashes with **SHA-256**.

**Offensive** — network scanner (nmap), web fuzzer, HTTP/FTP sniffer, **ARP
spoofer** (MITM), and an **XMLRPC brute-forcer**.

## The audit in action

Using the toolset, I ran a full attack chain against the DMZ web server — recon →
web fuzzing → `wp-json` user enumeration → XMLRPC brute force → `wp-admin` access
→ reverse shell via a plugin — ending in a shell on the web server. Full
walkthrough: [RedPi — TechNova web server compromise](#writeups/redpi/redpi-technova.md).

## What it demonstrates

- Designing and **securing a full network** end to end (segmentation,
  firewalling, routing, VPN).
- Practical command of **PKI**: standing up a CA and issuing certificates for the
  OpenVPN tunnel.
- Building **custom tooling** on both sides of security.
- Running a **realistic internal pentest** and reporting it.
- **Engineering maturity**: identified next steps (full MITM tooling, an internal
  DNS server, HTTPS on the web server, and a server mirror).

## Demo

- **Video walkthrough** (full attack chain, ~5 min): [watch on YouTube](https://youtu.be/TU_VIDEO)
- **Tools source code**: [github.com/IraitzAristi/redpi-tools](https://github.com/IraitzAristi/redpi-tools)

The lab itself isn't distributable — it needs 6+ GB of RAM and is wired to a
specific network — but the video shows the whole chain end to end, and the tools
run standalone against any authorized target. A live walkthrough is available on request.

## Documentation

- Project presentation (pitch deck, in Basque):
  <a href="projects/redpi-presentacion.pdf" target="_blank" rel="noopener">redpi-presentacion.pdf</a>
- Full technical report (55 pages, in Basque):
  <a href="projects/redpi-memoria.pdf" target="_blank" rel="noopener">redpi-memoria.pdf</a>

## Technologies

VirtualBox · MikroTik RouterOS · OpenVPN · PKI (CA & certificates) · Apache ·
WordPress · MySQL · vsftpd · Python (scapy, nmap) · Linux · Firewall · Routing.
