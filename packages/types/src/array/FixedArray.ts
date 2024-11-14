import type RangedArray from '@repo/types/array/RangedArray'
import Range from '@repo/types/number/Range'

type FixedArray<T, N extends Range> = RangedArray<T, N, Range<N>>

function FixedArray<T, N extends Range>(items: Iterable<T>, length: N): FixedArray<T, N> {
    if (!Range.is(length, Range.Min, Range.Max)) {
        throw new Error(`The length of the array must be a natural number between ${Range.Min} and ${Range.Max}.`)
    }

    const arr = Array.from(items)

    if (arr.length !== length) {
        throw new Error(`Expected ${length} items, ${arr.length} were provided.`)
    }

    const ret = Array.from({ length }, (_, i) => arr[i]) as FixedArray<T, N> & {
        minLength: N
        maxLength: N
    }

    Object.defineProperties(ret, {
        minLength: { value: length, writable: false },
        maxLength: { value: length, writable: false },
        length: { value: length, writable: false },
    })

    return ret as FixedArray<T, N>
}

/* istanbul ignore next */
namespace FixedArray {
    export type Min = Range.Min
    export type Max = Range.Max

    export function repeat<T, N extends Range>(item: T, length: N): FixedArray<T, N> {
        return FixedArray(
            Array.from({ length }, () => item),
            length
        )
    }
}

export default FixedArray
