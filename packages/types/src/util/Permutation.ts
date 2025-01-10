type _<U, T = U> = [U] extends [never] ? [] : T extends unknown ? [T, ..._<Exclude<U, T>>] : never

type Permutation<U> = _<U>

export default Permutation
