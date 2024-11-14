import Range from '@repo/types/number/Range'

type RangedArray<T = unknown, Min extends Range = Range.Min, Max extends Range<Min> = Range<Min>> = Array<T> &
    Pick<Array<T>, Exclude<keyof Array<T>, 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | 'map' | 'flatMap'>> & {
        readonly minLength?: Min
        readonly maxLength?: Max
        readonly length: Range<Min, Max>
        [I: number]: T
        [Symbol.iterator]: () => IterableIterator<T>
    }

function RangedArray<T, Min extends Range, Max extends Range<Min>>(
    items: Iterable<T>,
    minLength: Min,
    maxLength: Max
): RangedArray<T, Min, Max> {
    if (!Range.is(minLength, Range.Min, Range.Max)) {
        throw new Error(
            `The minimum length of the array must be a natural number between ${Range.Min} and ${Range.Max}.`
        )
    }

    if (!Range.is(maxLength, minLength, Range.Max as Range<Min>)) {
        throw new Error(
            `The maximum length of the array must be a natural number between ${minLength} and ${Range.Max}.`
        )
    }

    const arr = Array.from(items)

    if (arr.length < minLength) {
        throw new Error(`Expected >= ${minLength} items, ${arr.length} were provided.`)
    }

    // @ts-ignore
    if (arr.length > maxLength) {
        throw new Error(`Expected <= ${maxLength} items, ${arr.length} were provided.`)
    }

    const { length } = arr
    const ret = Array.from({ length }, (_, i) => arr[i]) as RangedArray<T, Min, Max> & {
        minLength: Min
        maxLength: Max
    }

    Object.defineProperties(ret, {
        minLength: { value: minLength, writable: false },
        maxLength: { value: maxLength, writable: false },
    })

    return ret as RangedArray<T, Min, Max>
}

export default RangedArray
