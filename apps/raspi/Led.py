import RPi.GPIO as GPIO
import time
import sys
from Buzzer import Buzzer

class Led:
	def main():
		Led_rgb = 24
		Button = 23

		GPIO.setmode(GPIO.BCM)
		GPIO.setup(Led_rgb, GPIO.OUT)
		GPIO.setup(Button - 1, GPIO.OUT)
		GPIO.setup(Button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
		try:
			GPIO.output(Led_rgb, False)
			Buzzer.play_song()
			while True:
				GPIO.output(Button - 1, True)
				input_state = GPIO.input(Button)
				if not input_state:
					GPIO.output(Button - 1, False)
					time.sleep(0.5)
					GPIO.output(Led_rgb, True)
		except KeyboardInterrupt:
			print("Led.py finalizado")
		finally:
			sjndf = 0
if __name__ == "__main__":
	Led.main()
	print(buzzer.BUZZER_PIN)
