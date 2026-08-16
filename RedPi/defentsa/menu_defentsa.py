import os
import subprocess

def menu():
    while True:
        os.system('clear')
        print("---------------------------------")
        print("|      TRESNA DEFENTSIBOAK      |")
        print("---------------------------------")
        print("| 1. MySQL kudeaketa            |")
        print("| 2. Pasahitz analizatzailea    |")
        print("| 3. Pasahitz generadorea       |")
        print("| 0. Atera                      |")
        print("---------------------------------")

        aukera = input("\nAukera: ")

        if aukera == "1":
            subprocess.run(["python3", "defentsa/mysql_kudeaketa.py"])
        elif aukera == "2":
            subprocess.run(["python3", "defentsa/pasahitz_analizatzailea.py"])
        elif aukera == "3":
            subprocess.run(["python3", "defentsa/pasahitz_generadorea.py"])
        elif aukera == "0":
            print("Agur")
            break
menu()