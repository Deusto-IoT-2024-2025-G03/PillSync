from typing import Literal, TypeAlias, TypedDict, List, Union

Message = TypedDict('Message', {
    'from': str,
    'text': str
})

Melody = TypedDict('Melody', {
    'notes': List[int],
    'beat': List[int]
})

Schedule = TypedDict('Schedule', {
    'minute': str | int,
    'hour': str | int,
    'dayOfMonth': str | int,
    'month': str | int,
    'dayOfWeek': str | int
})

Trigger = TypedDict('Trigger', {
    'schedule': Schedule
})

Duration = int

Slot = Union[Literal[0], Literal[1], Literal[2]]

Event = TypedDict('Event', {
    'id': str,
    'host': str,

    'messages': List[Message],
    'melody': Melody | None,

    'trigger': Trigger,
    'duration': Duration,

    'slot': Slot
})
