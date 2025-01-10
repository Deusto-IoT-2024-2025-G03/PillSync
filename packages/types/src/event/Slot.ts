import type Range from '@repo/types/number/Range'
import JSONSchema from '@repo/types/schema/JSONSchema'

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
}

type Slot = Range<Slot.Min, Slot.Max>

export const { Min } = Slot
export type Min = Slot.Min

export const { Max } = Slot
export type Max = Slot.Max

export const { Schema } = Slot
export type Schema = Slot.Schema

export default Slot
