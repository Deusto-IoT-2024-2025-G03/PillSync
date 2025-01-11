import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import type Some from '@repo/types/array/Some'
import Host from '@repo/types/event/Host'
import type Event from '@repo/types/event/Event'
import { Data, ID } from '@repo/types/event/Event'
import Hash from '@repo/types/util/Hash'
import { DBService } from 'db/db.service'
import Arrayify from '@repo/util/array/Arrayify'

@Injectable()
export class EventService {
    @Inject(DBService) private declare dbService: DBService

    private async get(
        { id, host }: { id?: Some<Event>; host?: Host } = {},
        { count, onlyId }: { count?: boolean; onlyId?: boolean } = {}
    ) {
        id = Arrayify(id)
            ?.map(x => ID.get(x))
            .filter(x => x !== undefined)

        host = Host.ID.get(host)

        const where: NonNullable<Parameters<typeof this.dbService.event.findMany>[0]>['where'] = {
            id: id ? { in: id as string[] } : undefined,
            host,
        }

        if (count) return this.dbService.event.count({ where })
        if (onlyId) return (await this.dbService.event.findMany({ where, select: { id: true } })).map(({ id }) => id)
        return this.dbService.event.findMany({ where })
    }

    count(query: Parameters<typeof this.get>[0] = {}) {
        return this.get(query, { count: true }) as Promise<number>
    }

    async exists(query: Parameters<typeof this.get>[0]): Promise<boolean> {
        return ((await this.get(query, { count: true })) as number) > 0
    }

    async getMany<OnlyID extends boolean = false>(
        query: Parameters<typeof this.get>[0],
        { onlyId }: Omit<NonNullable<Parameters<typeof this.get>[1]>, 'count' | 'onlyId'> & { onlyId?: OnlyID } = {}
    ): Promise<
        OnlyID extends true | undefined
            ? OnlyID extends false
                ? Exclude<Awaited<ReturnType<typeof this.get>>, number>
                : ID[]
            : Exclude<Awaited<ReturnType<typeof this.get>>, number | ID[]>
    > {
        return this.get(query, { onlyId }) as unknown as ReturnType<typeof this.getMany<OnlyID>>
    }

    async getOne<OnlyID extends boolean = false>(
        query: Parameters<typeof this.get>[0] = {},
        { onlyId }: { onlyId?: OnlyID } = {}
    ): Promise<Awaited<ReturnType<typeof this.getMany<OnlyID>>>[number] | undefined> {
        return (await this.getMany(query, { onlyId }))?.[0]
    }

    async put(event: Some<Event>, { host }: { host: Host }) {
        event = Arrayify(event)
        for (const e of event) {
            if (ID.is(e)) throw new BadRequestException('Invalid event')
        }

        host = Host.ID.get(host)

        const create: Record<string, NonNullable<Parameters<typeof this.dbService.event.create>[0]>['data']> = {}
        const update: Record<string, NonNullable<Parameters<typeof this.dbService.event.update>>[0]> = {}

        const found = Object.fromEntries((await this.getMany({ id: event })).map(x => [x.id, x]))
        let createSome = false
        let updateSome = false

        for (let e of event as Data[]) {
            const id = ID.get(e)!
            const f = found[id]

            if (f && Hash(e) === Hash(f)) continue

            const data = (create[id] ?? update[id] ?? {}) as
                | (typeof update)[keyof typeof update]['data']
                | (typeof create)[keyof typeof create]

            if (!f) (data as (typeof create)[keyof typeof create]).id = id

            if (f) {
                update[id] = { where: { id }, data }
                updateSome = true
            } else {
                create[id] = data as (typeof create)[keyof typeof create]
                createSome = true
            }
        }

        let createHost: NonNullable<Parameters<typeof this.dbService.host.create>[0]>['data']
        if (!(await this.dbService.host.count({ where: { id: host } }))) createHost = { id: host }

        if (updateSome) {
            let ret: Awaited<ReturnType<typeof this.dbService.$transaction>> = []
            if (createSome)
                ret = await this.dbService.$transaction([
                    this.dbService.event.createMany({ data: Object.values(create) }),
                    ...Object.values(update).map(update => this.dbService.event.update(update)),
                ])
            else
                ret = await this.dbService.$transaction([
                    ...Object.values(update).map(update => this.dbService.event.update(update)),
                ])

            return ret
        }

        if (!createSome) return []
        return this.dbService.event.createMany({ data: Object.values(create) })
    }
}
