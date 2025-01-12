import type Natural from '@repo/types/number/Natural'
import type { ObjectId } from 'bson'
import _JSONSchema from '@repo/types/schema/JSONSchema'

namespace OID {
    export const Length = 24 as const
    export type Length = typeof Length

    export const Regex = /^[0-9a-f]{24}$/
    export type Regex = typeof Regex

    export function is(id: unknown, normalized?: false): id is OID
    export function is(id: unknown, normalized: true): id is string
    export function is(id: unknown, normalized?: boolean): id is OID {
        if (normalized) {
            if (typeof id !== 'string') return false
            return Regex.test(id)
        }

        switch (typeof id) {
            case 'string':
                return /^[0-9a-fA-f]{1,24}$/.test(id)

            // biome-ignore lint/suspicious/noFallthroughSwitchClause:
            case 'number':
                if (!Number.isInteger(id)) return false

            case 'bigint': {
                if (id < 0) return false
                if (id > 0xffff_ffff_ffff_ffff_ffff_ffffn) return false
                return true
            }

            case 'object':
                return id !== null && 'toHexString' in id

            default:
                return false
        }
    }

    function normImpl(id: OID): string {
        switch (typeof id) {
            case 'object': {
                return id.toHexString()
            }

            case 'bigint':
            case 'number': {
                return id.toString(16).padStart(Length, '0')
            }

            case 'string':
                return id.toLowerCase().padStart(Length, '0')
        }
    }

    export function normalize(id: OID): string
    export function normalize(id: unknown): string | undefined
    export function normalize(id: unknown): string | undefined {
        if (is(id, true)) return id
        if (is(id)) return normImpl(id)
        return undefined
    }

    export function shorten(id: OID): string
    export function shorten(id: unknown): string | undefined
    export function shorten(id: unknown): string | undefined {
        return get(id)?.replace(/^0{1,23}([0-9a-f]+)$/, '$1')
    }

    export function get(id: ObjectId): string
    export function get(id: OID): string
    export function get(id: { id: OID } | { _id: OID }): string
    export function get(id: null | undefined): undefined
    export function get(id: unknown): string | undefined
    export function get(id: unknown): string | undefined {
        if (typeof id === 'object') {
            if (id === undefined || id === null) return

            if ('toHexString' in id) return normImpl(id as ObjectId)
            if ('id' in id) ({ id } = id)
            else if ('_id' in id) id = id._id

            if (id === undefined || id === null) return
            if (typeof id === 'object' && 'toHexString' in id) return normImpl(id as ObjectId)
        }

        if (is(id)) return normImpl(id)
        return undefined
    }

    export namespace Schema {
        export const Ref = 'oid' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,

            type: _JSONSchema.Type.String,
            pattern: Regex.source,
        } as const satisfies Schema

        export type Schema = _JSONSchema<string>
    }

    export type Schema = JSONSchema.Schema
}

type OID = string | Natural | bigint | ObjectId

export default OID
