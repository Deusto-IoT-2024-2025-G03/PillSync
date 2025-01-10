import { Inject, Injectable } from '@nestjs/common'
import { DBService } from 'db/db.service'

@Injectable()
export class EventService {
    @Inject(DBService) private declare dbService: DBService

    get() {
        return this.dbService.event.findMany()
    }
}
