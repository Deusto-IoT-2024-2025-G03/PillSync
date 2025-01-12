import {
    Controller,
    Get,
    Put,
    Body,
    Inject,
    Param,
    Headers,
    ForbiddenException,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common'
import { ID, type Data } from '@repo/types/event/Event'
import Host from '@repo/types/event/Host'
import { EventService } from 'event/event.service'
import { DBService } from 'db/db.service'
import ParseOIDPipe from 'pipe/ParseOIDPipe'
import { Found } from 'decorator/method/found.decorator'
import type Some from '@repo/types/array/Some'

@Controller('event')
export class EventController {
    @Inject(EventService) private declare readonly eventService: EventService
    @Inject(DBService) private declare readonly dbService: DBService

    @Get()
    getMany(@Headers('X-Host') host: string | undefined) {
        if (!host) return []
        return this.eventService.getMany({ host })
    }

    @Found(`:id(${ID.Regex.source.replace(/^\^?(.+)\$?$/, '$1')})`)
    async getOne(@Param('id', ParseOIDPipe) id: ID, @Headers('X-Host') host: string | undefined) {
        if (!host) throw new UnauthorizedException('No host hash provided.')

        const event = await this.eventService.getOne({ id })
        if (!event) return event
        if (event.host === host) return event
        throw new ForbiddenException(`Event ${ID.shorten(id)} does not belong to ${host}!`)
    }

    @Found(`:id(${ID.Regex.source.replace(/^\^?(.+)\$?$/, '$1')})`, 'POST')
    async log(@Param('id', ParseOIDPipe) id: ID, @Headers('X-Host') host: string | undefined, @Body() type: string) {
        if (!host) throw new UnauthorizedException('No host hash provided.')

        const event = await this.eventService.getOne({ id })
        if (!event) return event
        if (event.host !== host) throw new ForbiddenException(`Event ${ID.shorten(id)} does not belong to ${host}!`)

        if (typeof type !== 'string' || !(type === 'start' || type === 'end'))
            throw new BadRequestException("Log type must be one of 'start' or 'end'.")

        return this.dbService.log.create({ data: { type, hostId: host, eventId: event.id } })
    }

    @Put()
    async put(@Body() event: Some<Data>, @Headers('X-Host') host: string | undefined) {
        if (!Host.ID.is(host)) throw new UnauthorizedException('No host hash provided.')
        return this.eventService.put(event, { host })
    }
}
