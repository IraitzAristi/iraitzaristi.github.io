import os
import subprocess

def menu():
    while True:
        os.system('clear')
        print("--------------------------------")
        print("|      TRESNA OFENTSIBOAK      |")
        print("--------------------------------")
        print("| 1. Sareko eskanerra          |")
        print("| 2. Web analisia              |")
        print("| 3. Sniffer HTTP/FTP          |")
        print("| 4. ARP Spoofer               |")
        print("| 5. XMLRPC Indar basatia      |")
        print("| 0. Atera                     |")
        print("--------------------------------")

        aukera = input("\nAukera: ")

        if aukera == "1":
            subprocess.run(["python3", "erasoa/sareko_eskanerra.py"])
        elif aukera == "2":
            subprocess.run(["python3", "erasoa/web_analisia.py"])
        elif aukera == "3":
            subprocess.run(["python3", "erasoa/sniffer.py"])
        elif aukera == "4":
            subprocess.run(["python3", "erasoa/arp_spoofer.py"])
        elif aukera == "5":
            subprocess.run(["python3", "erasoa/xmlrpc.py"])
        elif aukera == "0":
            print("Agur")
            break
menu()