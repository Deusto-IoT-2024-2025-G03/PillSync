#!/usr/bin/env python3

from typing_extensions import List
from packages.api import get_session, fetch, is_valid
from packages.host import HEADER as HOST_HEADER, hash
from packages.event import play, Event
from typing import Dict
from schedule import every, repeat, run_pending, clear
import json
import time
from RPi import GPIO

EVENTS: List[Dict] | None = None
FETCH_EVERY_MINUTES = 15
HASH: str | None = None

def get_my_events():
    global HASH
    global EVENTS

    if not HASH:
        HASH = hash()
        headers = {HOST_HEADER: HASH}
        session = get_session()
        session.headers.update(headers)

    try:
        EVENTS = fetch(endpoint='event').json()
    except Exception as e:
        if not EVENTS:
            raise e

        print(e)
        return EVENTS

    def appendHost(e: Event):
        if not e.get('host', None):
            e['host'] = HASH

        return e

    EVENTS = [{k: v for k, v in e.items() if v != None} for e in EVENTS]
    EVENTS = [appendHost(e) for e in EVENTS]

    def validate_event(e):
        if is_valid(e, 'event'):
            return True

        print(f"Not valid: {e}")
        return False

    EVENTS = [e for e in EVENTS if validate_event(e)]
    print(f"Events fetched and validated: {[(lambda e: e.get(id))(e) for e in EVENTS]}")
    return EVENTS

@repeat(every(FETCH_EVERY_MINUTES).minutes)
def main():
    clear()

    text: str | None = None
    try:
        with open("events.json", "r", encoding='utf-8') as f:
            text = json.load(f)

    except FileNotFoundError:
        pass

    if text:
        if not HASH:
            HASH = hash()
            headers = {HOST_HEADER: HASH}
            session = get_session()
            session.headers.update(headers)

        r = fetch(endpoint='event', method='PUT', body=text)
        if not r.ok:
            print(f"Could not PUT events ({r.status_code}): {r.json() if r.status_code == 400 else r}.")

    for e in get_my_events():
        play(e)

    while True:
        run_pending()
        time.sleep(1)

    GPIO.cleanup()

if __name__ == '__main__':
    main()
