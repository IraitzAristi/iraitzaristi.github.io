import random
import string
import hashlib
import os
 
os.system("clear")
print("--------------------------------")
print("|   PASAHITZ GENERADOREA       |")
print("--------------------------------")
print("| 1. Pasahitz berri bat sortu  |")
print("| 0. Atzera                    |")
print("--------------------------------")
aukera = input("\nAukera: ")
 
if aukera == "1":
    luzera = int(input("Pasahitzaren luzera (gutxienez 12): ") or 12) #gutxieneko luzeera 12 karaktere izan behar da
    if luzera < 12:
        luzera = 12
 
    #gutxienez letra larri bat, txiki bat, zenbaki bat eta karaktere berezi bat izan behar du
    karaktereak = string.ascii_letters + string.digits + "!@#$%^&*"
    pasahitza = (
        random.choice(string.ascii_uppercase) + #letra mayuskulak jartzen ditu
        random.choice(string.ascii_lowercase) + #letra minuskulak jartzen ditu
        random.choice(string.digits) + #Zenbakiak jartzen ditu
        random.choice("!@#$%^&*") +
        "".join(random.choices(karaktereak, k=luzera - 4))
    )
    #Karaktereak nahastenm dira horrela aleatorioak dira pasahitzak eta desordenatutak daude
    pasahitza = "".join(random.sample(pasahitza, len(pasahitza)))
 
    hash_sha256 = hashlib.sha256(pasahitza.encode()).hexdigest() #hasheatzen da pasahitza SHA-256 funtzioarekin
 
    print("\n----PASAHITZ BERRIA----")
    print(f"Pasahitza:  {pasahitza}")
    print(f"SHA-256:    {hash_sha256}")
 
input("\nPulsatu intro tekla jaraitzeko")