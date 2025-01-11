import HostID from '@repo/types/util/id/HostID'
import JSONSchema from '@repo/types/schema/JSONSchema'
import type { Host as PrismaHost } from '@repo/db'

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
}

export type Prisma = Host.Prisma

export const { ID } = Host
export type ID = Host.ID

export const { Schema } = Host
export type Schema = Host.Schema

export type Data = Host.Data

type Host = ID | Data

export default Host
