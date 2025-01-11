import { Body, Controller, Inject, Post } from '@nestjs/common'
import { HostService, HostDetailsDTO } from 'host/host.service'

@Controller('host')
export class HostController {
    @Inject(HostService) private declare readonly hostService: HostService

    @Post('hash')
    hash(@Body() host: HostDetailsDTO) {
        return this.hostService.hash(host)
    }
}
