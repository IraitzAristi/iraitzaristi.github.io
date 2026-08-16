import os
import subprocess

def menu():
    while True:
        os.system('clear')
        print("-----------------------------")
        print("|        REDPI MENUA        |")
        print("-----------------------------")
        print("| 1. Tresna Defentsiboak    |")
        print("| 2. Tresna Ofentsiboak     |")
        print("| 0. Atera                  |")
        print("-----------------------------")

        aukera = input("\nAukera: ")

        if aukera == "1":
            subprocess.run(["python3", "defentsa/menu_defentsa.py"])
        elif aukera == "2":
            subprocess.run(["python3", "erasoa/menu_erasoa.py"])
        elif aukera == "0":
            print("Agur")
            break
menu()