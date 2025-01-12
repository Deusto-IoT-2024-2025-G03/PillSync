import type Range from '@repo/types/number/Range'
import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Slot {
    export const Min = 0 as const
    export type Min = typeof Min

    export const Max = 2 as const
    export type Max = typeof Max

    export namespace Schema {
        export const Ref = 'slot' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,
            type: JSONSchema.Type.Integer,

            minimum: Min,
            maximum: Max,
        } as const satisfies Schema

        export type Schema = JSONSchema<Slot>
    }

    export type Schema = Schema.Schema

    let ajv!: Ajv

    export function validate(slot: unknown): slot is Slot {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            ajv.addSchema([Schema.Schema, Partialize(Schema.Schema)].map(AddErrorMessages))
        }

        return ajv.validate(Schema.Ref, slot)
    }
}

type Slot = Range<Slot.Min, Slot.Max>

export const { Min } = Slot
export type Min = Slot.Min

export const { Max } = Slot
export type Max = Slot.Max

export const { Schema } = Slot
export type Schema = Slot.Schema

export const { validate } = Slot

export default Slot
