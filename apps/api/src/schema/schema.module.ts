import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { SchemaController } from 'schema/schema.controller'

@Module({
    imports: [CacheModule.register({ ttl: 30 * 24 * 60 * 60 * 1000 })],
    controllers: [SchemaController],
})
export class SchemaModule {}
