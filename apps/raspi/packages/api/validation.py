from jsonschema.validators import Draft202012Validator
from typing_extensions import Any, Dict
from referencing import Registry
from referencing.jsonschema import DRAFT202012
from packages.api.fetch import fetch

REGISTRY: Registry | None = None

def get_validator(schema: str | dict):
    global REGISTRY

    if isinstance(schema, str):
        schema = {'$ref': schema}

    if REGISTRY:
        return Draft202012Validator(registry=REGISTRY, schema=schema)

    r = fetch(endpoint='schema')
    if not r.ok:
        raise Exception('Could not get JSON schemas.')

    json = r.json()
    createResource = (lambda schema: (f"urn:{schema.get('$id')}", DRAFT202012.create_resource(schema)))
    REGISTRY = Registry().with_resources([createResource(schema) for schema in json.values()])

    return Draft202012Validator(registry=REGISTRY, schema=schema)

def is_valid(instance: Any, schema: str | Dict):
    if isinstance(schema, str):
        schema = {'$ref': schema}

    return get_validator(schema).is_valid(instance)
