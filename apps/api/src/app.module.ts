import { RedisModule } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from 'config/configuration'
import { DevModule } from 'dev/dev.module'
import { HealthModule } from 'health/health.module'
import Joi from 'joi'
import { EventModule } from 'event/event.module'
import { SecurityModule } from 'security/security.module'
import { DBModule } from 'db/db.module'
import { HostModule } from 'host/host.module'

const NODE_ENV = Joi.string().valid('development', 'production', 'test').default('development')

const PARSER = Joi.alternatives([
    Joi.number().integer().positive(),
    Joi.string().pattern(/\d+((K|M|G|T)B)|((k|m|g|t)b)/),
]).default('10MB')

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: [configuration],

            validationSchema: Joi.object({
                NODE_ENV,

                devtools: Joi.object({
                    port: Joi.number().port().default(3002),
                }).default({ port: 3002 }),

                http: Joi.object({
                    host: Joi.alternatives([Joi.string().hostname(), Joi.string().ip()]).default('localhost'),
                    port: Joi.number().port().default(3001),
                    https: Joi.object({
                        cert: Joi.string().pattern(/(\/?\w+)+/),
                        key: Joi.string().pattern(/(\/?\w+)+/),
                    }).default(),
                    parser: Joi.object({
                        limit: Joi.object({
                            json: PARSER,
                            raw: PARSER,
                            text: PARSER,
                            urlencoded: PARSER,
                        }).default({
                            json: '10MB',
                            raw: '10MB',
                            text: '10MB',
                            urlencoded: '10MB',
                        }),
                    }).default({
                        parser: {
                            json: '10MB',
                            raw: '10MB',
                            text: '10MB',
                            urlencoded: '10MB',
                        },
                    }),
                }),

                jwt: Joi.object({
                    secret: Joi.string().required(),
                    expiration: Joi.object({
                        access: Joi.string()
                            .pattern(/\d+(s|min|h|d|m)/)
                            .default('15min')
                            .required(),
                        refresh: Joi.string()
                            .pattern(/\d+(s|min|h|d|m)/)
                            .default('7d')
                            .required(),
                    }),
                }),

                redis: Joi.object({
                    host: Joi.alternatives([Joi.string().hostname(), Joi.string().ip(), Joi.string().uri({})]).default(
                        'localhost'
                    ),
                    port: Joi.number().port().default(6379),
                    password: Joi.string(),
                }).default(),
            }),

            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),

        DevModule,

        DBModule,
        RedisModule.forRootAsync(
            {
                inject: [ConfigService],
                useFactory: (async (config: ConfigService) => {
                    const host = config.getOrThrow<string>('redis.host')
                    const port = config.getOrThrow<number>('redis.port')
                    const password = config.get<string>('redis.password')

                    return { config: { host, port, password } }
                }) as unknown as Parameters<typeof RedisModule.forRootAsync>[0]['useFactory'],
            },
            true
        ),

        EventModule,
        HostModule,
        SecurityModule,

        HealthModule,
    ],
})
export class AppModule {}
