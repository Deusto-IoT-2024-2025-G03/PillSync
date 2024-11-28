import { Injectable } from '@nestjs/common'

@Injectable()
export class DevService {
    is(): boolean {
        return process.env.NODE_ENV !== 'production'
    }

    get() {
        if (!this.is()) return undefined

        return { env: process.env.NODE_ENV }
    }
}
