import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'
import Duration from '@repo/types/event/Duration'
import Event from '@repo/types/event/Event'
import Melody from '@repo/types/event/Melody'
import Message from '@repo/types/event/Message'
import Slot from '@repo/types/event/Slot'
import Trigger from '@repo/types/event/Trigger'

@Controller('event/schema')
@UseInterceptors(CacheInterceptor)
export class SchemaController {
    @Get()
    getAll() {
        return {
            duration: Duration.Schema.Schema,
            event: Event.Schema.Schema,
            melody: Melody.Schema.Schema,
            message: Message.Schema.Schema,
            slot: Slot.Schema.Schema,
            trigger: Trigger.Schema.Schema,
        }
    }

    @Get('duration')
    getDurationSchema() {
        return Duration.Schema.Schema
    }

    @Get('event')
    getEventSchema() {
        return Event.Schema.Schema
    }

    @Get('melody')
    getMelodySchema() {
        return Melody.Schema.Schema
    }

    @Get('message')
    getMessageSchema() {
        return Message.Schema.Schema
    }

    @Get('slot')
    getSlotSchema() {
        return Slot.Schema.Schema
    }

    @Get('trigger')
    getTriggerSchema() {
        return Trigger.Schema.Schema
    }
}
