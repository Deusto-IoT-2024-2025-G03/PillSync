import RPi.GPIO as GPIO
import time
import sys


class Servo:
    def __init__(self, frequency=50):
        """
        Inicializa el servo motor en el pin GPIO 12 con la frecuencia dada.
        """
        self.servo_pin = 12
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.servo_pin, GPIO.OUT)
        self.pwm = GPIO.PWM(self.servo_pin, frequency)
        self.pwm.start(0)

    def set_angle(self, angle=0):
        """
        Configura el ángulo del servo motor.
        :param angle: Ángulo deseado (0 a 180 grados).
        """
        print(f"Configurando ángulo: {angle}°")
        duty = 2 + (angle / 18)
        self.pwm.ChangeDutyCycle(duty)
        time.sleep(0.5)
        self.pwm.ChangeDutyCycle(0)

    def activate_servo(self, out=1):
        """
        Activa el servo motor con una posición predeterminada basada en el valor de `out`.
        :param out: Valor (1 a 7) que define el ángulo preestablecido.
        """
        angles = {1: 0, 2: 30, 3: 60, 4: 90, 5: 120, 6: 150, 7: 180}
        angle = angles.get(out, 0)
        self.set_angle(angle)

    def cleanup(self):
        """
        Limpia el GPIO y detiene el PWM.
        """
        self.pwm.stop()
        GPIO.cleanup()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python servo.py <frecuencia> <posición (1-7)>")
        sys.exit(1)

    try:
        frequency = int(sys.argv[1])
        position = int(sys.argv[2])
        servo = Servo(frequency)
        servo.activate_servo(position)
    except ValueError:
        print("Por favor, ingrese valores válidos para la frecuencia y posición.")
    finally:
        servo.cleanup()