import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { DevController } from 'dev/dev.controller'
import { DevService } from 'dev/dev.service'

@Global()
@Module({
    imports: [
        DevtoolsModule.registerAsync({
            inject: [
                ConfigService,
                // DevService
            ],
            useFactory: async (config: ConfigService /*, dev: DevService */) => ({
                http: new DevService().is(), // cannot inject DevService for some godforsaken reason
                port: config.getOrThrow<number>('devtools.port'),
            }),
        }),
    ],
    controllers: [DevController],
    providers: [DevService],
    exports: [DevService],
})
export class DevModule {}
