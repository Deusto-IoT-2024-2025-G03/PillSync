import type AtLeast from '@repo/types/array/AtLeast'
import type RangedArray from '@repo/types/array/RangedArray'
import type UpTo from '@repo/types/array/UpTo'
import type Range from '@repo/types/number/Range'

type Some<
    T = unknown,
    Min extends Range | undefined = undefined,
    Max extends Range<Min extends undefined ? 0 : Min> | undefined = undefined,
> =
    | T
    | (Min extends undefined
          ? Max extends undefined
              ? T[]
              : UpTo<T, NonNullable<Max>>
          : Max extends undefined
            ? AtLeast<T, NonNullable<Min>>
            : Max extends Range<NonNullable<Min>>
              ? RangedArray<T, NonNullable<Min>, NonNullable<Max>>
              : never)

export default Some
