import RPi.GPIO as GPIO
import time
import sys
from grove import LCD as lcd

Buzzer = 26
Led = 24
Button = 23

GPIO.setmode(GPIO.BCM)
GPIO.setup(Led, GPIO.OUT)
GPIO.setup(Buzzer, GPIO.OUT)
GPIO.setup(Button - 1, GPIO.OUT)
GPIO.setup(Button, GPIO.IN, pull_up_down=GPIO.PUD_UP)



try:
	GPIO.output(Led, False)
	while True:
		GPIO.output(Button - 1, False)
		input_state = GPIO.input(Button)
		if not input_state:
			GPIO.output(Button - 1, True)
			GPIO.output(Buzzer, True)
			time.sleep(0.5)
			GPIO.output(Led, True)
			GPIO.output(Buzzer, False)
except KeyboardInterrupt:
	print("Led.py finalizado")
finally:
	sjndf = 0
	#GPIO.cleanup()
