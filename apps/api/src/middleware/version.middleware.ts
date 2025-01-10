import { VersioningType } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

export const VERSION = {
    type: VersioningType.HEADER as const,
    header: 'X-API-Version' as const,
    defaultVersion: '1' as const,
} as const

const { type, header, defaultVersion } = VERSION

export function VersionMiddleware(req: Request, _res: Response, next: NextFunction) {
    if (type !== VersioningType.HEADER) return next()

    if (!req.headers[header]) req.headers[header] = defaultVersion

    next()
}
