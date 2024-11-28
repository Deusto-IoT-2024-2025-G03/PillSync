import { HttpStatus } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

export function CountMiddleware(req: Request, res: Response, next: NextFunction) {
    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`)
    const { origin, pathname, searchParams } = url

    const trail = pathname.split('/')

    if (trail[0] === '') {
        trail.splice(0, 1)
    }

    const api = trail[0] === 'api'
    if (api) {
        trail.splice(0, 1)
    }

    if (trail[trail.length - 1] !== 'count') {
        return next()
    }

    searchParams.append('count', '')

    trail.splice(trail.length - 1)

    return res.redirect(
        HttpStatus.PERMANENT_REDIRECT,
        `${[api ? 'api' : '', ...trail].join('/')}?${searchParams.toString()}`
    )
}
