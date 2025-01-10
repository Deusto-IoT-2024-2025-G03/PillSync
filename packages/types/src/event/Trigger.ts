import JSONSchema from '@repo/types/schema/JSONSchema'
import CronTime from '@repo/types/util/CronTime'

namespace Trigger {
    export const Schedule = CronTime
    export type Schedule = CronTime

    export namespace Schema {
        export const Ref = 'trigger' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,
            type: JSONSchema.Type.Object,

            required: ['schedule'],
            properties: {
                schedule: { $ref: Schedule.Schema.Ref },
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Trigger>
    }

    export type Schema = Schema.Schema
}

interface Trigger {
    schedule: Schedule
}

export const { Schedule } = Trigger
export type Schedule = Trigger.Schedule

export const { Schema } = Trigger
export type Schema = Trigger.Schema

export default Trigger
