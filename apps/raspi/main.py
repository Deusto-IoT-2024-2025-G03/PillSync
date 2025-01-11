from .host.host import HEADER, hash
from .api.fetch import fetch
from .api.validate import validate

if __name__ == '__main__':
    headers = {HEADER: hash()}
    schemas = fetch(endpoint='event/schema').json
