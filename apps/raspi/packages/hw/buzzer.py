# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
from typing import List
from .setup import setup

Notes = List[int]
Beat = List[int]

SETUP = False

class Buzzer:
    BUZZER_PIN = 26
    TEMPO = 300  # Tempo base

    def __init__(self, notes: Notes, beat: Beat):
        global SETUP

        self.notes = notes  # Asignar las notas pasadas
        self.beat = beat  # Asignar los beats pasados

        setup()
        if not SETUP:
            GPIO.setup(self.BUZZER_PIN, GPIO.OUT)
            SETUP = True

    @staticmethod
    def play_tone(frequency, duration_ms):
        period = 1.0 / frequency
        half_period = period / 2.0

        end_time = time.time() + duration_ms / 1000.0
        while time.time() < end_time:
            GPIO.output(Buzzer.BUZZER_PIN, GPIO.HIGH)
            time.sleep(half_period)
            GPIO.output(Buzzer.BUZZER_PIN, GPIO.LOW)
            time.sleep(half_period)

    def play_song_loop(self):
        if len(self.notes) != len(self.beat):
            raise ValueError("The number of notes and beats must match.")

        while True:  # Bucle infinito para tocar la canción
            for i in range(len(self.notes)):
                n = self.notes[i]
                b = self.beat[i] * Buzzer.TEMPO
                if n == ' ':
                    time.sleep(b / 1000.0)
                else:
                    self.play_tone(n, b)
                time.sleep(self.TEMPO / 2000.0)

                # Revisar el estado del botón en cada iteración
                if not GPIO.input(23):  # Si el botón está presionado
                    return  # Salir del bucle de la canción


if __name__ == "__main__":
    # Definir las notas y los beats desde el main
    notes = [261, 329, 392, 329, 392, 440, 440, 392, 440, 440, 392, 329, 392]
    beat = [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1]

    buzzer = Buzzer(notes, beat)  # Crear instancia de Buzzer
    buzzer.play_song_loop()  # Pasar las notas y beats al método play_song_loop

    GPIO.cleanup()  # Limpiar el GPIO después de que termine la ejecución
