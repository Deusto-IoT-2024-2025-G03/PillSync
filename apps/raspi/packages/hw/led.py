# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
from packages.hw import Buzzer, Lcd, Servo

class Led:
    def __init__(self, buzzer, servo):
        self.Led_rgb = 24
        self.Button = 23
        self.buzzer = buzzer
        self.servo = servo

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.Led_rgb, GPIO.OUT)
        GPIO.setup(self.Button - 1, GPIO.OUT)
        GPIO.setup(self.Button, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    def run(self):
        self.servo.activate_servo()
        GPIO.output(self.Led_rgb, False)
        try:
            while True:
                GPIO.output(self.Button - 1, True)
                input_state = GPIO.input(self.Button)
                if input_state:
                    self.buzzer.play_song_loop()  # Play song until button is pressed
                else:
                    self.servo.reset()
                    GPIO.output(self.Button - 1, False)
                    GPIO.output(self.Led_rgb, True)
                    print("Botón presionado, deteniendo buzzer.")
                    break
        except KeyboardInterrupt:
            print("Programa finalizado por el usuario.")
        finally:
            interrupt = 0



if __name__ == "__main__":
    GPIO.setmode(GPIO.BCM)
    buzzer = Buzzer()
    lcd = Lcd()
    servo = Servo()
    time.sleep(0.5)
    led = Led(buzzer, servo)
    led.run()
