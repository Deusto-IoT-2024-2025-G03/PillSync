import type Natural from '@repo/types/number/Natural'
import JSONSchema from '@repo/types/schema/JSONSchema'

export namespace Duration {
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
}

type Duration = Natural

export const { Schema } = Duration
export type Schema = Duration.Schema

export default Duration
