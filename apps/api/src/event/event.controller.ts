import { Controller, Get, Inject, Param, Headers, ForbiddenException } from '@nestjs/common'
import { ID } from '@repo/types/event/Event'
import { EventService } from 'event/event.service'
import ParseOIDPipe from 'pipe/ParseOIDPipe'
import { Found } from 'decorator/method/found.decorator'

@Controller('event')
export class EventController {
    @Inject(EventService) private declare readonly eventService: EventService

    @Get()
    getMany(@Headers('X-Host') host: string | undefined) {
        if (!host) return []
        return this.eventService.getMany({ host })
    }

    @Found(`:id(${ID.Regex.source.replace(/^\^?(.+)\$?$/, '$1')})`)
    async getOne(@Param('id', ParseOIDPipe) id: ID, @Headers('X-Host') host: string | undefined) {
        const event = await this.eventService.getOne({ id })
        if (event?.host === host) return event
        throw new ForbiddenException()
    }
}
