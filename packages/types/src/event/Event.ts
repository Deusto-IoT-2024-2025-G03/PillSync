import JSONSchema from '@repo/types/schema/JSONSchema'
import _Message from '@repo/types/event/Message'
import _Melody from '@repo/types/event/Melody'
import _Trigger from '@repo/types/event/Trigger'
import _Duration from '@repo/types/event/Duration'
import _Slot from '@repo/types/event/Slot'
import _Host from '@repo/types/event/Host'
import type { Event as PrismaEvent } from '@repo/db'
import OID from '@repo/types/util/id/OID'

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

        message?: Event.Message
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

            required: ['id', 'host', 'trigger', 'duration', 'slot'],
            properties: {
                id: ID.Schema,
                host: { oneOf: [Host.ID.Schema.Schema, { $ref: Host.Schema.Ref }] },

                message: { $ref: Message.Schema.Ref },
                melody: { $ref: Melody.Schema.Ref },

                trigger: { $ref: Trigger.Schema.Ref },
                duration: { $ref: Duration.Schema.Ref },

                slot: { $ref: Slot.Schema.Ref },
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Data>
    }

    export type Schema = Schema.Schema
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

type Event = ID | Data

export default Event
