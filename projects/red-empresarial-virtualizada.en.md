# Virtualized enterprise network + security tool suite

**Final degree project · 2026** · complete infrastructure + custom tooling

Design and deployment of a **complete virtualized enterprise network**, from the
network architecture to the security tooling. The goal: build a realistic,
segmented and hardened infrastructure from scratch, and on top of it a set of
custom tools — both defensive and offensive.

## Infrastructure

- **Virtualization** of the whole network in VirtualBox with **LAN/DMZ**
  segmentation and a firewall between zones.
- **Apache web server** with SSH/FTP access.
- **MySQL server** with a database and separate employee and management
  workstations.
- **Secure remote access** from a Raspberry Pi to the LAN through an **OpenVPN
  configured from scratch** — my own certificate authority (CA) and
  client-server trust certificates — over a **MikroTik** router.

## Python tool suite

Run from the Raspberry Pi, split into two fronts:

**Defensive**
- MySQL database manager.
- Password strength meter.
- Password generator with **SHA-256** hashing.

**Offensive**
- **ARP spoofer** for man-in-the-middle attacks.
- HTTP/FTP traffic **sniffer**.
- Web **fuzzer**.
- **Brute force** against WordPress XML-RPC.
- Port, service and host/network version **scanner**.

## What it demonstrates

- The ability to **design and secure a complete network infrastructure** end to
  end, not just isolated pieces.
- Practical command of **PKI**: standing up a CA and issuing certificates for a
  VPN.
- Network segmentation and **firewalling** with intent (LAN/DMZ).
- Building **custom tooling** in Python on both sides of security: defense and
  offense.

## Technologies

Virtualization · OpenVPN · MikroTik RouterOS · Apache · MySQL · Python ·
Raspberry Pi · Linux · Firewall · Routing · PKI (CA and certificates).

> Final project of the SMR programme. The tool code and deployment
> documentation will be published on my GitHub.
