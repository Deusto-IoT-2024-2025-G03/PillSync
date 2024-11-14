import type { IsInt } from 'ts-arithmetic'

function Integer<T extends number>(n: T): Integer<T> {
    if (Integer.is(n)) return n as Integer<T>

    throw new Error(`${n} is not an integer.`)
}

/* istanbul ignore next */
namespace Integer {
    export function is(n: unknown): n is Integer {
        if (typeof n !== 'number') return false
        if (Number.isInteger(n)) return true
        return false
    }

    export const MaxSafe = 9007199254740991 as const
    export type MaxSafe = MaxSafeInteger

    export function Extended<T extends number>(n: T): Extended<T> {
        if (Extended.is(n)) return n as Extended<T>

        throw new Error(`${n} is not an integer nor infinity.`)
    }

    /* istanbul ignore next */
    export namespace Extended {
        export function is(n: unknown): n is Extended {
            if (Integer.is(n)) return true
            switch (n) {
                case Number.POSITIVE_INFINITY:
                case Number.NEGATIVE_INFINITY:
                    return true

                default:
                    return false
            }
        }
    }

    export type Extended<T extends number = number> = Integer<T> extends Integer
        ? T
        : `${T}` extends 'Infinity' | '-Infinity'
          ? T
          : never
}

type Integer<T extends number = number> = IsInt<T> extends 0 ? (IsInt<T> extends 1 ? T : never) : T

export const isInteger = Integer.is

export type ExtendedInteger<T extends number = number> = Integer.Extended<T>
export const ExtendedInteger = Integer.Extended
export const isExtendedInteger = Integer.Extended.is

export const MaxSafeInteger = Integer.MaxSafe
export type MaxSafeInteger = typeof Integer.MaxSafe

export type { Integer }
export default Integer
