import type Natural from '@repo/types/number/Natural'
import Enumerate from '@repo/types/util/Enumerate'
import type { GtOrEq, LtOrEq } from 'ts-arithmetic'

function Range(n: unknown): Range
function Range<F extends Range>(n: unknown, from: F): Range<F>
function Range<F extends Range, T extends Range<F>>(n: unknown, from: F, to: T): Range<F, T>
function Range<F extends Range, T extends Range<F>>(n: unknown, from?: F, to?: T): Range<F, T> {
    from ??= Range.Min as NonNullable<typeof from>
    to ??= Range.Max as NonNullable<typeof to>

    if (from > to) throw new Error(`Invalid range: [${from}, ${to}].`)

    if (Range.is(n, from, to)) return n

    throw new Error(`${n} is not in the range [${from}, ${to}].`)
}

/* istanbul ignore next */
namespace Range {
    export const Min = 0 as const
    export type Min = typeof Min

    export const Max = 999 as const
    export type Max = typeof Max

    export function is<F extends Range = Range.Min, T extends Range<F> = Range<F>>(
        n: unknown,
        from?: F,
        to?: T
    ): n is Range<F, T> {
        if (typeof from === 'undefined') from = Range.Min as NonNullable<typeof from>
        else if (!Enumerate.can(from)) return false

        if (typeof to === 'undefined') to = Range.Max as NonNullable<typeof to>
        else if (!Enumerate.can(to)) return false

        if (!Enumerate.can(n)) return false

        return n >= from && n <= to
    }
}

export const MinRange = Range.Min
export type MinRange = Range.Min

export const MaxRange = Range.Max
export type MaxRange = Range.Max

type _Range<F extends Natural, T extends Natural> = Exclude<Enumerate<Natural<T>>, Enumerate<Natural<F>>> | Natural<T>

// biome-ignore lint/suspicious/noRedeclare:
type Range<F extends _Range<Range.Min, Range.Max> = Range.Min, T extends _Range<F, Range.Max> = Range.Max> = GtOrEq<
    F,
    Range.Min
> extends 1
    ? LtOrEq<F, Range.Max> extends 1
        ? LtOrEq<F, T> extends 1
            ? _Range<F, T>
            : never
        : never
    : never

export default Range
