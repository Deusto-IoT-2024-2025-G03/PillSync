from packages.event.types import Event
import RPi.GPIO as GPIO
import time
from packages.hw.buzzer import Buzzer
from packages.hw.lcd import Lcd
from packages.hw.servo import Servo
from packages.hw.led import Led
from packages.api import fetch, is_valid

def play(e: Event):
    if not is_valid(e, 'event'):
        raise ValueError(f"Invalid event: {e}")

    r = fetch(endpoint=f"event/{e.get('id')}", method='POST', body='start')
    if not r.ok:
        print(f"Could not register start of event in API ({r.status_code}): {r}.")

    melody = e.get('melody') or {'notes': [], 'beat': []}

    messages = e.get('messages')

    buzzer = Buzzer(melody.get('notes'), melody.get('beat'))

    servo = Servo(5)
    time.sleep(0.5)

    led = Led(buzzer, servo)
    led.run()

    lcd = Lcd(
        dict([ \
            (lambda m: (m.get('from') or '', m.get('text')))(m) \
            for m in messages \
        ])
    )
    lcd.move_message()

    r = fetch(endpoint=f"event/{e.get('id')}", method='POST', body='end')
    if not r.ok:
        print(f"Could not register end of event in API ({r.status_code}): {r}.")
