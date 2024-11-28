import { Module } from '@nestjs/common'
import { ThrottleModule } from 'security/throttle/throttle.module'

@Module({
    imports: [ThrottleModule],
})
export class SecurityModule {}
