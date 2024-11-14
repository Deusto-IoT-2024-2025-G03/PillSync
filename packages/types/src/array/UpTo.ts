import type RangedArray from '@repo/types/array/RangedArray'
import Range from '@repo/types/number/Range'

type UpTo<T = unknown, N extends Range = Range.Max> = RangedArray<T, Range.Min, N>

function UpTo<T, N extends Range>(items: Iterable<T>, length: N): UpTo<T, N> {
    if (!Range.is(length, Range.Min, Range.Max)) {
        throw new Error(
            `The minimum length of the array must be a natural number between ${Range.Min} and ${Range.Max}.`
        )
    }

    const arr = Array.from(items)

    if (arr.length > length) {
        throw new Error(`Expected <= ${length} items, ${arr.length} were provided.`)
    }

    const ret = Array.from({ length }).map((_, i) => arr[i]) as UpTo<T, N>
    Object.defineProperties(ret, {
        minLength: { value: Range.Min, writable: false },
        maxLength: { value: length, writable: false },
    })

    return ret
}

export default UpTo
