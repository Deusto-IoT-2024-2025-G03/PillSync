import type { MaxArrLen, MinArrLen } from '@repo/types/array/ArrLen'
import type AtLeast from '@repo/types/array/AtLeast'
import type Integer from '@repo/types/number/Integer'
import type Natural from '@repo/types/number/Natural'
import type PositiveInteger from '@repo/types/number/PositiveInteger'
import type { Ajv, ErrorObject } from 'ajv'

namespace JSONSchema {
    export namespace Type {
        // biome-ignore lint/suspicious/noShadowRestrictedNames: Not shadowing anything
        export const Array = 'array' as const
        export type Array = typeof Array

        // biome-ignore lint/suspicious/noShadowRestrictedNames: Not shadowing anything
        export const Boolean = 'boolean' as const
        export type Boolean = typeof Boolean

        export const Integer = 'integer' as const
        export type Integer = typeof Integer

        export const Null = 'null' as const
        export type Null = typeof Null

        // biome-ignore lint/suspicious/noShadowRestrictedNames: Not shadowing anything
        export const Number = 'number' as const
        export type Number = typeof Number

        // biome-ignore lint/suspicious/noShadowRestrictedNames: Not shadowing anything
        export const Object = 'object' as const
        export type Object = typeof Object

        // biome-ignore lint/suspicious/noShadowRestrictedNames: Not shadowing anything
        export const String = 'string' as const
        export type String = typeof String
    }

    export type Type = (typeof Type)[keyof typeof Type]

    export namespace Format {
        export namespace DateTime {
            // biome-ignore lint/suspicious/noShadowRestrictedNames: Not shadowing anything
            export const Date = 'date' as const
            export type Date = typeof Date

            export const DateTime = 'date-time' as const
            export type DateTime = typeof DateTime

            export const Time = 'time' as const
            export type Time = typeof Time

            export const Duration = 'duration' as const
            export type Duration = typeof Duration
        }

        export type DateTime = DateTime.Date | DateTime.DateTime | DateTime.Time | DateTime.Duration

        export namespace Email {
            export const Email = 'email' as const
            export type Email = typeof Email

            export const IDNEmail = 'idn-email' as const
            export type IDNEmail = typeof IDNEmail
        }

        export type Email = Email.Email | Email.IDNEmail

        export namespace Hostname {
            export const Hostname = 'hostname' as const
            export type Hostname = typeof Hostname

            export const IDNHostname = 'idn-hostname' as const
            export type IDNHostname = typeof IDNHostname
        }

        export type Hostname = Hostname.Hostname | Hostname.IDNHostname

        export namespace IP {
            export const IPv4 = 'ipv4' as const
            export type IPv4 = typeof IPv4

            export const IPv6 = 'ipv6' as const
            export type IPv6 = typeof IPv6
        }

        export type IP = IP.IPv4 | IP.IPv6

        export namespace ResourceIdentifier {
            export const UUID = 'uuid' as const
            export type UUID = typeof UUID

            export const URI = 'uri' as const
            export type URI = typeof URI

            export const URIReference = 'uri-reference' as const
            export type URIReference = typeof URIReference

            export const IRI = 'iri' as const
            export type IRI = typeof IRI

            export const IRIReference = 'iri-reference' as const
            export type IRIReference = typeof IRIReference
        }

        export type ResourceIdentifier =
            | ResourceIdentifier.UUID
            | ResourceIdentifier.URI
            | ResourceIdentifier.URIReference
            | ResourceIdentifier.IRI
            | ResourceIdentifier.IRIReference

        export const URITemplate = 'uri-template' as const
        export type URITemplate = typeof URITemplate

        export namespace JSONPointer {
            export const JSONPointer = 'json-pointer' as const
            export type JSONPointer = typeof JSONPointer

            export const RelativeJSONPointer = 'relative-json-pointer' as const
            export type RelativeJSONPointer = typeof RelativeJSONPointer
        }

        export type JSONPointer = JSONPointer.JSONPointer | JSONPointer.RelativeJSONPointer

        export namespace Regex {
            export const Regex = 'regex' as const
            export type Regex = typeof Regex
        }

        export type Regex = Regex.Regex
    }

    export type Format =
        | Format.DateTime
        | Format.Email
        | Format.Hostname
        | Format.IP
        | Format.ResourceIdentifier
        | Format.URITemplate
        | Format.JSONPointer
        | Format.Regex

    export namespace ContentEncoding {
        export const SevenBit = '7bit' as const
        export type SevenBit = typeof SevenBit

        export const EightBit = '8bit' as const
        export type EightBit = typeof EightBit

        export const Binary = 'binary' as const
        export type Binary = typeof Binary

        export const QuotedPrintable = 'quoted-printable' as const
        export type QuotedPrintable = typeof QuotedPrintable

        export const Base16 = 'base16' as const
        export type Base16 = typeof Base16

        export const Base32 = 'base32' as const
        export type Base32 = typeof Base32

        export const Base64 = 'base64' as const
        export type Base64 = typeof Base64
    }

    export type ContentEncoding = (typeof ContentEncoding)[keyof typeof ContentEncoding]

    export type Ref = string
}

export const { Type } = JSONSchema
export type Type = JSONSchema.Type

export const { Format } = JSONSchema
export type Format = JSONSchema.Format

export const { ContentEncoding } = JSONSchema
export type ContentEncoding = JSONSchema.ContentEncoding

export type Ref = JSONSchema.Ref

// biome-ignore lint/suspicious/noExplicitAny:
type _JSONSchema<T = any> = Partial<
    {
        $schema: string
        $id: string
        // biome-ignore lint/suspicious/noExplicitAny:
        $defs: { [k: string]: JSONSchema<any> } | { readonly [k: string]: JSONSchema<any> }
        $anchor: string

        title: string
        description: string
        $comment: string
        default: T
        examples: readonly T[] | T[]
        deprecated: boolean

        readOnly: boolean
        writeOnly: boolean

        enum: readonly T[] | T[]
        const: T

        allOf: readonly JSONSchema<T>[] | JSONSchema<T>[]
        anyOf: readonly JSONSchema<T>[] | JSONSchema<T>[]
        oneOf: readonly JSONSchema<T>[] | JSONSchema<T>[]
        not: T extends object
            ? Omit<JSONSchema<T>, 'not'> & {
                  required: (keyof T)[] | readonly (keyof T)[]
              }
            : JSONSchema<T>

        if: JSONSchema<T>
        then: JSONSchema<T> | JSONSchema<T>
        else: JSONSchema<T>

        type:
            | (T extends number ? JSONSchema.Type.Number | JSONSchema.Type.Integer : never)
            // biome-ignore lint/suspicious/noExplicitAny:
            | (T extends any[] ? JSONSchema.Type.Array : never)
            | (T extends boolean ? JSONSchema.Type.Boolean : never)
            | (T extends null ? JSONSchema.Type.Null : never)
            | (T extends object ? JSONSchema.Type.Object : never)
            | (T extends string ? JSONSchema.Type.String : never)
    } & (
        | {
              type: JSONSchema.Type.String
              format: T extends string ? JSONSchema.Format : never
              contentMediaType: T extends string ? string : never
              contentEncoding: T extends string ? JSONSchema.ContentEncoding : never
          }
        | {
              type: JSONSchema.Type.Boolean
          }
        | {
              type: JSONSchema.Type.Null
          }
        | {
              type: JSONSchema.Type.Number | JSONSchema.Type.Integer
              multipleOf: T extends number ? PositiveInteger : never
          }
        | {
              type: JSONSchema.Type.String
              maxLength: T extends string ? Natural : never
              minLength: T extends string ? Natural : never
              pattern: T extends string ? string : never
          }
        | ((
              | (
                    | {
                          type: JSONSchema.Type.Number
                          maximum: T extends number ? number : never
                          exclusiveMaximum: T extends number ? boolean : never
                      }
                    | {
                          type: JSONSchema.Type.Number
                          maximum: never
                          exclusiveMaximum: T extends number ? number : never
                      }
                )
              | (
                    | {
                          type: JSONSchema.Type.Integer
                          maximum: T extends Integer ? T : never
                          exclusiveMaximum: T extends Integer ? boolean : never
                      }
                    | {
                          type: JSONSchema.Type.Integer
                          maximum: never
                          exclusiveMaximum: T extends Integer ? T : never
                      }
                )
          ) &
              (
                  | (
                        | {
                              type: JSONSchema.Type.Number
                              minimum?: T extends number ? number : never
                              exclusiveMinimum: T extends number ? boolean : never
                          }
                        | {
                              type: JSONSchema.Type.Number
                              minimum: never
                              exclusiveMinimum: T extends number ? number : never
                          }
                    )
                  | (
                        | {
                              type: JSONSchema.Type.Integer
                              minimum?: T extends Integer ? T : never
                              exclusiveMinimum: T extends Integer ? boolean : never
                          }
                        | {
                              type: JSONSchema.Type.Integer
                              minimum: never
                              exclusiveMinimum: T extends Integer ? T : never
                          }
                    )
              ))
        | {
              type: JSONSchema.Type.Array
              // biome-ignore lint/suspicious/noExplicitAny:
              additionalItems: T extends any[] ? boolean | JSONSchema : never
              // biome-ignore lint/suspicious/noExplicitAny:
              items: T extends any[] ? JSONSchema<T[number]> : never
              // biome-ignore lint/suspicious/noExplicitAny:
              prefixItems: T extends any[] ? AtLeast<JSONSchema<T[number]>, 1> : never
              // biome-ignore lint/suspicious/noExplicitAny:
              unevaluatedItems: T extends any[] ? JSONSchema | false : never
              maxItems: MaxArrLen<T>
              minItems: MinArrLen<T>
              // biome-ignore lint/suspicious/noExplicitAny:
              uniqueItems: T extends any[] ? boolean : never
              // biome-ignore lint/suspicious/noExplicitAny:
              contains: T extends any[] ? JSONSchema<T[number]> : never
              maxContains: MaxArrLen<T>
              minContains: MaxArrLen<T>
          }
        | {
              type: JSONSchema.Type.Object
              maxProperties: T extends object ? Natural : never
              minProperties: T extends object ? Natural : never
              required: T extends object
                  ?
                        | readonly (keyof {
                              [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
                          })[]
                        | (keyof {
                              [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
                          })[]
                  : never
              additionalProperties: T extends object ? { [K in keyof T]?: JSONSchema<T[K]> } | boolean : never
              unevaluatedProperties: T extends object ? { [K in keyof T]?: JSONSchema<T[K]> } | false : never
              properties: T extends object
                  ?
                        | {
                              [K in keyof T as string extends K
                                  ? never
                                  : number extends K
                                    ? never
                                    : symbol extends K
                                      ? never
                                      : K]?: JSONSchema<T[K]> | true
                          }
                        | {
                              readonly [K in keyof T as string extends K
                                  ? never
                                  : number extends K
                                    ? never
                                    : symbol extends K
                                      ? never
                                      : K]?: JSONSchema<T[K]> | true
                          }
                  : never
              patternProperties: T extends object
                  ? { [k: string]: _JSONSchema } | { readonly [k: string]: _JSONSchema }
                  : never
              dependencies: T extends object
                  ? // biome-ignore lint/suspicious/noExplicitAny:
                    { [k: string]: JSONSchema<any> | string[] } | { [k: string]: JSONSchema<any> | string[] }
                  : never
              propertyNames: T extends object
                  ? JSONSchema<{
                        [K in keyof T as string extends K
                            ? never
                            : number extends K
                              ? never
                              : symbol extends K
                                ? never
                                : K]?: K extends string ? JSONSchema<K> : never
                    }>
                  : never
          }
    )
>

// biome-ignore lint/suspicious/noExplicitAny:
type JSONSchema<T = any> =
    | (_JSONSchema<T> & { $ref?: never })
    | { readonly [K in keyof _JSONSchema<T>]?: _JSONSchema<T>[K] }
    | ({ $ref: JSONSchema.Ref } & { [K in keyof _JSONSchema<T>]?: never })

export function Partialize(x: JSONSchema | JSONSchema[keyof JSONSchema]): JSONSchema | JSONSchema[keyof JSONSchema] {
    if (!x) return x
    if (typeof x !== 'object') return x
    if (Array.isArray(x)) return x.map(Partialize)

    let { $id, $ref, required, ...rest } = x

    if ($id && !$id.endsWith('_partial')) $id = `${$id}_partial`
    if ($ref && !$ref.endsWith('_partial')) $ref = `${$ref}_partial`

    rest = {
        ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, k === 'not' ? v : Partialize(v)])),
        $id,
        $ref,
    }

    if ('$id' in rest && rest.$id === undefined) delete rest.$id
    if ('$ref' in rest && rest.$ref === undefined) delete rest.$ref

    return rest
}

export function AddErrorMessages(x: JSONSchema & { errorMessage?: string }) {
    if (!x) return x
    if (typeof x !== 'object') return x
    if (Array.isArray(x)) return x

    const { description, errorMessage } = x

    if (description && !errorMessage) {
        x.errorMessage = description
    }

    Object.values(x).forEach(AddErrorMessages)
    return x
}

export function PushErrors(
    errors:
        | (string | (ErrorObject<string, Record<string, unknown>, unknown> & { errorMessage?: string }))[]
        | undefined,
    validation: ReturnType<InstanceType<typeof Ajv>['compile']>['errors']
): typeof errors {
    if (errors === undefined) return errors
    errors.splice(0, errors.length)

    if (!validation) return errors

    const instancePaths = new Set<string>()

    for (const x of validation) {
        if (typeof x === 'string') {
            errors.push(x)
            continue
        }

        const { instancePath, message, keyword, params } = x

        if (instancePaths.has(instancePath)) {
            return undefined
        }

        if (instancePath) {
            instancePaths.add(instancePath)
        }

        function findErrorMessage(
            obj: (ErrorObject<string, Record<string, unknown>, unknown> & { errorMessage?: string }) | undefined
        ) {
            if (!obj) {
                return undefined
            }

            return obj.errorMessage ?? obj.parentSchema?.errorMessage
        }

        const m = findErrorMessage(x)
        if (m) {
            errors.push(m)
            continue
        }

        if (!instancePath) {
            if (keyword === 'additionalProperties') {
                errors.push(`${message} ('${params?.additionalProperty}')`)
            }

            if (['anyOf', 'allOf', 'oneOf', 'not'].includes(keyword)) continue

            if (message) errors.push(message)
            continue
        }

        errors.push(`${message} (property '${instancePath}')`)
    }

    return errors
}

export default JSONSchema
