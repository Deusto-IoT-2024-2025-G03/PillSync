import { HttpStatus } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

export function RedirectMiddleware(req: Request, res: Response, next: NextFunction) {
    const NAMES = {
        ele: 'scenario',
        answer: 'choice',
    } as const

    const url = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`)
    const { pathname, searchParams } = url

    const trail = pathname.split('/')

    if (trail[0] === '') {
        trail.splice(0, 1)
    }

    const api = trail[0] === 'api'
    if (api) {
        trail.splice(0, 1)
    }

    if (api && trail[0] === 'stats' && trail[1] === 'demographics' && trail[2] === 'eles') {
        return res.redirect(
            HttpStatus.PERMANENT_REDIRECT,
            [api ? 'api' : '', 'stats/demographics/scenarios', ...trail.slice(3)].join('/')
        )
    }

    for (const [origin, dest] of Object.entries(NAMES)) {
        if (trail[0] === origin) {
            return res.redirect(
                HttpStatus.PERMANENT_REDIRECT,
                `${[api ? 'api' : '', dest, ...trail.slice(1)].join('/')}?${searchParams.toString()}`
            )
        }
    }

    return next()
}
