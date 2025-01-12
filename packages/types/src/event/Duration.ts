import type Natural from '@repo/types/number/Natural'
import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Duration {
    export namespace Schema {
        export const Ref = 'duration' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,

            type: JSONSchema.Type.Integer,
            minimum: 0,
        } as const satisfies Schema
        export type Schema = JSONSchema<Duration>
    }

    export type Schema = Schema.Schema

    let ajv!: Ajv

    export function validate(duration: unknown): duration is Duration {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            ajv.addSchema([Schema.Schema, Partialize(Schema.Schema)].map(AddErrorMessages))
        }

        return ajv.validate(Schema.Ref, duration)
    }
}

type Duration = Natural

export const { Schema } = Duration
export type Schema = Duration.Schema

export const { validate } = Duration

export default Duration
