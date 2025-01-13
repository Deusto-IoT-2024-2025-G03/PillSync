# -*- coding: utf-8 -*-

import time
import RPi.GPIO as GPIO
from grove.display.jhd1802 import JHD1802
from .setup import setup

class Lcd:
    def __init__(self, dict, button=23):
        self.lcd = JHD1802()
        self.lcd.clear()
        self.lcd.backlight(True)

        self.messages = dict
        self.button = button

        setup()
        GPIO.setup(self.button - 1, GPIO.OUT)
        GPIO.setup(self.button, GPIO.IN)

    def move_message(self):
        for sender, message in self.messages.items():
            length = len(message) - 15  # Longitud del mensaje que cabe en la pantalla
            GPIO.output(self.button - 1, True)
            if length > 0:
                for i in range(length + 1):
                    if not GPIO.input(self.button):
                        # Si el botón está presionado
                        GPIO.output(self.button - 1, False)
                        print("Boton presionado, siguiente mensaje")
                        time.sleep(1)
                        self.lcd.clear()
                        self.lcd.setCursor(0, 0)
                        break
                    else:
                        self.lcd.clear()
                        self.lcd.setCursor(0, 0)
                        self.lcd.write(message[i:i + 16]) # Mostrar porciones del mensaje
                        self.lcd.setCursor(1, 0)
                        self.lcd.write(sender)
                        time.sleep(0.5)

            else:
                self.lcd.clear()
                self.lcd.setCursor(0, 0)
                self.lcd.write(message) # Si el mensaje cabe, mostrarlo sin movimiento
                self.lcd.setCursor(1, 0)
                self.lcd.write(sender)
                while True:
                    if not GPIO.input(self.button):
                        GPIO.output(self.button -1, False)
                        print("Boton presionado, siguiente mensaje")
                        break

if __name__ == "__main__":
    messages = {
        "Sender1": "Este es un mensaje largo que se moverá.",
        "Sender2": "Otro mensaje para mover en la pantalla LCD.",
        "Sender3": "mensaje"
    }
    button_pin = 23  # Número de pin donde tienes conectado el botón
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(22, GPIO.OUT)
    GPIO.setup(23, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    lcd = Lcd(messages)
    lcd.move_message()
