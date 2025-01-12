import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import CronTime from '@repo/types/util/CronTime'
import type { Trigger as PrismaTrigger } from '@repo/db'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Trigger {
    export type Prisma = PrismaTrigger

    export const Schedule = CronTime
    export type Schedule = CronTime

    export interface Data {
        schedule: Schedule
    }

    export namespace Schema {
        export const Ref = 'trigger' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,
            type: JSONSchema.Type.Object,

            required: ['schedule'],
            properties: {
                schedule: Schedule.Schema.Schema,
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Trigger>
    }

    export type Schema = Schema.Schema

    let ajv!: Ajv

    export function validate(trigger: unknown): trigger is Duration {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            ajv.addSchema([Schema.Schema, Partialize(Schema.Schema)].map(AddErrorMessages))
        }

        return ajv.validate(Schema.Ref, trigger)
    }
}

export type Prisma = Trigger.Prisma

export const { Schedule } = Trigger
export type Schedule = Trigger.Schedule

export const { Schema } = Trigger
export type Schema = Trigger.Schema

export type Data = Trigger.Data

type Trigger = Data

export const { validate } = Trigger

export default Trigger
