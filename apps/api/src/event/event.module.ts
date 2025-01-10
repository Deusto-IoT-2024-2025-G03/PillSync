import { Module } from '@nestjs/common'
import { EventController } from 'event/event.controller'
import { EventService } from 'event/event.service'
import { SchemaModule } from 'event/schema/schema.module'
import { DBModule } from 'db/db.module'

const providers = [EventService]

@Module({
    imports: [SchemaModule, DBModule],
    controllers: [EventController],
    providers,
    exports: providers,
})
export class EventModule {}
