import { DocumentBuilder } from '@nestjs/swagger'

export const OpenApiConfig = new DocumentBuilder()
    .setTitle('PillSync')
    .setDescription('PillSync API')
    .setVersion('0.1')
    .build()
