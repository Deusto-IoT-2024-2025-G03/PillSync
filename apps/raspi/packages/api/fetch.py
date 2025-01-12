from packages.sys import init_env
from os import getenv
from requests import Session
from typing import Literal, Unpack, TypedDict, NotRequired, Mapping
from typing import Iterable
from typing import Any
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_URL: str | None = None

HTTP_METHOD = Literal[
    "GET",
    "POST",
    "HEAD",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    # "CONNECT",
    # "TRACE"
]

FETCH_KWARGS = TypedDict('FETCH_KWARGS', {
    'endpoint': str,
    'method': NotRequired[HTTP_METHOD],
    'headers': NotRequired[Mapping[str, str | bytes | None]],
    'body': NotRequired[
        Iterable[bytes]
        | str
        | bytes
        | list[tuple[Any, Any]]
        | tuple[tuple[Any, Any], ...]
        | Mapping[Any, Any]
    ],
    'session': NotRequired[Session]
})

SESSION: Session | None = None

def get_session():
    global SESSION

    if not SESSION:
        SESSION = Session()

    return SESSION

def fetch(
    **kwargs: Unpack[FETCH_KWARGS],
):
    global API_URL

    init_env()

    if not API_URL:
        API_URL = getenv('API_URL')

    if not API_URL:
        raise ValueError('No API_URL variable set')

    endpoint = kwargs.get('endpoint')

    if not isinstance(endpoint, str):
        raise ValueError('Endpoint is not a string.')

    url = f"{API_URL}/{endpoint}"

    method = kwargs.get('method')
    if not method:
        method = 'GET'

    headers = kwargs.get('headers')
    if not headers:
        headers = {}

    body = kwargs.get('body')

    session = kwargs.get('session')

    if not session:
        session = get_session()

    args = {'verify': False, 'headers': headers}
    if body and (method == 'POST' or method == 'PUT' or method == 'PATCH'):
        if isinstance(body, str):
            args['data'] = body
        else:
            args['json'] = body

    if method == 'GET':
        return session.get(url, **args)
    elif method == 'POST':
        return session.post(url, **args)
    elif method == 'HEAD':
        return session.head(url, **args)
    elif method == 'PUT':
        return session.put(url, **args)
    elif method == 'PATCH':
        return session.patch(url, **args)
    elif method == 'DELETE':
        return session.delete(url, **args)
    elif method == 'OPTIONS':
        return session.options(url, **args)
    else:
        raise ValueError(f"Invalid method: {method}.")
