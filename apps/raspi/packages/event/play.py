from packages.event.types import Event
from time import sleep
import datetime
from packages.hw import Buzzer, Lcd, Servo, Led
from packages.api import fetch, is_valid

def play(e: Event):
    if not is_valid(e, 'event'):
        raise ValueError(f"Invalid event: {e}")

    print(f"Playing event {e.get('id')}...")

    r = fetch(endpoint=f"event/{e.get('id')}", method='POST', body='start')
    if not r.ok:
        print(f"Could not register start of event in API ({r.status_code}): {r}.")

    melody = e.get('melody') or {'notes': [], 'beat': []}

    messages = e.get('messages')

    buzzer = Buzzer(melody.get('notes'), melody.get('beat'))

    day = int(datetime.datetime.today().strftime('%w'))
    print(f"Today is {datetime.datetime.today().strftime('%w')}.\nServing medication in slot {e.get('slot', 0)}...")

    servo = Servo(day)
    sleep(0.5)

    led = Led(buzzer, servo)
    led.run()

    lcd = Lcd(
        dict([ \
            (lambda m: (m.get('from') or '', m.get('text')))(m) \
            for m in messages \
        ])
    )
    lcd.move_message()

    print(f"Event {e.get('id')} has ended.")

    r = fetch(endpoint=f"event/{e.get('id')}", method='POST', body='end')
    if not r.ok:
        print(f"Could not register end of event in API ({r.status_code}): {r}.")
