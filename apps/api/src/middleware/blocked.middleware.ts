import { Inject, Injectable, type NestMiddleware, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NextFunction, Request, Response } from 'express'

@Injectable()
export class BlockedMiddleware implements NestMiddleware {
    constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

    use(_req: Request, _res: Response, next: NextFunction) {
        if (this.config.get('internal.blocked')) throw new ServiceUnavailableException()
        next()
    }
}
