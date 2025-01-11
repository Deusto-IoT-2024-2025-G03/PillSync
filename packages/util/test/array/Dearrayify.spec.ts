import Dearrayify, { asyncDearrayify } from '@repo/util/array/Dearrayify'

describe('Dearrayify', () => {
    describe('An array', () => {
        it('should return the first item', () => {
            const arr = [1, 2, 3] as const

            expect(Dearrayify(arr)).toBe(arr[0])
        })
    })

    describe('A single item', () => {
        it('should return the item', () => {
            const item = 1 as const

            expect(Dearrayify(item)).toBe(item)
        })
    })

    describe('Undefined', () => {
        it('should return undefined', () => {
            expect(Dearrayify(undefined)).toBeUndefined()
        })
    })

    describe('Null', () => {
        it('should return null', () => {
            expect(Dearrayify(null)).toBeNull()
        })
    })

    describe('An iterable', () => {
        it('should return the first item', () => {
            const iterable = new Set([1, 2, 3])

            expect(Dearrayify(iterable)).toBe(1)
        })
    })

    describe('An object', () => {
        it('should return the object', () => {
            const obj = { a: 1, b: 2, c: 3 }

            expect(Dearrayify(obj)).toBe(obj)
        })
    })

    describe('An async iterable', () => {
        it('should return the first item', async () => {
            const iterable = {
                async *[Symbol.asyncIterator]() {
                    yield 1
                    yield 2
                    yield 3
                },
            }

            expect(await asyncDearrayify(iterable)).toBe(1)
        })
    })

    describe('An async iterable with a single item', () => {
        it('should return the item', async () => {
            const iterable = {
                async *[Symbol.asyncIterator]() {
                    yield 1
                },
            }

            expect(await asyncDearrayify(iterable)).toBe(1)
        })
    })

    describe('An async iterable with no items', () => {
        it('should return undefined', async () => {
            const iterable = {
                async *[Symbol.asyncIterator]() {},
            }

            expect(await asyncDearrayify(iterable)).toBeUndefined()
        })
    })

    describe('An async iterable with a single promise', () => {
        it('should return the item', async () => {
            const iterable = {
                async *[Symbol.asyncIterator]() {
                    yield Promise.resolve(1)
                },
            }

            expect(await asyncDearrayify(iterable)).toBe(1)
        })
    })
})
