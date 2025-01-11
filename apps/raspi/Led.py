import RPi.GPIO as GPIO
import time
from Buzzer import Buzzer


class Led:
    def __init__(self, buzzer, lcd):
        self.Led_rgb = 24
        self.Button = 23
        self.buzzer = buzzer
        self.lcd = lcd

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.Led_rgb, GPIO.OUT)
        GPIO.setup(self.Button - 1, GPIO.OUT)
        GPIO.setup(self.Button, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    def run(self):
        GPIO.output(self.Led_rgb, False)
        try:
            while True:
                GPIO.output(self.Button - 1, True)
                input_state = GPIO.input(self.Button)
                if input_state:
                    self.buzzer.play_song_loop()  # Play song until button is pressed
                else:
                    GPIO.output(self.Button - 1, False)
                    time.sleep(0.5)
                    GPIO.output(self.Led_rgb, True)
                    self.lcd.display_message("Botón presionado", 0)
                    print("Botón presionado, deteniendo buzzer.")
                    break
        except KeyboardInterrupt:
            print("Programa finalizado por el usuario.")
        finally:
            GPIO.cleanup()



if __name__ == "__main__":
    buzzer = Buzzer()
    lcd = LCD()
    led = Led(buzzer, lcd)
    led.run()

