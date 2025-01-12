import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import type { Melody as PrismaMelody } from '@repo/db'
import type Natural from '@repo/types/number/Natural'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Melody {
    export type Prisma = PrismaMelody

    export interface Data {
        notes: Natural[]
        beat: Natural[]
    }

    export namespace Schema {
        export const Ref = 'melody' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,

            type: JSONSchema.Type.Object,
            properties: {
                notes: {
                    type: JSONSchema.Type.Array,
                    items: {
                        type: JSONSchema.Type.Integer,
                    },
                },

                beat: {
                    type: JSONSchema.Type.Array,
                    items: {
                        type: JSONSchema.Type.Integer,
                    },
                },
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Data>
    }

    export type Schema = Schema.Schema

    let ajv!: Ajv

    export function validate(melody: unknown): melody is Melody {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            ajv.addSchema([Schema.Schema, Partialize(Schema.Schema)].map(AddErrorMessages))
        }

        return ajv.validate(Schema.Ref, melody)
    }
}

export type Prisma = PrismaMelody

export const { Schema } = Melody
export type Schema = Melody.Schema

export const { validate } = Melody

export type Data = Melody.Data

type Melody = Melody.Data

export default Melody
