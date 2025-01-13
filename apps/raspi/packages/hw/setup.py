from RPi import GPIO

SETUP = False

def setup():
    global SETUP

    GPIO.setmode(GPIO.BCM)

    SETUP = True
