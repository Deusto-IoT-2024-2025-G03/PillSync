import type { UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
    extends: ['@commitlint/config-conventional', '@commitlint/config-pnpm-scopes'],
    formatter: '@commitlint/format',
    rules: {
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [2, 'always', 100],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 100],
        'header-max-length': [2, 'always', 100],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [
            2,
            'always',
            [
                'lower-case',
                'upper-case',
                'camel-case',
                'kebab-case',
                'pascal-case',
                'sentence-case',
                'snake-case',
                'start-case',
            ],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'api',
                'web',
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test',
                'translation',
                'security',
            ],
        ],
    },
}

export default Configuration
