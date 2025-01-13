from RPi import GPIO

SETUP = False

def setup():
    global SETUP

    GPIO.setup(GPIO.BCM)

    SETUP = True
