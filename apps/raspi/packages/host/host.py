from packages.api.fetch import fetch
from os import getlogin
from getmac import get_mac_address

USERNAME: str | None = None
MAC: str | None = None
HASH: str | None = None

HEADER = "X-Host"

def hash():
    global USERNAME
    global MAC
    global HASH

    if HASH:
        return HASH

    if not USERNAME:
        USERNAME = getlogin()

    if not USERNAME:
        raise ValueError('Could not get username.')

    if not MAC:
        MAC = get_mac_address()

    if not MAC:
        raise ValueError('Could not get MAC address.')

    r = fetch(endpoint='host/hash', method='POST', body={'user': USERNAME, 'mac': MAC})
    if not r.ok:
        raise Exception({'message': 'Could not get host hash.', 'cause': r})

    HASH = r.text
    return HASH
