import mysql.connector
import os

def konektatu(): #funtzio honekin konektatzen naiz MySQL zerbitzariko datu basera
    return mysql.connector.connect(
        host="172.16.1.10",
        user="redpi",
        password="admin",
        database="technova_db",
    )

def taula_guztiak_ikusi(): #Funtzio honekin taula guztiak zerrendatzen ditut SHOW TABLES; exekutatzen dudalako kursorearekin
    konexioa = konektatu()
    kursorea = konexioa.cursor()
    kursorea.execute("SHOW TABLES;")
    taulak = kursorea.fetchall()
    print("------------")
    print("|  TAULAK  |")
    print("------------")
    for taula in taulak:
        print(taula[0])
    input("Pulsatu intro tekla bueltatzeko")

def taula_bat_ikusi(): #Honekin aukeratzen den taularen edukia ikusten da
    taula1 = input("Taularen izena: ")
    konexioa = konektatu()
    kursorea = konexioa.cursor()
    kursorea.execute(f"SELECT * FROM {taula1} LIMIT 10;")
    zutabeak = kursorea.fetchall()
    for zutabea in zutabeak:
        print(zutabea)
    input("Pulsatu intro tekla bueltatzeko")

def taula_sortu(): #Hau taula berri bat sortzeko da
    taula3 = input("Taularen izena: ")
    #Hemen taula berriaren zutabeak jarri behar dira:
    zutabeak1 = input("Zutabeak (adibidez ID_PRODUKTUA INT PRIMARY KEY, izena VARCHAR(100)...): ")
    konexioa = konektatu()
    kursorea = konexioa.cursor()
    kursorea.execute(f"CREATE TABLE {taula3} ({zutabeak1})")
    konexioa.commit()
    print("Taula ongi sortu da")
    input("Pulsatu intro tekla bueltatzeko")

def taula_ezabatu(): #Hou da taula bat ezabatzeko
    taula4 = input("Taularen izena: ")
    konexioa = konektatu()
    kursorea = konexioa.cursor()
    kursorea.execute(f"DROP TABLE {taula4}") #Drop-ek taula ezabatzen du
    konexioa.commit()
    print("Taula ongi ezabatu da")
    input("Pulsatu intro tekla bueltatzeko")

def datu_berria(): #Funtzio honek egiten duena da taula baten zutabeei balio bat jarri
    taula2 = input("Taularen izena: ")
    zutabeak2 = input("Zutabeak (izena,email...): ")
    balioak = input("Balioak ('Iraitz','iaristiluc@educacion.navarra.es'...): ")
    konexioa = konektatu()
    kursorea = konexioa.cursor()
    kursorea.execute(f"INSERT INTO {taula2} ({zutabeak2}) VALUES ({balioak})")
    konexioa.commit()
    print("Datuak sartu dira taulan")
    input("Pulsatu intro tekla bueltatzeko")

def menu():
    while True:
        os.system("clear")
        print("---------------------------------")
        print("|        MySQL Kudeaketa        |")
        print("---------------------------------")
        print("| 1. Taula guztiak ikusi        |")
        print("| 2. Taula bat ikusi            |")
        print("| 3. Taula sortu                |")
        print("| 4. Taula ezabatu              |")
        print("| 5. Datu berriak sartu         |")
        print("| 0. Atera                      |")
        print("---------------------------------")
        
        aukera = input("\nAukera: ")

        if aukera == "1":
            taula_guztiak_ikusi()
        elif aukera == "2":
            taula_bat_ikusi()
        elif aukera == "3":
            taula_sortu()
        elif aukera == "4":
            taula_ezabatu()
        elif aukera == "5":
            datu_berria()
        elif aukera == "0":
            print("Agur")
            break
menu()