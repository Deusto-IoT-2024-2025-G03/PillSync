from packages.event.types import Event
from packages.api.validation import is_valid
from packages.event.play import play
import schedule
import datetime

TIMEZOME = datetime.datetime.now().astimezone().tzname()

def schedule_event(e: Event):
    if not is_valid(e, 'event'):
        raise ValueError(f"Invalid event: {e}")

    sched = e.get('trigger').get('schedule')
    minute = sched.get('minute')
    hour = sched.get('hour')
    dayOfMonth = sched.get('dayOfMonth')
    month = sched.get('month')
    dayOfWeek = sched.get('dayOfWeek')

    if \
        minute == '*' and \
        hour == '*' and \
        dayOfMonth == '*' and \
        month == '*' and \
        dayOfWeek == '*' \
    :
        play(e)
        return

    try:
        minute = int(minute)
    except:
        pass

    job: schedule.Job
    if dayOfWeek == '*':
        job = schedule.every().day
    elif dayOfWeek == 0 or dayOfWeek == 'sun':
        job = schedule.every().sunday
    elif dayOfWeek == 1 or dayOfWeek == 'mon':
        job = schedule.every().monday
    elif dayOfWeek == 2 or dayOfWeek == 'tue':
        job = schedule.every().tuesday
    elif dayOfWeek == 3 or dayOfWeek == 'wed':
        job = schedule.every().wednesday
    elif dayOfWeek == 4 or dayOfWeek == 'thu':
        job = schedule.every().thursday
    elif dayOfWeek == 5 or dayOfWeek == 'fri':
        job = schedule.every().friday
    elif dayOfWeek == 6 or dayOfWeek == 'sat':
        job = schedule.every().saturday
    else:
        job = schedule.every().day

    if isinstance(hour, int):
        if isinstance(minute, int):
            job = job.at(f"{hour}:{minute}")
        else:
            job = job.at(f"{hour}:00")
    elif isinstance(minute, int):
        job = job.at(f"00:{minute}").minute

    job.tag(e.get('id'))

    job.do(play, e)
