import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health'
import { HttpModule } from '@nestjs/axios'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from 'health/health.controller'

@Module({
    imports: [
        CacheModule.register({
            ttl: 30 * 1000,
            store: 'memory',
            isGlobal: false,
            max: 1,
        }),
        TerminusModule.forRoot({}),
        RedisHealthModule,
        HttpModule,
    ],
    controllers: [HealthController],
})
export class HealthModule {}
