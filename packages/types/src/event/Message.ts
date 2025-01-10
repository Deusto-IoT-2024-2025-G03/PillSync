import type Range from '@repo/types/number/Range'
import JSONSchema from '@repo/types/schema/JSONSchema'

namespace Message {
    export namespace From {
        export namespace Length {
            export const Min = 3 as const
            export type Min = typeof Min

            export const Max = 50 as const
            export type Max = typeof Max
        }

        export type Length = Range<Length.Min, Length.Max>
    }

    export type From = string & { length: From.Length }

    export namespace Text {
        export namespace Length {
            export const Min = 0 as const
            export type Min = typeof Min

            export const Max = 999 as const
            export type Max = typeof Max
        }

        export type Length = Range<Length.Min, Length.Max>
    }

    export type Text = string & { length: Text.Length }

    export namespace Schema {
        export const Ref = 'message' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,
            type: JSONSchema.Type.Object,

            required: ['text'],
            properties: {
                from: {
                    type: JSONSchema.Type.String,
                    minLength: From.Length.Min,
                    maxLength: From.Length.Max,
                },

                text: {
                    type: JSONSchema.Type.String,
                    minLength: Text.Length.Min,
                    maxLength: Text.Length.Max,
                },
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Message>
    }

    export type Schema = Schema.Schema
}

interface Message {
    from?: Message.From
    text: Message.Text
}

export const { From } = Message
export type From = Message.From

export const { Text } = Message
export type Text = Message.Text

export const { Schema } = Message
export type Schema = Message.Schema

export default Message
