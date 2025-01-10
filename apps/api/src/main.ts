import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule } from '@nestjs/swagger'
import type Natural from '@repo/types/number/Natural'
import type PositiveInteger from '@repo/types/number/PositiveInteger'
import compression from 'compression'
import helmet from 'helmet'
import { CorsInterceptor } from 'interceptor/cors.interceptor'
import { CountMiddleware } from 'middleware/count.middleware'
import { EmptyQueryMiddleware } from 'middleware/emptyquery.middleware'
import { VERSION, VersionMiddleware } from 'middleware/version.middleware'
import { OpenApiConfig } from 'openapi/config'
import type { Lt } from 'ts-arithmetic'
import { AppModule } from '/app.module'

// biome-ignore lint/suspicious/noExplicitAny: Hot Module Reload
declare const module: any

async function bootstrap() {
    const [cert, key] = await Promise.all([
        readFile(join(__dirname, '..', 'dist', 'certs', 'cert.crt'), 'utf-8'),
        readFile(join(__dirname, '..', 'dist', 'certs', 'key.key'), 'utf-8'),
    ])

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        abortOnError: false,
        snapshot: true,
        httpsOptions: {
            cert,
            key,
        },
        rawBody: true,
    })

    app.enableShutdownHooks()

    SwaggerModule.setup('', app, SwaggerModule.createDocument(app, OpenApiConfig))

    app.enableVersioning(VERSION)

    app.useGlobalInterceptors(new CorsInterceptor())

    app.use(helmet(), compression(), VersionMiddleware, CountMiddleware, EmptyQueryMiddleware)

    const configService = app.get(ConfigService)

    {
        const json = configService.get<string | PositiveInteger>('http.parser.limit.json')
        if (json) app.useBodyParser('json', { limit: json })

        const raw = configService.get<string | PositiveInteger>('http.parser.limit.raw')
        if (raw) app.useBodyParser('raw', { limit: raw })

        const text = configService.get<string | PositiveInteger>('http.parser.limit.text')
        if (text) app.useBodyParser('text', { limit: text })

        const urlencoded = configService.get<string | PositiveInteger>('http.parser.limit.urlencoded')
        if (urlencoded) app.useBodyParser('urlencoded', { limit: urlencoded, extended: true })
    }

    const port = configService.getOrThrow<Lt<Natural, 65535> | string>('http.port')
    await app.listen(port)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(app.close)
    }
}
bootstrap()
