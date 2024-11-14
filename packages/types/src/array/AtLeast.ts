import type RangedArray from '@repo/types/array/RangedArray'
import Range from '@repo/types/number/Range'

type AtLeast<T = unknown, N extends Range = Range.Min> = RangedArray<T, N, Range<N>>

function AtLeast<T, N extends Range>(items: Iterable<T>, length: N): AtLeast<T, N> {
    if (!Range.is(length, Range.Min, Range.Max)) {
        throw new Error(
            `The minimum length of the array must be a natural number between ${Range.Min} and ${Range.Max}.`
        )
    }

    const arr = Array.from(items)

    if (arr.length < length) {
        throw new Error(`Expected >= ${length} items, ${arr.length} were provided.`)
    }

    const ret = Array.from({ length: arr.length }).map((_, i) => arr[i]) as AtLeast<T, N>
    Object.defineProperties(ret, {
        minLength: { value: length, writable: false },
        maxLength: { value: Range.Max, writable: false },
    })

    return ret
}

export default AtLeast
