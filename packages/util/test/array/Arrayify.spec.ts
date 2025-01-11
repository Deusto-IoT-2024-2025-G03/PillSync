import Arrayify from '@repo/util/array/Arrayify'

describe('Arrayify', () => {
    describe('Sync', () => {
        it('item -> [item]', () => {
            const item = 1 as const
            expect(Arrayify(item)).toEqual([item])
        })

        it('array -> array', () => {
            const arr = [1, 2, 3] as const
            expect(Arrayify(arr)).toBe(arr)
        })

        it('undefined -> undefined', () => {
            expect(Arrayify(undefined)).toBeUndefined()
        })

        it('null -> [null]', () => {
            expect(Arrayify(null)).toEqual([null])
        })

        it('iterable -> array', () => {
            const arr = [1, 2, 3] as const
            const it = new Set(arr)

            expect(Arrayify(it)).toEqual(arr)
        })
    })

    describe('Async', () => {
        it('item -> [item]', async () => {
            const item = 1 as const
            expect(await Arrayify.async(item)).toEqual([item])
        })

        it('array -> array', async () => {
            const arr = [1, 2, 3] as const
            expect(await Arrayify.async(arr)).toBe(arr)
        })

        it('undefined -> undefined', async () => {
            expect(await Arrayify.async(undefined)).toBeUndefined()
        })

        it('null -> [null]', async () => {
            expect(await Arrayify.async(null)).toEqual([null])
        })

        it('iterable -> array', async () => {
            const arr = [1, 2, 3] as const
            const it = new Set(arr)

            expect(await Arrayify.async(it)).toEqual(arr)
        })

        it('async iterable -> array', async () => {
            const arr = [1, 2, 3] as const
            const it = (async function* () {
                yield* arr
            })()

            expect(await Arrayify.async(it)).toEqual(arr)
        })

        it('promise -> [item]', async () => {
            const item = 1 as const
            const promise = Promise.resolve(item)

            expect(await Arrayify.async(promise)).toEqual([item])
        })

        it('promise of array -> array', async () => {
            const arr = [1, 2, 3] as const
            const promise = Promise.resolve(arr)

            expect(await Arrayify.async(promise)).toEqual(arr)
        })
    })
})
