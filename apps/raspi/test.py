# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
from packages.hw import Buzzer, Lcd, Led, Servo

if __name__ == "__main__":
    messages = {
        "Sender1": "Este es un mensaje largo que se moverá.",
        "Sender2": "Otro mensaje para mover en la pantalla LCD.",
        "Sender3": "mensaje"
    }
    # Definir las notas y los beats desde el main
    note = [261, 329, 392, 329, 392, 440, 440, 392, 440, 440, 392, 329, 392]
    beat = [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1]

    GPIO.setmode(GPIO.BCM)
    buzzer = Buzzer(note, beat)
    lcd = Lcd(messages)
    servo = Servo(5)
    time.sleep(0.5)
    led = Led(buzzer, servo)
    led.run()
    lcd.move_message()
