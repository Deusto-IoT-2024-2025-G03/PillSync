import RPi.GPIO as GPIO
import time

BUZZER_PIN = 26

CANCION = 2
BEAT = 2

NOTES = ["ccggaagffeeddc", "eefggfe dceefggfe dceg gfedc cc", "cceg ggaag cceg ggaag ceceg ggaag"]
BEATS = [[1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 4],
	 [1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1],
	 [1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2]]
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

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUZZER_PIN, GPIO.OUT)

def play_tone(frequency, duration_ms):
	period = 1.0 / frequency
	half_period = period / 2.0

	end_time = time.time() + duration_ms / 1000.0
	while time.time() < end_time:
		GPIO.output(BUZZER_PIN, GPIO.HIGH)
		time.sleep(half_period)
		GPIO.output(BUZZER_PIN, GPIO.LOW)
		time.sleep(half_period)

def play_note(note, duration_ms):
	if note in NOTE_FREQUENCIES:
		frequency = NOTE_FREQUENCIES[note]
		play_tone(frequency, duration_ms)

def play_song():
	length = len(NOTES[CANCION])
	for i in range(length):
		note = NOTES[CANCION][i]
		beat_duration = BEATS[BEAT][i] * TEMPO
		if note == ' ':
			time.sleep(beat_duration / 1000.0)
		else:
			play_note(note, beat_duration)
		time.sleep(TEMPO / 2000.0)

if __name__ =="__main__":
	try:
		play_song()
	finally:
		GPIO.cleanup
