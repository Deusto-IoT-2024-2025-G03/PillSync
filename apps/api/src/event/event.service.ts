import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import type Some from '@repo/types/array/Some'
import Host from '@repo/types/event/Host'
import type Event from '@repo/types/event/Event'
import { type Data, ID, validate, Trigger } from '@repo/types/event/Event'
import Hash from '@repo/types/util/Hash'
import { DBService } from 'db/db.service'
import Arrayify from '@repo/util/array/Arrayify'

@Injectable()
export class EventService {
    @Inject(DBService) private declare readonly dbService: DBService

    private async get(
        { id, host }: { id?: Some<Event>; host?: Host } = {},
        { count, onlyId }: { count?: boolean; onlyId?: boolean } = {}
    ) {
        id = Arrayify(id)
            ?.map(x => ID.get(x))
            .filter(x => x !== undefined)

        const hostId = Host.ID.get(host)

        const where: NonNullable<Parameters<typeof this.dbService.event.findMany>[0]>['where'] = {
            id: id ? { in: id as string[] } : undefined,
            hostId,
        }

        if (count) return this.dbService.event.count({ where })
        if (onlyId) return (await this.dbService.event.findMany({ where, select: { id: true } })).map(({ id }) => id)
        return (await this.dbService.event.findMany({ where })).map(({ hostId: host, ...event }) => ({
            ...event,
            host,
        }))
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
        const errors = []

        event = Arrayify(event)
        for (const e of event) {
            if (ID.is(e)) throw new BadRequestException('Invalid event.')
            if (!e.messages) e.messages = []
            if (!this.validate(e, errors)) throw new BadRequestException({ event: e, errors })
        }

        const hostId = Host.ID.get(host)
        if (!hostId) throw new BadRequestException('Invalid host ID.')

        const create: Record<string, NonNullable<Parameters<typeof this.dbService.event.create>[0]>['data']> = {}
        const update: Record<string, NonNullable<Parameters<typeof this.dbService.event.update>>[0]> = {}

        const found = Object.fromEntries((await this.getMany({ id: event })).map(x => [x.id, x]))
        let createSome = false
        let updateSome = false

        for (const e of event as Data[]) {
            const id = ID.get(e)
            if (!id) throw new BadRequestException('Invalid event.')
            const f = found[id]

            if (f && Hash(e) === Hash(f)) continue

            const data = (create[id] ?? update[id] ?? {}) as
                | (typeof update)[keyof typeof update]['data']
                | (typeof create)[keyof typeof create]

            if (f) {
                if (f.host !== hostId) throw new ForbiddenException(`Not the parent of event '${f.id}'`)
            } else (data as (typeof create)[keyof typeof create]).id = id
            data.hostId = hostId
            data.duration = e.duration
            data.melody = e.melody
            data.messages = e.messages
            data.slot = e.slot
            data.trigger = { schedule: Trigger.Schedule.Prisma(e.trigger.schedule) }

            if (f) {
                update[id] = { where: { id }, data }
                updateSome = true
            } else {
                create[id] = data as (typeof create)[keyof typeof create]
                createSome = true
            }
        }

        let createHost: NonNullable<Parameters<typeof this.dbService.host.create>[0]>['data']
        if (!(await this.dbService.host.count({ where: { id: hostId } }))) createHost = { data: { id: hostId } }

        if (updateSome) {
            let ret: Awaited<ReturnType<typeof this.dbService.$transaction>> = []
            if (createSome)
                ret = await this.dbService.$transaction([
                    ...(createHost ? [this.dbService.host.create(createHost)] : []),
                    this.dbService.event.createMany({ data: Object.values(create) }),
                    ...Object.values(update).map(update => this.dbService.event.update(update)),
                ])
            else
                ret = await this.dbService.$transaction([
                    ...(createHost ? [this.dbService.host.create(createHost)] : []),
                    ...Object.values(update).map(update => this.dbService.event.update(update)),
                ])

            return ret
        }

        if (!createSome) {
            if (createHost) return this.dbService.host.create(createHost)
            return []
        }

        if (createHost)
            return this.dbService.$transaction([
                [this.dbService.host.create(creatHost)],
                this.dbService.event.createMany({ data: Object.values(create) }),
            ])

        return this.dbService.event.createMany({ data: Object.values(create) })
    }

    validate(event: Event.Data) {
        return validate(event)
    }
}
