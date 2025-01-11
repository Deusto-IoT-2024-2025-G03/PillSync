# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import sys

class Servo:
	def __init__(self,day ,frequency=50):

		self.servo_pin = 12
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(self.servo_pin, GPIO.OUT)
		self.pwm = GPIO.PWM(self.servo_pin, frequency)
		self.pwm.start(0)
		
		self.day = day

	def set_angle(self, angle=0):

		print(f"Configurando ángulo: {angle}°")
		duty = 2 + (angle / 18)
		self.pwm.ChangeDutyCycle(duty)
		time.sleep(0.5)
		self.pwm.ChangeDutyCycle(0)

	def activate_servo(self):

		angles = {0: 0, 1: 30, 2: 60, 3: 90, 4: 120, 5: 150, 6: 180}
		angle = angles.get(self.day, 0)
		self.set_angle(angle)
	def reset(self):
		self.set_angle(0)

if __name__ == "__main__":

    servo = Servo(2)
    servo.activate_servo()
    servo.cleanup()
