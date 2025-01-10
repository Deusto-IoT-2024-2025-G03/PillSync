import { Global, Module } from '@nestjs/common'
import { DBService } from 'db/db.service'

const providers = [DBService]

@Global()
@Module({
    providers,
    exports: providers,
})
export class DBModule {}
