import { HttpStatus } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

export function CountMiddleware(req: Request, res: Response, next: NextFunction) {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`)
    const { pathname, searchParams } = url

    const param = searchParams.get('count')
    if (param === '' || param === 'true')
        return res.redirect(HttpStatus.TEMPORARY_REDIRECT, `${pathname.replace(/\/?$/, '')}/count`)

    return next()
}
