from inspect import Parameter
from jsonschema.validators import Draft202012Validator
from typing_extensions import Any, Dict, Type
from jsonschema import validate
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012
from ..api.fetch import fetch

VALIDATOR: Draft202012Validator | None

def getValidator():
    global VALIDATOR

    if VALIDATOR:
        return VALIDATOR

    r = fetch(endpoint='event/schema')
    if not r.ok:
        raise Exception('Could not get JSON schemas.')

    registry = Registry().with_resources([(lambda schema: DRAFT202012.create_resource(schema))(schema) for schema in r.json])

    VALIDATOR = Draft202012Validator(registry=registry)

    return VALIDATOR

def validate(instance: Any, schema: str | Dict):
    v = getValidator()

    if not v:
        raise Exception('Schemas not loaded.')

    if isinstance(schema, str):
        schema = {'$ref': schema}
