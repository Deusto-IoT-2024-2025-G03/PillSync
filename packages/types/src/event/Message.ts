import type Range from '@repo/types/number/Range'
import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import type { Message as PrismaMessage } from '@repo/db'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Message {
    export type Prisma = PrismaMessage

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

    export interface Data {
        from?: Message.From
        text: Message.Text
    }

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

    let ajv!: Ajv

    export function validate(message: unknown): message is Data {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            ajv.addSchema([Schema.Schema, Partialize(Schema.Schema)].map(AddErrorMessages))
        }

        return ajv.validate(Schema.Ref, message)
    }
}

export type Prisma = PrismaMessage

export const { From } = Message
export type From = Message.From

export const { Text } = Message
export type Text = Message.Text

export const { Schema } = Message
export type Schema = Message.Schema

export const { validate } = Message

export type Data = Message.Data

type Message = Data

export default Message
