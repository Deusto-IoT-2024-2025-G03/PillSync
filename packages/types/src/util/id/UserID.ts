import type Range from '@repo/types/number/Range'
import _JSONSchema from '@repo/types/schema/JSONSchema'

namespace UserID {
    export namespace Length {
        export const Min = 3 as const
        export type Min = typeof Min

        export const Max = 30 as const
        export type Max = typeof Max
    }

    export type Length = Range<Length.Min, Length.Max>

    export const Invalid = [
        '.*@.*',
        'clone',
        'created_by',
        'created_on',
        'id',
        'metadata',
        'my',
        'name',
        'parent',
        'sanitize',
        'search',
        'size',
        'updated_by',
        'updated_on',
        'validate',
    ] as const
    export type Invalid = (typeof Invalid)[number]

    export const Reserved = ['admin', 'root', 'system', 'dspace', 'dals', 'd-als', 'rasa'] as const
    export type Reserved = (typeof Reserved)[number]

    export const Regex = new RegExp(
        (() => {
            const chars = {
                ascii: /a-zA-Z0-9/,
                latin: /\u00c0-\u00d6\u00d8-\u00f6\u0080-\u00ff\u0100-\u017f\u0180-uu24f\u1e00-\u1eff/,
                greek: /\u0370-\u03ff\u1f00-\u1fff/,
                cyrillic: /\u0400-\u04ff\u0500\u052f/,
            } as const

            const arr = Object.values(chars).flatMap(({ source }) =>
                Array.from(source.matchAll(/(\\u.{1,4}-\\u.{1,4})|(.-.)/g)).flatMap(([x, ..._]) => x)
            )

            arr.sort((a, b) => {
                const r = /\\u(.{1,4})\-.+/

                const match = {
                    a: r.exec(a)?.[1],
                    b: r.exec(b)?.[1],
                }

                const cp = {
                    a: match.a ? Number.parseInt(match.a, 16) : a.codePointAt(0),
                    b: match.b ? Number.parseInt(match.b, 16) : b.codePointAt(0),
                }

                /* istanbul ignore if */ if (cp.a === undefined) return cp.b === undefined ? 0 : -1
                /* istanbul ignore if */ if (cp.b === undefined) return 1
                return cp.a - cp.b
            })

            return `^(?!^${Invalid.map(x => `(?:${x})`).join('|')}$)(?=.{${Length.Min},${Length.Max}}$)^([${arr.join('')}]+[\-_\.]?)+$`
        })()
    )

    export function is(id: unknown): id is UserID {
        return typeof id === 'string' && Regex.test(id)
    }

    export function get(user: unknown): UserID | undefined {
        if (!user) return

        if (typeof user === 'object') {
            if ('id' in user) user = user.id
            else if ('_id' in user) user = user._id
        }

        if (typeof user !== 'string') return
        user = user.trim()

        if (!is(user)) return
        return user
    }

    export namespace JSONSchema {
        export const Ref = 'userid' as const
        export type Ref = typeof Ref

        export const Schema = {
            type: _JSONSchema.Type.String,
            pattern: Regex.source,
        } as const satisfies Schema
        export type Schema = _JSONSchema<string>
    }

    export const { Ref } = JSONSchema
    export type Ref = JSONSchema.Ref

    export const { Schema } = JSONSchema
    export type Schema = JSONSchema.Schema
}

type UserID = Exclude<string, UserID.Invalid>

export default UserID
