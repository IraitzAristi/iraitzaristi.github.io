import requests  # pip3 install requests
import os

#direktorio arruntak probatzen ditut
direktorioak = ["admin", "login", "wp-admin", "wp-login.php", "backup",
                "xmlrpc.php", "wp-config.php.bak", "robots.txt", ".git",
                "uploads", "phpmyadmin", "readme.html", "wp-json/wp/v2/users"] 
#Azkeneko direktorio honek normalean wrdpress-are erabiltzaile izenak ditu

os.system("clear")
print("--------------------------------")
print("|       WEB ANALISIA           |")
print("--------------------------------")

url = input("URL biktima (adibidez http://10.0.0.10): ")
if not url.startswith("http"): #http gabe ez du funtzionatzen
    url = f"http://{url}"

print(f"\nFuzzing hasten da: {url}\n")

aurkituak = []
for direktorioa in direktorioak:
    try:
        r = requests.get(f"{url}/{direktorioa}", timeout=5)  # 5 segundo baino gehiago bada saltatzen du
        if r.status_code in [200, 301, 302, 403]:  #403 ere apuntatu dut, hori esan nahi du dagoela baino ezin da sartu
            print(f"Aurkitu da: [{r.status_code}] /{direktorioa}")
            aurkituak.append(direktorioa)
        else:
            print(f"[{r.status_code}] /{direktorioa}")
    except:
        print(f"Errorea: /{direktorioa}")  #batzuetan timeout ematen du eta hemen sartzen da

print(f"\nAmaituta. {len(aurkituak)} direktorio aurkitu dira.")
input("\nPulsatu intro tekla jaraitzeko")
