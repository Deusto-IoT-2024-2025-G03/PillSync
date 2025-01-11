from ..api.fetch import fetch
from ..sys.env import init_env
from os import getenv, getlogin
from getmac import get_mac_address

USERNAME: str | None
MAC: str | None
HASH: str | None

HEADER = "X-Host"

def hash():
    global USERNAME
    global MAC
    global HASH

    if HASH:
        return hash

    if not USERNAME:
        USERNAME = getlogin()

    if not USERNAME:
        raise ValueError('Could not get username.')

    if not MAC:
        MAC = get_mac_address()

    if not MAC:
        raise ValueError('Could not get MAC address.')

    r = fetch(endpoint='host/match', method='POST', body={'user': USERNAME, 'mac': MAC})
    if not r.ok:
        raise Exception({'message': 'Could not get host hash.', 'cause': r})

    HASH = r.text
    return HASH
