// biome-file-ignore lint/complexity/noBannedTypes: <explanation>

import type Promiseable from '@repo/types/promise/Promiseable'

function Arrayify<T>(item: T[]): (T & {} & (T extends null ? null : {}))[] & { length: (typeof item)['length'] }
function Arrayify<T>(
    item: T[] | undefined
): ((T & {} & (T extends null ? null : {}))[] & { length: NonNullable<typeof item>['length'] }) | undefined
function Arrayify<T>(
    item: T | Iterable<T> | T[]
): typeof item extends T[]
    ? (T & {} & (T extends null ? null : {}))[] & { length: (typeof item)['length'] }
    : (T & {} & (T extends null ? null : {}))[]
function Arrayify<T>(
    item: T | Iterable<T> | T[] | undefined
):
    | (typeof item extends T[]
          ? (T & {} & (T extends null ? null : {}))[] & { length: (typeof item)['length'] }
          : (T & {} & (T extends null ? null : {}))[])
    | undefined
function Arrayify(item?: undefined): undefined
function Arrayify<T>(item?: T | Iterable<T> | T[] | undefined) {
    if (typeof item === 'undefined') return undefined

    if (typeof item !== 'object') return [item]
    if (item === null) return [item]

    if (Array.isArray(item)) return item
    if (Symbol.iterator in item) return Array.from(item)

    return [item]
}

/* istanbul ignore next */
namespace Arrayify {
    // biome-ignore lint/complexity/noBannedTypes: non-nullable type
    export async function async<T>(
        item: Promiseable<T> | Promiseable<T[]> | Iterable<T> | AsyncIterable<T>
    ): Promise<(T & {} & (T extends null ? null : {}))[]>
    export async function async<T>(
        item: Promiseable<T> | Promiseable<T[]> | Iterable<T> | AsyncIterable<T> | Promiseable<undefined>
    ): Promise<(T & {} & (T extends null ? null : {}))[] | undefined>
    export async function async(item?: Promiseable<undefined>): Promise<undefined>
    export async function async<T>(
        item?: Promiseable<undefined> | Promiseable<T> | Promiseable<T[]> | Iterable<T> | AsyncIterable<T>
    ): Promise<T[] | undefined> {
        if (typeof item === 'undefined') return undefined

        if (typeof item !== 'object') return [item]

        if (item === null) return [item]

        if (Array.isArray(item)) return item

        if (Symbol.iterator in item) return Array.from(item)

        if (Symbol.asyncIterator in item) {
            const array = []
            for await (const value of item) array.push(value)
            return array
        }

        if (item instanceof Promise) return await async(await item)

        return [item]
    }
}

export const asyncArrayify = Arrayify.async

export default Arrayify
