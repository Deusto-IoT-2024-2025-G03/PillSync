import { Injectable, type OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@repo/db'

@Injectable()
export class DBService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect()
    }
}
