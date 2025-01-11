import JSONSchema from '@repo/types/schema/JSONSchema'
import Hash from '@repo/types/util/Hash'

namespace HostID {
    export const Length = 24 as const
    export type Length = typeof Length

    export const { Regex } = Hash.Algorithm.SHA.SHA3.SHA3_224
    export type Regex = typeof Regex

    export function is(id: unknown): id is HostID
    export function is(id: unknown): id is string
    export function is(id: unknown): id is HostID {
        return Hash.is(id, 'sha3-224')
    }

    export function normalize(id: HostID): string
    export function normalize(id: unknown): string | undefined
    export function normalize(id: unknown): string | undefined {
        if (is(id)) return id
        return undefined
    }

    export function shorten(id: HostID): string
    export function shorten(id: unknown): string | undefined
    export function shorten(id: unknown): string | undefined {
        return get(id)?.replace(/^0{1,23}([0-9a-f]+)$/, '$1')
    }

    export function get(id: HostID): string
    export function get(id: { id: HostID } | { _id: HostID }): string
    export function get(id: null | undefined): undefined
    export function get(id: unknown): string | undefined
    export function get(id: unknown): string | undefined {
        if (id === undefined) return undefined

        if (typeof id === 'object' && id !== null) {
            if ('id' in id) ({ id } = id)
            else if ('_id' in id) id = id._id
        }

        if (is(id)) return id
        return undefined
    }

    export namespace Schema {
        export const Ref = 'hostid' as const
        export type Ref = typeof Ref

        export const Schema = {
            type: JSONSchema.Type.String,
            pattern: Regex.source,
        } as const satisfies Schema

        export type Schema = JSONSchema<string>
    }

    export type Schema = Schema.Schema
}

type HostID = string

export const { Schema } = HostID
export type Schema = HostID.Schema

export default HostID
