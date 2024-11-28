import type { NextFunction, Request, Response } from 'express'

export function EmptyQueryMiddleware(req: Request, _res: Response, next: NextFunction) {
    const { query } = req

    for (const key in query) {
        if (query[key] === '') query[key] = 'true'
    }

    next()
}
