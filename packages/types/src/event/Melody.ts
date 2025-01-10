import JSONSchema from '@repo/types/schema/JSONSchema'

namespace Melody {
    export namespace Schema {
        export const Ref = 'melody' as const
        export type Ref = typeof Ref

        export const Schema = {} as const satisfies Schema

        export type Schema = JSONSchema<Melody>
    }

    export type Schema = Schema.Schema
}

interface Melody {}

export const { Schema } = Melody
export type Schema = Melody.Schema

export default Melody
