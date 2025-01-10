import Natural from '@repo/types/number/Natural'

/* istanbul ignore next */
namespace Enumerate {
    export function can<N extends Natural>(n: unknown): n is Enumerate<N> {
        return Natural.is(n) && n < 1000
    }
}

type _Enumerate<N extends Natural, Acc extends Natural[] = []> = Acc['length'] extends N
    ? Acc[number]
    : _Enumerate<N, [...Acc, Acc['length']]>
type Enumerate<N extends Natural> = _Enumerate<N, []>

export const isEnumerable = Enumerate.can
export const canEnumerate = Enumerate.can

export type { Enumerate }

export default Enumerate
