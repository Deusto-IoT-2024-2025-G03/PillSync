import type RangedArray from '@repo/types/array/RangedArray'
import type Natural from '@repo/types/number/Natural'

// biome-ignore lint/suspicious/noExplicitAny:
type ArrLen<T> = T extends any[] ? (T extends any[] ? (T[number][] extends T ? Natural : T['length']) : Natural) : never

export type MinArrLen<T> = T extends { minLength: RangedArray['minLength'] } ? T['minLength'] : ArrLen<T>
export type MaxArrLen<T> = T extends { maxLength: RangedArray['maxLength'] } ? T['maxLength'] : ArrLen<T>

export default ArrLen
