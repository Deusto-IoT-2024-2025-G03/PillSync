import Range from '@repo/types/number/Range'
import type Permutation from '@repo/types/util/Permutation'
import type { Subtract } from 'ts-arithmetic'
import JSONSchema from '@repo/types/schema/JSONSchema'
import type { Schedule as PrismaCronTime } from '@repo/db'

namespace CronTime {
    export function Prisma(crontime: CronTime) {
        const str = CronTime.String.get(crontime)
        if (!str) return undefined

        const [minute, hour, dayOfMonth, month, dayOfWeek] = str.split(' ')
        return {
            minute,
            hour,
            dayOfMonth,
            month,
            dayOfWeek,
        }
    }

    export interface Prisma extends PrismaCronTime {}

    export namespace Minute {
        export const Min = 0 as const
        export type Min = typeof Min

        export const Max = 59 as const
        export type Max = typeof Max

        export const Regex = /^(?:\*|(?:(?:\d|[0-5]\d))|(?:(?:\*\/(?:\d|[0-5]\d)))|(?:(?:\d|[0-5]\d)-(?:\d|[0-5]\d)))$/
    }

    export type Minute = Range<Minute.Min, Minute.Max>

    export namespace Hour {
        export const Min = 0 as const
        export type Min = typeof Min

        export const Max = 23 as const
        export type Max = typeof Max

        export const Regex =
            /^(?:\*|(?:(?:[0-1]?\d|2[0-3]))|(?:(?:\*\/(?:[0-1]?\d|2[0-3])))|(?:(?:[0-1]?\d|2[0-3])-(?:[0-1]?\d|2[0-3])))$/
    }

    export type Hour = Range<Hour.Min, Hour.Max>

    export namespace DayOfMonth {
        export const Min = 1 as const
        export type Min = typeof Min

        export const Max = 31 as const
        export type Max = typeof Max

        export const Regex =
            /^(?:\*|(?:(?:[0-2]?\d|3[0-1]))|(?:(?:\*\/(?:[0-2]?\d|3[0-1])))|(?:(?:[0-2]?\d|3[0-1])-(?:[0-2]?\d|3[0-1])))$/
    }

    export type DayOfMonth = Range<Month.Min, Month.Max>

    export namespace Month {
        export const January = 'jan' as const
        export type January = typeof January

        export const February = 'feb' as const
        export type February = typeof February

        export const March = 'mar' as const
        export type March = typeof March

        export const April = 'apr' as const
        export type April = typeof April

        export const May = 'may' as const
        export type May = typeof May

        export const June = 'jun' as const
        export type June = typeof June

        export const July = 'jul' as const
        export type July = typeof July

        export const August = 'aug' as const
        export type August = typeof August

        export const September = 'sep' as const
        export type September = typeof September

        export const October = 'oct' as const
        export type October = typeof October

        export const November = 'nov' as const
        export type November = typeof November

        export const December = 'dec' as const
        export type December = typeof December

        export const Regex =
            /^(?:\*|(?:(?:0?\d|1[0-2]))|(?:(?:\*\/(?:0?\d|1[0-2])))|(?:(?:0?\d|1[0-2])-(?:0?\d|1[0-2])))$/
    }

    export type Month =
        | Range<1, Permutation<Exclude<keyof typeof Month, 'Regex'>>['length']>
        | (typeof Month)[Exclude<keyof typeof Month, 'Regex'>]

    export namespace DayOfWeek {
        export const Sunday = 'sun' as const
        export type Sunday = typeof Sunday

        export const Monday = 'mon' as const
        export type Monday = typeof Monday

        export const Tuesday = 'tue' as const
        export type Tuesday = typeof Tuesday

        export const Wednesday = 'wed' as const
        export type Wednesday = typeof Wednesday

        export const Thursday = 'thu' as const
        export type Thursday = typeof Thursday

        export const Friday = 'fri' as const
        export type Friday = typeof Friday

        export const Saturday = 'sat' as const
        export type Saturday = typeof Saturday

        export const Regex =
            /^(?:\*|(?:(?:0?[0-6]|Sun|Mon|Tue|Wed|Thu|Fri|Sat))|(?:(?:\*\/(?:0?[0-6]|Sun|Mon|Tue|Wed|Thu|Fri|Sat)))|(?:(?:0?[0-6]|Sun|Mon|Tue|Wed|Thu|Fri|Sat)-(?:0?[0-6]|Sun|Mon|Tue|Wed|Thu|Fri|Sat)))$/i
    }

    export type DayOfWeek =
        | Range<0, Subtract<Permutation<Exclude<keyof typeof DayOfWeek, 'Regex'>>['length'], 1>>
        | (typeof DayOfWeek)[Exclude<keyof typeof DayOfWeek, 'Regex'>]

    export namespace String {
        export function get(cron: CronTime) {
            if (typeof cron === 'string') {
                if (String.Regex.test(cron)) return cron
                return undefined
            }

            if (typeof cron !== 'object' || cron === null) return undefined

            let { minute, hour, dayOfMonth, month, dayOfWeek } = {
                minute: '*',
                hour: '*',
                dayOfMonth: '*',
                month: '*',
                dayOfWeek: '*',
                ...cron,
            }

            switch (typeof minute) {
                case 'number': {
                    if (!Range.is(minute, Minute.Min, Minute.Max))
                        // throw new Error(`Invalid minute: '${minute}'.`)
                        return undefined
                    break
                }

                case 'string': {
                    minute = minute.trim().toLowerCase()
                    if (!Minute.Regex.test(minute))
                        // throw new Error(`Invalid minute: '${minute}'.`)
                        return undefined
                    break
                }

                default:
                    // throw new Error(`Invalid minute: '${minute}'.`)
                    return undefined
            }

            switch (typeof hour) {
                case 'number': {
                    if (!Range.is(hour, Hour.Min, Hour.Max))
                        // throw new Error(`Invalid hour: '${hour}'.`)
                        return undefined
                    break
                }

                case 'string': {
                    hour = hour.trim().toLowerCase()
                    if (!Hour.Regex.test(hour))
                        // throw new Error(`Invalid hour: '${hour}'.`)
                        return undefined
                    break
                }

                default:
                    // throw new Error(`Invalid hour: '${hour}'.`)
                    return undefined
            }

            switch (typeof dayOfMonth) {
                case 'number': {
                    if (!Range.is(dayOfMonth, DayOfMonth.Min, DayOfMonth.Max))
                        // throw new Error(`Invalid day of the month: '${dayOfMonth}'.`)
                        return undefined
                    break
                }

                case 'string': {
                    dayOfMonth = dayOfMonth.trim().toLowerCase()
                    if (!DayOfMonth.Regex.test(dayOfMonth))
                        // throw new Error(`Invalid day of the month: '${dayOfMonth}'.`)
                        return undefined
                    break
                }

                default:
                    // throw new Error(`Invalid day of the month: '${dayOfMonth}'.`)
                    return undefined
            }

            switch (typeof month) {
                case 'number': {
                    if (!Range.is(month, Month.Min, Month.Max))
                        // throw new Error(`Invalid month: '${month}'.`)
                        return undefined
                    break
                }

                case 'string': {
                    month = month.trim().toLowerCase()
                    if (!Month.Regex.test(month))
                        // throw new Error(`Invalid month: '${month}'.`)
                        return undefined
                    break
                }

                default:
                    // throw new Error(`Invalid month: '${month}'.`)
                    return undefined
            }

            switch (typeof dayOfWeek) {
                case 'number': {
                    if (!Range.is(dayOfWeek, DayOfWeek.Min, DayOfWeek.Max))
                        // throw new Error(`Invalid day of the week: '${dayOfWeek}'.`)
                        return undefined
                    break
                }

                case 'string': {
                    dayOfWeek = dayOfWeek.trim().toLowerCase()
                    if (!DayOfWeek.Regex.test(dayOfWeek))
                        // throw new Error(`Invalid day of the week: '${dayOfWeek}'.`)
                        return undefined
                    break
                }

                default:
                    // throw new Error(`Invalid day of the week: '${dayOfWeek}'.`)
                    return undefined
            }

            return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
        }

        export const Regex = new RegExp(
            `^${[Minute, Hour, DayOfMonth, Month, DayOfWeek].map(({ Regex }) => Regex.source.replace(/^\^(.*)\$$/, '(?:$1)')).join(' ')}$`,
            'i'
        )
    }

    export type String =
        `${Variations<Minute>} ${Variations<Hour>} ${Variations<DayOfMonth>} ${Variations<Month>} ${Variations<DayOfWeek>}`

    export namespace Schema {
        export const Ref = 'crontime' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,

            oneOf: [
                {
                    type: JSONSchema.Type.String,
                    pattern: CronTime.String.Regex.source,
                },

                {
                    type: JSONSchema.Type.Object,
                    properties: {
                        minute: {
                            oneOf: [
                                {
                                    type: JSONSchema.Type.Integer,
                                    minimum: Minute.Minimum,
                                    maximum: Minute.Maximum,
                                },

                                {
                                    type: JSONSchema.Type.String,
                                    pattern: Minute.Regex.source,
                                },
                            ],
                        },

                        hour: {
                            oneOf: [
                                {
                                    type: JSONSchema.Type.Integer,
                                    minimum: Hour.Minimum,
                                    maximum: Hour.Maximum,
                                },

                                {
                                    type: JSONSchema.Type.String,
                                    pattern: Hour.Regex.source,
                                },
                            ],
                        },

                        dayOfMonth: {
                            oneOf: [
                                {
                                    type: JSONSchema.Type.Integer,
                                    minimum: DayOfMonth.Minimum,
                                    maximum: DayOfMonth.Maximum,
                                },

                                {
                                    type: JSONSchema.Type.String,
                                    pattern: DayOfMonth.Regex.source,
                                },
                            ],
                        },

                        month: {
                            oneOf: [
                                {
                                    type: JSONSchema.Type.Integer,
                                    minimum: 0,
                                    maximum: Object.keys(Month).length - 1,
                                },

                                {
                                    type: JSONSchema.Type.String,
                                    pattern: Month.Regex.source,
                                },
                            ],
                        },

                        dayOfWeek: {
                            oneOf: [
                                {
                                    type: JSONSchema.Type.Integer,
                                    minimum: 0,
                                    maximum: Object.keys(DayOfWeek).length - 1,
                                },

                                {
                                    type: JSONSchema.Type.String,
                                    pattern: DayOfWeek.Regex.source,
                                },
                            ],
                        },
                    },
                },
            ],
        } as const satisfies Schema

        export type Schema = JSONSchema<CronTime>
    }

    export type Schema = Schema.Schema
}

export const { Prisma } = CronTime
export type Prisma = CronTime.Prisma

interface Base {
    minute: CronTime.Minute
    hour: CronTime.Hour
    dayOfMonth: CronTime.DayOfMonth
    month: CronTime.Month
    dayOfWeek: CronTime.DayOfWeek
}

type StrType<T extends string | number> = T &
    (T extends number ? `${T}` | (T extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ? `0${T}` : `${T}`) : {}) &
    (T extends string ? Capitalize<T> | Lowercase<T> | Uppercase<T> : {})

type Variantions<T extends string | number> =
    | StrType<T>
    | `${StrType<T>}-${StrType<T>}`
    | `${StrType<T> | '*'}/${StrType<T>}`
    | '*'

type CronTime = Partial<{ [K in keyof Base]: Variations<Base[K]> }> | CronTime.String

export default CronTime
