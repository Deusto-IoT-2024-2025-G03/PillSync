import type Promiseable from '@repo/types/promise/Promiseable'
import Arrayify, { asyncArrayify } from './Arrayify'

export default function Dearrayify<T>(item: T | T[] | Iterable<T>): T
export default function Dearrayify(item?: undefined): undefined
export default function Dearrayify<T>(item?: T | T[] | Iterable<T> | undefined): T | undefined {
    return Arrayify(item)?.[0]
}

// biome-ignore lint/complexity/noBannedTypes: non-nullable type
export async function asyncDearrayify<T>(
    item: Promiseable<T> | Promiseable<T[]> | Iterable<T> | AsyncIterable<T>
): Promise<(T & {} & (T extends null ? null : {}))[]>
export async function asyncDearrayify(item?: Promiseable<undefined>): Promise<undefined>
export async function asyncDearrayify<T>(
    item?: Promiseable<undefined> | Promiseable<T> | Promiseable<T[]> | Iterable<T> | AsyncIterable<T>
) {
    return (await asyncArrayify(item))?.[0]
}
