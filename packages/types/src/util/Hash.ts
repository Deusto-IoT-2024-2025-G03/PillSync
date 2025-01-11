import { createHash } from 'crypto'

function Hash(
    data: NonNullable<unknown>,
    algorithm?: Hash.Algorithm
): typeof algorithm extends undefined
    ? Hash<NonNullable<typeof algorithm> | Hash.Algorithm.Default>
    : Hash<NonNullable<typeof algorithm>>
function Hash(
    data: unknown,
    algorithm: Hash.Algorithm = Hash.Algorithm.Default.Name
): Hash<typeof algorithm> | undefined {
    if (data === null || data === undefined) return

    if (typeof data === 'object' && 'metadata' in data) {
        let metadata: unknown
        ;({ metadata, ...data } = data)
    }

    // https://www.rfc-editor.org/rfc/rfc8785
    // https://github.com/cyberphone/json-canonicalization/blob/master/node-es6/canonicalize.js
    // TO-DO:
    //   - Make sure that the JSON is I-JSON-compliant (https://www.rfc-editor.org/rfc/rfc7493)
    //     - Encoded using UTF-8
    //     - More precision than IEEE 754 double precision -> Stringification
    //     - Integers outside of the range [-(2 ** 53) + 1, (2 ** 53) - 1] -> Stringification
    //     - No duplicated names (after escaped character processing)
    //     - Timestamps and dates -> ISO 8601 as in https://www.rfc-editor.org/rfc/rfc3339 (RECOMMENDED, not necessary) and:
    //       - Uppercase > lowercase
    //       - Timezone included
    //       - Trailing seconds ALWAYS included (even when 00)
    //     - Durations -> https://www.rfc-editor.org/rfc/rfc3339#appendix-A
    //     - Binary data -> base64url

    function serialize(o: unknown) {
        if (o === undefined) return

        if (typeof o !== 'object') {
            if (typeof o === 'bigint') {
                if (o < -(2 ** 53) + 1) o = o.toString()
                else if (o > 2 ** 53 - 1) o = o.toString()
            } else if (typeof o === 'number' && Number.isInteger(o) && !Number.isSafeInteger(o)) {
                o = o.toString(10)
            }

            buf += JSON.stringify(o)
            return
        }

        if (o === null) {
            buf += 'null'
            return
        }

        const { toJSON } = o as Record<string, unknown>
        if (toJSON) {
            buf += JSON.stringify(o)
            return
        }

        if (Array.isArray(o)) {
            buf += '['

            const { length } = o
            if (length) {
                serialize(o[0])
                for (let i = 1; i < length; i++) {
                    buf += ','
                    serialize(o[i])
                }
            }

            buf += ']'
            return
        }

        buf += '{'

        const keys = Object.keys(o)
        keys.sort()

        const { length } = keys
        if (length) {
            buf += JSON.stringify(keys[0])
            buf += ':'
            serialize(o[keys[0] as keyof typeof o])

            for (let i = 1; i < length; i++) {
                buf += ','

                buf += JSON.stringify(keys[0])
                buf += ':'
                serialize(o[keys[0] as keyof typeof o])
            }
        }

        buf += '}'
    }

    let buf = ''
    serialize(data)
    return createHash(algorithm).update(buf).digest(Hash.Encoding) as Hash<typeof algorithm>
}

namespace Hash {
    type NodeDigest = Parameters<typeof createHash>[0]

    export namespace Algorithm {
        export namespace SHA {
            export namespace SHA1 {
                export const Name = 'sha1' as const
                export type Name = typeof Name

                export const Length = 40 as const
                export type Length = typeof Length

                export const Regex = /^[a-f0-9]{40}$/
            }

            export type SHA1 = SHA1.Name

            export namespace SHA2 {
                export namespace SHA2_224 {
                    export const Name = 'sha224' as const
                    export type Name = typeof Name

                    export const Length = 56 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{56}$/
                }

                export type SHA2_224 = SHA2_224.Name

                export namespace SHA2_256 {
                    export const Name = 'sha256' as const
                    export type Name = typeof Name

                    export const Length = 64 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{64}$/
                }

                export type SHA2_256 = SHA2_256.Name

                export namespace SHA2_384 {
                    export const Name = 'sha384' as const
                    export type Name = typeof Name

                    export const Length = 96 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{96}$/
                }

                export type SHA2_384 = SHA2_384.Name

                export namespace SHA2_512 {
                    export const Name = 'sha512' as const
                    export type Name = typeof Name

                    export const Length = 128 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{128}$/
                }

                export type SHA2_512 = SHA2_512.Name

                export namespace SHA2_512_224 {
                    export const Name = 'sha512-224' as const
                    export type Name = typeof Name

                    export const Length = 56 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{56}$/
                }

                export type SHA2_512_224 = SHA2_512_224.Name

                export namespace SHA2_512_256 {
                    export const Name = 'sha512-256' as const
                    export type Name = typeof Name

                    export const Length = 64 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{64}$/
                }

                export type SHA2_512_256 = SHA2_512_256.Name
            }

            export type SHA2 =
                | SHA2.SHA2_224
                | SHA2.SHA2_256
                | SHA2.SHA2_384
                | SHA2.SHA2_512
                | SHA2.SHA2_512_224
                | SHA2.SHA2_512_256

            export namespace SHA3 {
                export namespace SHA3_224 {
                    export const Name = 'sha3-224' as const
                    export type Name = typeof Name

                    export const Length = 56 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{56}$/
                }

                export type SHA3_224 = SHA3_224.Name

                export namespace SHA3_256 {
                    export const Name = 'sha3-256' as const
                    export type Name = typeof Name

                    export const Length = 64 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{64}$/
                }

                export type SHA3_256 = SHA3_256.Name

                export namespace SHA3_384 {
                    export const Name = 'sha3-384' as const
                    export type Name = typeof Name

                    export const Length = 96 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{96}$/
                }

                export type SHA3_384 = SHA3_384.Name

                export namespace SHA3_512 {
                    export const Name = 'sha3-512' as const
                    export type Name = typeof Name

                    export const Length = 128 as const
                    export type Length = typeof Length

                    export const Regex = /^[a-f0-9]{128}$/
                }

                export type SHA3_512 = SHA3_512.Name
            }

            export type SHA3 = SHA3.SHA3_224 | SHA3.SHA3_256 | SHA3.SHA3_384 | SHA3.SHA3_512
        }

        export type SHA = SHA.SHA1 | SHA.SHA2 | SHA.SHA3

        export const Default = SHA.SHA3.SHA3_224
        export type Default = SHA.SHA3.SHA3_224

        export const All = [
            SHA.SHA1,

            SHA.SHA2.SHA2_224,
            SHA.SHA2.SHA2_256,
            SHA.SHA2.SHA2_384,
            SHA.SHA2.SHA2_512,
            SHA.SHA2.SHA2_512_224,
            SHA.SHA2.SHA2_512_256,

            SHA.SHA3.SHA3_224,
            SHA.SHA3.SHA3_256,
            SHA.SHA3.SHA3_384,
            SHA.SHA3.SHA3_512,
        ] as const
        export type All = typeof All

        export function is(algorithm: unknown): algorithm is Algorithm {
            switch (algorithm) {
                case SHA.SHA1:

                case SHA.SHA2.SHA2_224:
                case SHA.SHA2.SHA2_256:
                case SHA.SHA2.SHA2_384:
                case SHA.SHA2.SHA2_512:
                case SHA.SHA2.SHA2_512_224:
                case SHA.SHA2.SHA2_512_256:

                case SHA.SHA3.SHA3_224:
                case SHA.SHA3.SHA3_256:
                case SHA.SHA3.SHA3_384:
                case SHA.SHA3.SHA3_512:
                    return true
            }

            return false
        }
    }

    export type Algorithm = Algorithm.SHA

    export const Encoding = 'hex' as const satisfies Parameters<
        ReturnType<ReturnType<typeof createHash>['update']>['digest']
    >[0]
    export type Encoding = typeof Encoding

    export function is<Algorithm extends Hash.Algorithm>(hash: number, algorithm: Algorithm): false
    export function is<Algorithm extends Hash.Algorithm>(hash: bigint, algorithm: Algorithm): false
    export function is<Algorithm extends Hash.Algorithm>(hash: object, algorithm: Algorithm): false
    export function is<Algorithm extends Hash.Algorithm>(hash: null, algorithm: Algorithm): false
    export function is<Algorithm extends Hash.Algorithm>(hash: undefined, algorithm: Algorithm): false
    export function is<Algorithm extends Hash.Algorithm>(hash: string, algorithm: Algorithm): boolean
    export function is<Algorithm extends Hash.Algorithm>(hash: Hash, algorithm: Algorithm): boolean
    export function is<Algorithm extends Hash.Algorithm>(hash: Hash<Algorithm>, algorithm: Algorithm): true
    export function is<Algorithm extends Hash.Algorithm>(hash: unknown, algorithm: Algorithm): hash is Hash<Algorithm>
    export function is<Algorithm extends Hash.Algorithm>(hash: unknown, algorithm: Algorithm): hash is Hash<Algorithm> {
        if (typeof hash !== 'string') return false

        const REGEXES = {
            [Algorithm.SHA.SHA1.Name]: Algorithm.SHA.SHA1.Regex,

            [Algorithm.SHA.SHA2.SHA2_224.Name]: Algorithm.SHA.SHA2.SHA2_224.Regex,
            [Algorithm.SHA.SHA2.SHA2_256.Name]: Algorithm.SHA.SHA2.SHA2_256.Regex,
            [Algorithm.SHA.SHA2.SHA2_384.Name]: Algorithm.SHA.SHA2.SHA2_384.Regex,
            [Algorithm.SHA.SHA2.SHA2_512.Name]: Algorithm.SHA.SHA2.SHA2_512.Regex,
            [Algorithm.SHA.SHA2.SHA2_512_224.Name]: Algorithm.SHA.SHA2.SHA2_512_224.Regex,
            [Algorithm.SHA.SHA2.SHA2_512_256.Name]: Algorithm.SHA.SHA2.SHA2_512_256.Regex,

            [Algorithm.SHA.SHA3.SHA3_224.Name]: Algorithm.SHA.SHA3.SHA3_224.Regex,
            [Algorithm.SHA.SHA3.SHA3_256.Name]: Algorithm.SHA.SHA3.SHA3_256.Regex,
            [Algorithm.SHA.SHA3.SHA3_384.Name]: Algorithm.SHA.SHA3.SHA3_384.Regex,
            [Algorithm.SHA.SHA3.SHA3_512.Name]: Algorithm.SHA.SHA3.SHA3_512.Regex,
        } as const

        return REGEXES[algorithm].test(hash)
    }
}

type Hash<Algorithm extends Hash.Algorithm = Hash.Algorithm> = Hash.Encoding extends string
    ?
          | string
          | (
                | (Algorithm extends Hash.Algorithm.SHA.SHA1
                      ? string & { length: Hash.Algorithm.SHA.SHA1.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA2.SHA2_224
                      ? string & { length: Hash.Algorithm.SHA.SHA2.SHA2_224.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA2.SHA2_256
                      ? string & { length: Hash.Algorithm.SHA.SHA2.SHA2_256.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA2.SHA2_384
                      ? string & { length: Hash.Algorithm.SHA.SHA2.SHA2_384.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA2.SHA2_512
                      ? string & { length: Hash.Algorithm.SHA.SHA2.SHA2_512.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA2.SHA2_512_224
                      ? string & { length: Hash.Algorithm.SHA.SHA2.SHA2_512_224.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA2.SHA2_512_256
                      ? string & { length: Hash.Algorithm.SHA.SHA2.SHA2_512_256.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA3.SHA3_224
                      ? string & { length: Hash.Algorithm.SHA.SHA3.SHA3_224.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA3.SHA3_256
                      ? string & { length: Hash.Algorithm.SHA.SHA3.SHA3_256.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA3.SHA3_384
                      ? string & { length: Hash.Algorithm.SHA.SHA3.SHA3_384.Length }
                      : never)
                | (Algorithm extends Hash.Algorithm.SHA.SHA3.SHA3_512
                      ? string & { length: Hash.Algorithm.SHA.SHA3.SHA3_512.Length }
                      : never)
            )
    : Buffer

export default Hash
