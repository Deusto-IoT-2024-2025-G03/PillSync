import { Module } from '@nestjs/common'
import { EventController } from 'event/event.controller'
import { EventService } from 'event/event.service'
import { DBModule } from 'db/db.module'

const providers = [EventService]

@Module({
    imports: [DBModule],
    controllers: [EventController],
    providers,
    exports: providers,
})
export class EventModule {}
