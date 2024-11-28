import { type CallHandler, type ExecutionContext, HttpStatus, Injectable, type NestInterceptor } from '@nestjs/common'
import RequestMethod from '@repo/types/util/RequestMethod'
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import type { Observable } from 'rxjs'

@Injectable()
export class CorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const http = context.switchToHttp()

        const req: ExpressRequest = http.getRequest()
        const resp: ExpressResponse = http.getResponse()

        const headers = resp.getHeaders()

        const { method } = req
        if (method === RequestMethod.OPTIONS) {
            resp.status(HttpStatus.NO_CONTENT)
            resp.setHeader('Access-Control-Allow-Origin', headers.origin || '*')
            resp.setHeader('Vary', 'Origin')
            resp.setHeader('Access-Control-Allow-Origin', 'https://localhost:3001')
            resp.setHeader('Access-Controll-Allow-Methods', Object.values(RequestMethod).join(', '))

            return next.handle()
        }

        let { origin } = req.headers
        if (origin === undefined) origin = req.hostname ?? req.headers.host

        resp.setHeader('Vary', 'Origin')

        resp.setHeader('Access-Control-Allow-Origin', origin)
        resp.setHeader('Access-Control-Allow-Credentials', 'true')
        resp.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Accept, Origin, Cache-Control, X-Requested-With, Cookie, Set-Cookie'
        )
        resp.setHeader('Access-Control-Allow-Methods', Object.values(RequestMethod).join(', '))
        resp.setHeader('Cache-Control', 'no-cache')

        return next.handle()
    }
}
