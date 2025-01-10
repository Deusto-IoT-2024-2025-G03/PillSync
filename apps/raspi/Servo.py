import RPi.GPIO as GPIO
import time
import sys

def init(frecuency):
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(12, GPIO.OUT)
	p = GPIO.PWM(12, frecuency)
	p.start(0)
	return p

def set_angle(p, angle=0):
	print(f"angle: {angle}")
	duty = 2 + (angle/18)
	p.ChangeDutyCycle(duty)
	time.sleep(0.5)
	p.ChangeDutyCycle(0)
def activate_servo(p, out=1):
	if (out == 1):
		set_angle(p, 0)
	elif (out == 2):
		set_angle(p, 30)
	elif (out == 3):
		set_angle(p, 60)
	elif (out == 4):
		set_angle(p, 90)
	elif (out == 5):
		set_angle(p, 120)
	elif (out == 6):
		set_angle(p, 150)
	elif (out == 7):
		set_angle(p, 180)
if __name__ == "__main__":
	print("Argumentos", sys.argv)
	p = init(int(sys.argv[1]))
	activate_servo(p, int(sys.argv[2]))
	GPIO.cleanup()
