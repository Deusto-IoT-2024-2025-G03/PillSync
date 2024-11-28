import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1_000,
                limit: 10,
            },
            {
                name: 'medium',
                ttl: 10_000,
                limit: 200,
            },
            {
                name: 'long',
                ttl: 60_000,
                limit: 1000,
            },
        ]),
    ],
})
export class ThrottleModule {}
