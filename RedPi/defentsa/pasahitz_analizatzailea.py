import mysql.connector
import os
from datetime import datetime

#Pasahitz arruntak igual pasatzen dute segurtasun filtroak baino inseguruak dira
PASAHITZ_ARRUNTAK = ["admin", "password", "123456", "qwerty", "1234", "abc123", "letmein"]
 
def konektatu(): #MySQl zerbitzariko datu basera konektatu horrela datu basean gordeta dauden pasahitzak analizatu ahalko dira
    return mysql.connector.connect(
        host="172.16.1.10",
        user="redpi",
        password="admin",
        database="technova_db"
    )
 
def analizatu(pasahitza, izena=""):
    puntuazioa = 0
    mezuak = []
    oraingo_urtea = str(datetime.now().year) #hau jarri dut ikusteko ea pasahitzen bat dagoen 2026 zenbakiarekin jarrita (urtea)
 
    if pasahitza.lower() in PASAHITZ_ARRUNTAK:
        mezuak.append("- Pasahitz hau oso arrunta da")
        return 0, mezuak
 
    if izena and izena.lower() in pasahitza.lower():
        mezuak.append("- Pasahitzak ez du erabiltzailearen izena eduki behar")
        puntuazioa -= 4
 
    if oraingo_urtea in pasahitza: #ikusten du ea pasahitzak gaur egungo urtea daukan jarrita (2026)
        mezuak.append("- Pasahitzak urte aktuala dauka")
        puntuazioa -= 4
 
    if len(pasahitza) >= 8: #ikusten du ea zenbak8 karaktere edo gehiagodituen
        puntuazioa += 2
    else:
        mezuak.append("- Gutxienez 8 karaktere behar ditu")
 
    if any(c.isupper() for c in pasahitza): #ikusten du ea mayuskulak dagoen
        puntuazioa += 2
    else:
        mezuak.append("- Letra larri bat behar du")
 
    if any(c.islower() for c in pasahitza): #ikusten du ea minuskulak dauden
        puntuazioa += 2
    else:
        mezuak.append("- Letra txiki bat behar du")
 
    if any(c.isdigit() for c in pasahitza): #ikusten du ea zenbakirik dagoen
        puntuazioa += 2
    else:
        mezuak.append("- Zenbaki bat behar du") 
 
    if any(c in "!@#$%^&*+-" for c in pasahitza): #ikusten du ea karaketere berezirik dagoen
        puntuazioa += 2
    else:
        mezuak.append("- Karaktere berezi bat behar du")
 
    puntuazioa = max(0, min(puntuazioa, 10))
    return puntuazioa, mezuak
 
os.system("clear")
print("--------------------------------")
print("|   PASAHITZ ANALIZATZAILEA    |")
print("--------------------------------")
print("| 1. Datu baseko pasahitzak    |")
print("| 0. Atzera                    |")
print("--------------------------------")
aukera = input("\nAukera: ")
 
if aukera == "1":
    konexioa = konektatu()
    kursor = konexioa.cursor()
    kursor.execute("SELECT izena, pasahitza FROM ERABILTZAILEA") #Erabiltzailea taulako pasahitzak hartzen ditu analizatzeko
    erabiltzaileak = kursor.fetchall()
    for erabiltzailea in erabiltzaileak:
        izena = erabiltzailea[0]
        pasahitza = erabiltzailea[1]
        puntuazioa, mezuak = analizatu(pasahitza, izena)
        print(f"\n----{izena}----")
        print(f"Puntuazioa: {puntuazioa} / 10")
        if puntuazioa <= 4:
            print("Segurtasuna: AHULA")
        elif puntuazioa <= 7:
            print("Segurtasuna: ERTAINA")
        else:
            print("Segurtasuna: SEGURUA")
        if mezuak:
            for m in mezuak:
                print(f"  {m}")
 
input("\nPulsatu intro tekla jaraitzeko")