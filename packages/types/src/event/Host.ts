import HostID from '@repo/types/util/id/HostID'
import JSONSchema, { AddErrorMessages, Partialize } from '@repo/types/schema/JSONSchema'
import type { Host as PrismaHost } from '@repo/db'
import Ajv from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'

namespace Host {
    export type Prisma = PrismaHost

    export const ID = HostID
    export type ID = HostID

    export interface Data {
        id: ID
    }

    export namespace Schema {
        export const Ref = 'host' as const
        export type Ref = typeof Ref

        export const Schema = {
            $id: Ref,

            type: JSONSchema.Type.Object,
            properties: {
                id: HostID.Schema.Schema,
            },
        } as const satisfies Schema

        export type Schema = JSONSchema<Data>
    }

    export type Schema = Schema.Schema

    let ajv!: Ajv

    export function validate(host: unknown): host is Host {
        if (!ajv) {
            ajv = new Ajv({
                allErrors: true,
                verbose: true,
            })

            ajv_errors(ajv)
            addFormats(ajv)

            ajv.addSchema([Schema.Schema, Partialize(Schema.Schema)].map(AddErrorMessages))
        }

        return ajv.validate(Schema.Ref, host)
    }
}

export type Prisma = Host.Prisma

export const { ID } = Host
export type ID = Host.ID

export const { Schema } = Host
export type Schema = Host.Schema

export const { validate } = Host

export type Data = Host.Data

type Host = ID | Data

export default Host
