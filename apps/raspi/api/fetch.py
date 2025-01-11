from ..sys.env import init_env
from os import getenv
from requests.api import _HeadersMapping
from requests.sessions import _Data
from requests import Response, get, post, head, put, patch, options
from typing import Literal, Unpack, Dict, TypedDict, NotRequired

API_URL: str | None

HTTP_METHOD = Literal[
    "GET",
    "POST",
    "HEAD",
    "PUT",
    "PATCH",
    "OPTIONS",
    # "CONNECT",
    # "TRACE"
]

FETCH_KWARGS = TypedDict('FETCH_KWARGS', {
    'endpoint': str,
    'method': NotRequired[HTTP_METHOD],
    'headers': NotRequired[_HeadersMapping],
    'body': NotRequired[_Data]
})

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

    if isinstance(endpoint, str):
        raise ValueError('Endpoint is not a string.')

    url = f"https://{API_URL}/{endpoint}"

    method = kwargs.get('method')
    if not method:
        method = 'GET'

    headers = kwargs.get('headers')
    if not headers:
        headers = {}

    body = kwargs.get('body')

    if method == 'GET':
        return get(url, verify=False, headers=headers, data=body)
    elif method == 'POST':
        return post(url, verify=False, headers=headers, data=body)
    elif method == 'HEAD':
        return head(url, verify=False, headers=headers)
    elif method == 'PUT':
        return put(url, verify=False, headers=headers, data=body)
    elif method == 'PATCH':
        return patch(url, verify=False, headers=headers, data=body)
    elif method == 'OPTIONS':
        return options(url, verify=False, headers=headers)
    else
        raise ValueError(f"Invalid method: {method}.")
