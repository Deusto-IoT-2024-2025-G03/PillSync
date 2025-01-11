# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time

class Buzzer:

	BUZZER_PIN = 26
	CANCION = 2
	BEAT = 2
	NOTES = ["ccggaagffeeddc", "eefggfe dceefggfe dceg gfedc cc", "cceg ggaag cceg ggaag ceceg ggaag"]
	BEATS = [
		[1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2]
	]
	TEMPO = 300

	NOTE_FREQUENCIES = {
		'c': 261, # Do
		'd': 294, # Re
		'e': 329, # Mi
		'f': 349, # Fa
		'g': 392, # Sol
		'a': 440, # La
		'b': 494, # Si
		'C': 523  # Do
	}

	def __init__(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(self.BUZZER_PIN, GPIO.OUT)

	def play_tone(frequency, duration_ms):
		period = 1.0 / frequency
		half_period = period / 2.0

		end_time = time.time() + duration_ms / 1000.0
		while time.time() < end_time:
			GPIO.output(Buzzer.BUZZER_PIN, GPIO.HIGH)
			time.sleep(half_period)
			GPIO.output(Buzzer.BUZZER_PIN, GPIO.LOW)
			time.sleep(half_period)

	def play_note(note, duration_ms):
		if note in Buzzer.NOTE_FREQUENCIES:
			frequency = Buzzer.NOTE_FREQUENCIES[note]
			Buzzer.play_tone(frequency, duration_ms)

	def play_song():
		length = len(Buzzer.NOTES[Buzzer.CANCION])
		for i in range(length):
			note = Buzzer.NOTES[Buzzer.CANCION][i]
			beat_duration = Buzzer.BEATS[Buzzer.BEAT][i] * Buzzer.TEMPO
			if note == ' ':
				time.sleep(beat_duration / 1000.0)
			else:
				Buzzer.play_note(note, beat_duration)
			time.sleep(Buzzer.TEMPO / 2000.0)

	def play_song_loop():

		length = len(Buzzer.NOTES[Buzzer.CANCION])
		while True:  # Bucle infinito para tocar la canción en bucle
			for i in range(length):
				note = Buzzer.NOTES[Buzzer.CANCION][i]
				beat_duration = Buzzer.BEATS[Buzzer.BEAT][i] * Buzzer.TEMPO
				if note == ' ':
					time.sleep(beat_duration / 1000.0)
				else:
					Buzzer.play_note(note, beat_duration)
				time.sleep(Buzzer.TEMPO / 2000.0)
				
				# Revisar el estado del botón en cada iteración
				if not GPIO.input(23):  # Si el botón está presionado
					return  # Salir del bucle de la canción
if __name__ == "__main__":
	try:
		play_song()
	finally:
		GPIO.cleanup
