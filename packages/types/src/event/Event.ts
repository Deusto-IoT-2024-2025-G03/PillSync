import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import _Message from '@repo/types/event/Message'
import _Melody from '@repo/types/event/Melody'
import _Trigger from '@repo/types/event/Trigger'
import _Duration from '@repo/types/event/Duration'
import _Slot from '@repo/types/event/Slot'
import _Host from '@repo/types/event/Host'
import type { Event as PrismaEvent } from '@repo/db'
import OID from '@repo/types/util/id/OID'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Event {
    export type Prisma = PrismaEvent

    export const ID = OID
    export type ID = OID

    export const Host = _Host
    export type Host = _Host

    export const Message = _Message
    export type Message = _Message

    export const Melody = _Melody
    export type Melody = _Melody

    export const Trigger = _Trigger
    export type Trigger = _Trigger

    export const Duration = _Duration
    export type Duration = _Duration

    export const Slot = _Slot
    export type Slot = _Slot

    export interface Data {
        id: Event.ID
        host: Host

        messages: Event.Message[]
        melody?: Event.Melody

        trigger: Event.Trigger
        duration: Event.Duration

        slot: Event.Slot
    }

    export namespace Schema {
        export const Ref = 'event' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,
            type: JSONSchema.Type.Object,

            required: ['id', 'host', 'messages', 'trigger'],
            properties: {
                id: ID.Schema.Schema,
                host: { oneOf: [Host.ID.Schema.Schema, { $ref: Host.Schema.Ref }] },

                messages: { type: JSONSchema.Type.Array, items: { $ref: Message.Schema.Ref } },
                melody: { $ref: Melody.Schema.Ref },

                trigger: { $ref: Trigger.Schema.Ref },
                duration: { $ref: Duration.Schema.Ref },

                slot: { $ref: Slot.Schema.Ref },
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Data>
    }

    export type Schema = Schema.Schema

    let ajv!: Ajv

    export function validate(event: unknown, errors?: string[]): event is Data {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            for (const { Schema } of [
                Host.Schema,
                Message.Schema,
                Melody.Schema,
                Trigger.Schema,
                Duration.Schema,
                Slot.Schema,
                Event.Schema,
            ]) {
                ajv.addSchema([Schema, Partialize(Schema)].map(AddErrorMessages))
            }
        }

        if (errors) {
            errors.splice(0)
            const validate = ajv.compile({ $ref: Schema.Ref })

            const ret = validate(event)
            errors.push(...validate.errors)

            return ret
        }

        return ajv.validate(Schema.Ref, event)
    }
}

export type Prisma = PrismaEvent

export const { ID } = Event
export type ID = Event.ID

export type Data = Event.Data

export const { Message } = Event
export type Message = Event.Message

export const { Melody } = Event
export type Melody = Event.Message

export const { Trigger } = Event
export type Trigger = Event.Trigger

export const { Duration } = Event
export type Duration = Event.Duration

export const { Slot } = Event
export type Slot = Event.Slot

export const { Schema } = Event
export type Schema = Event.Schema

export const { validate } = Event

type Event = ID | Data

export default Event
