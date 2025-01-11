import { Module } from '@nestjs/common'
import { HostController } from 'host/host.controller'
import { HostService } from 'host/host.service'

const providers = [HostService]

@Module({
    controllers: [HostController],
    providers,
    exports: providers,
})
export class HostModule {}
