import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { CacheInterceptor } from '@nestjs/cache-manager'
import Duration from '@repo/types/event/Duration'
import Event from '@repo/types/event/Event'
import Host from '@repo/types/event/Host'
import Melody from '@repo/types/event/Melody'
import Message from '@repo/types/event/Message'
import Slot from '@repo/types/event/Slot'
import Trigger from '@repo/types/event/Trigger'

@Controller('schema')
@UseInterceptors(CacheInterceptor)
export class SchemaController {
    @Get()
    getAll() {
        return {
            [Duration.Schema.Ref]: Duration.Schema.Schema,
            [Event.Schema.Ref]: Event.Schema.Schema,
            [Host.Schema.Ref]: Host.Schema.Schema,
            [Melody.Schema.Ref]: Melody.Schema.Schema,
            [Message.Schema.Ref]: Message.Schema.Schema,
            [Slot.Schema.Ref]: Slot.Schema.Schema,
            [Trigger.Schema.Ref]: Trigger.Schema.Schema,
        }
    }

    @Get(Duration.Schema.Ref)
    getDurationSchema() {
        return Duration.Schema.Schema
    }

    @Get(Event.Schema.Ref)
    getEventSchema() {
        return Event.Schema.Schema
    }

    @Get(Host.Schema.Ref)
    getHostSchema() {
        return Host.Schema.Schema
    }

    @Get(Melody.Schema.Ref)
    getMelodySchema() {
        return Melody.Schema.Schema
    }

    @Get(Message.Schema.Ref)
    getMessageSchema() {
        return Message.Schema.Schema
    }

    @Get(Slot.Schema.Ref)
    getSlotSchema() {
        return Slot.Schema.Schema
    }

    @Get(Trigger.Schema.Ref)
    getTriggerSchema() {
        return Trigger.Schema.Schema
    }
}
