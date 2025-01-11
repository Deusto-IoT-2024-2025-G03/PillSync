import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ConfigModule } from '@nestjs/config'
import { load } from 'js-yaml'

const ENCODING = 'utf8' as const

export default async () => {
    await ConfigModule.envVariablesLoaded

    let { YAML_CONFIG_FILE, NODE_ENV } = process.env
    YAML_CONFIG_FILE ??= join('config/config.yaml')
    YAML_CONFIG_FILE = join(__dirname, '..', 'dist', YAML_CONFIG_FILE)

    return { ...(load(readFileSync(YAML_CONFIG_FILE, ENCODING)) as Record<string, unknown>), NODE_ENV }
}
