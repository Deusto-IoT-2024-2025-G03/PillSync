import Integer from '@repo/types/number/Integer'
import type { GtOrEq } from 'ts-arithmetic'

function Natural<T extends number>(n: T): T {
    if (Natural.is(n)) return n

    throw new Error(`${n} is not a natural number.`)
}

/* istanbul ignore next */
namespace Natural {
    export function is(n: unknown): n is Natural {
        return typeof n === 'number' && n >= 0 && Number.isInteger(n)
    }

    export const MaxSafe = Integer.MaxSafe
    export type MaxSafe = Integer.MaxSafe

    export function Extended<T extends number>(n: T): Extended<T> {
        if (Extended.is(n)) return n as Extended<T>

        throw new Error(`${n} is not a natural number nor positive infinity.`)
    }

    /* istanbul ignore next */
    export namespace Extended {
        export function is(n: unknown): n is Extended {
            return typeof n === 'number' && (n === Number.POSITIVE_INFINITY || (n >= 0 && Number.isInteger(n)))
        }
    }

    export type Extended<T extends number = number> = Natural<T> extends never
        ? `${T}` extends `Infinity`
            ? T
            : never
        : T
}

type Natural<T extends number = number> = Integer<T> extends never
    ? never
    : GtOrEq<T, 0> extends 0
      ? GtOrEq<T, 1> extends 1
          ? T
          : never
      : T

export const isNatural = Natural.is

export type ExtendedNatural<T extends Natural = Natural> = Natural.Extended<T>
export const ExtendedNatural = Natural.Extended
export const isExtendedNatural = Natural.Extended.is

export const MaxSafeNatural = Natural.MaxSafe
export type MaxSafeNatural = Natural.MaxSafe

export default Natural
