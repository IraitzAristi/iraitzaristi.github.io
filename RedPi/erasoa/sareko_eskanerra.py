import nmap  # pip3 install python-nmap behar da
import os

def eskaneatu():
    helbidea = input("IP edo sarea (adib: 10.0.0.10 edo 10.0.0.0/24): ")
    mota = input("Eskaneatzeko mota (1=azkarra, 2=zehatza, 3=zerbitzuak): ")

    nm = nmap.PortScanner()  #hau sortu behar da nmap erabiltzeko
    print("\nEskanatzen...")

    if mota == "1":
        nm.scan(helbidea, arguments="-sn")  #-sn jarrita ez ditu portuak eskatzen eta azkarragoa da
        for host in nm.all_hosts():
            print("Host aktiboa:", host, nm[host].hostname())

    elif mota == "2":
        nm.scan(helbidea, "1-1024", arguments="-sT")  #1-1024 portu arruntak dira
        for host in nm.all_hosts():
            print("\nHost:", host)
            for proto in nm[host].all_protocols():
                for port in nm[host][proto]:
                    estado = nm[host][proto][port]["state"]  #"state" open edo closed da (uste dut filtered ere zegoela)
                    print(f"Portua {port}/{proto}: {estado}")

    elif mota == "3":
        nm.scan(helbidea, "1-1024", arguments="-sV")  #-sV-rekin zerbitzuaren bertsioa ateratzen du
        for host in nm.all_hosts():
            print("\nHost:", host)
            for proto in nm[host].all_protocols():
                for port in nm[host][proto]:
                    info = nm[host][proto][port]
                    print(f"{port}/{proto}: {info['state']} - {info['name']} {info['version']}")

    input("\nPulsatu intro tekla jarraitzeko")

def menu():
    while True:
        os.system('clear')
        print("--------------------------")
        print("|     SARE ESKANERRA     |")
        print("--------------------------")
        print("| 1. Eskaneatu sarea     |")
        print("| 0. Atzera              |")
        print("--------------------------")
        aukera = input("\nAukera: ")
        if aukera == "1":
            eskaneatu()
        elif aukera == "0":
            break

menu()