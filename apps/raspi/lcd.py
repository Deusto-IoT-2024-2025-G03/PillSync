
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import threading
import RPi.GPIO as GPIO
from grove.display.jhd1802 import JHD1802, main as LCDMain


class Lcd:
	def __init__(self, dict):
		self.lcd = JHD1802()
		self.lcd.clear()
		self.lcd.backlight(True)

		self.messages = dict
		self.button = 23

	def move_message(self):
		for sender, message in self.messages.items():
			length = len(message) - 15  # Longitud del mensaje que cabe en la pantalla

			if length > 0:
				while True:
					GPIO.output(self.button - 1, True)
					for i in range(length + 1):
						if not GPIO.input(self.button):
							# Si el botón está presionado
							GPIO.output(self.button - 1, False)
							print("Botón presionado, deteniendo el movimiento.")
							break
						else:
							self.lcd.clear()
							self.lcd.setCursor(1, 0)
							self.lcd.write(sender)
							self.lcd.setCursor(0, 0)
							self.lcd.write(message[i:i + 16])  # Mostrar porciones del mensaje
							time.sleep(0.4)

			else:
				self.lcd.write(message)  # Si el mensaje cabe, mostrarlo sin movimiento
				time.sleep(2)


# Suponiendo que ya tienes una estructura como esta
if __name__ == "__main__":
	messages = {
		"Sender1": "Este es un mensaje largo que se moverá.",
		"Sender2": "Otro mensaje para mover en la pantalla LCD.",
	}

	button_pin = 23  # Número de pin donde tienes conectado el botón
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(22, GPIO.OUT)
	GPIO.setup(23, GPIO.IN, pull_up_down=GPIO_PUD_UP)
	lcd = Lcd(messages, button_pin)
	lcd.move_message()
