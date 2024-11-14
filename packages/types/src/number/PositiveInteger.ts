import Natural from '@repo/types/number/Natural'

function PositiveInteger<T extends number = number>(n: T): T {
    if (PositiveInteger.is(n)) return n

    throw new Error(`${n} is not a positive integer.`)
}

/* istanbul ignore next */
namespace PositiveInteger {
    export function is(n: unknown): n is PositiveInteger {
        if (typeof n !== 'number') return false
        if (!Number.isInteger(n)) return false
        if (n > 0) return true
        return false
    }

    export const MaxSafe = Natural.MaxSafe
    export type MaxSafe = Natural.MaxSafe

    export function Extended<T extends number = number>(n: PositiveInteger<T>): Extended<T> {
        if (Extended.is(n)) return n as Extended<T>

        throw new Error(`${n} is not a positive integer nor positive infinity.`)
    }

    /* istanbul ignore next */
    export namespace Extended {
        export function is(n: unknown): n is Extended {
            if (PositiveInteger.is(n)) return true
            if (n === Number.POSITIVE_INFINITY) return true
            return false
        }
    }

    export type Extended<T extends number = number> = Exclude<Natural.Extended<T>, 0>
}

type PositiveInteger<T extends number = number> = Exclude<Natural<T>, 0>

export const isInteger = PositiveInteger.is

export type ExtendedPositiveInteger<T extends number = number> = PositiveInteger.Extended<T>
export const ExtendedPositiveInteger = PositiveInteger.Extended
export const isExtendedPositiveInteger = PositiveInteger.Extended.is

export const MaxSafePositiveInteger = PositiveInteger.MaxSafe
export type MaxSafePositiveInteger = typeof PositiveInteger.MaxSafe

export type { PositiveInteger }
export default PositiveInteger
