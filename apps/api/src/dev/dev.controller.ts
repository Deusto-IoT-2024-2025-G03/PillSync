import { Controller, Get, Head, Inject } from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { Found } from 'decorator/method/found.decorator'
import { DevService } from 'dev/dev.service'

@Controller('dev')
export class DevController {
    @Inject(DevService)
    declare service: DevService

    @Found(undefined, 'HEAD')
    @SkipThrottle({ default: true })
    is() {
        return this.service.is()
    }

    @SkipThrottle({ default: true })
    @Found()
    get() {
        return this.service.get()
    }
}
