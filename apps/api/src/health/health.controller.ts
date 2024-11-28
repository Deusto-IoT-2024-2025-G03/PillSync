import { Agent } from 'node:https'
import { DEFAULT_REDIS, RedisService } from '@liaoliaots/nestjs-redis'
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis-health'
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager'
import { Controller, Get, HttpStatus, Inject, Req, Res } from '@nestjs/common'
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
} from '@nestjs/terminus'
import type { AxiosError } from '@nestjs/terminus/dist/errors/axios.error'
import type { Request as NestRequest, Response as NestResponse } from 'express'

export const CACHE_KEY = 'health' as const

@Controller('health')
export class HealthController {
    @Inject(CACHE_MANAGER) declare cacheManager: Cache
    #caching: Promise<void> | undefined

    @Inject(HealthCheckService) declare health: HealthCheckService

    @Inject(HttpHealthIndicator) declare http: HttpHealthIndicator
    @Inject(DiskHealthIndicator) declare disk: DiskHealthIndicator
    @Inject(MemoryHealthIndicator) declare memory: MemoryHealthIndicator
    @Inject(RedisHealthIndicator) declare redis: RedisHealthIndicator

    @Inject(RedisService) declare redisService: RedisService

    @Get()
    @HealthCheck()
    async check(@Req() req: NestRequest, @Res({ passthrough: true }) res: NestResponse) {
        if (this.#caching) {
            await this.#caching
            this.#caching = undefined
        }

        const cached = await this.cacheManager.get(CACHE_KEY)
        if (cached) {
            if (cached && typeof cached === 'object' && 'response' in cached) {
                let { status, message, response } = cached as Omit<AxiosError, 'status'> & {
                    status?: string | number
                }

                if (status) {
                    if (typeof status === 'string') {
                        status = Number.parseInt(status)
                        if (Number.isNaN(status)) status = HttpStatus.SERVICE_UNAVAILABLE
                    }

                    res.statusCode = status
                }

                if (message) res.statusMessage = message

                return response
            }

            return cached
        }

        const { headers, protocol, hostname } = req

        let { origin, host } = headers
        if (origin === undefined) origin = host ?? hostname
        if (origin === undefined) origin = 'localhost'

        const base = `${protocol}://${origin}`

        const httpsAgent = new Agent({
            rejectUnauthorized: false, // Allow mismatched certs, useful for localhost development
        })

        const result = this.health.check([
            () => this.http.pingCheck('api', new URL('/', base).toString(), { httpsAgent }),

            () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),

            () => this.memory.checkHeap('memory', 1024 * 1024 * 1024),

            () =>
                this.redis.checkHealth('redis', {
                    type: 'redis',
                    client: this.redisService.getOrThrow(DEFAULT_REDIS),
                    timeout: 500,
                }),
        ])

        result
            .then(result => {
                if (!result) {
                    this.#caching = undefined
                    return
                }

                try {
                    this.#caching = this.cacheManager.set(CACHE_KEY, result)
                } catch {
                    this.#caching = undefined
                }
            })
            .catch((error: Partial<AxiosError>) => {
                if (!error) {
                    this.#caching = undefined
                    return
                }

                let toJSON: (() => object) | undefined
                ;({ toJSON, ...error } = error)

                try {
                    this.#caching = this.cacheManager.set(CACHE_KEY, error)
                } catch {
                    this.#caching = undefined
                }
            })

        return result
    }
}
