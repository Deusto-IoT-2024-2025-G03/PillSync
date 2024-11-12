/** @type {import('ts-jest').JestConfigWithTsJest} */

const tsconfig = './tsconfig.json'

const { compilerOptions } = require(tsconfig)
let { paths } = compilerOptions ?? {}
paths = paths ?? {}

const { pathsToModuleNameMapper } = require('ts-jest')
const moduleNameMapper = pathsToModuleNameMapper(paths, {
    prefix: '<rootDir>',
})

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    moduleFileExtensions: ['js', 'json', 'ts'],
    extensionsToTreatAsEsm: ['.ts'],

    rootDir: './',
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper,

    projects: ['<rootDir>/apps/*', '<rootDir>/packages/*'],

    testRegex: /.*\.(e2e-)?spec\.ts$/.source,
    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                rootDir: '.',
            },
            {
                tsconfig,
                useESM: true,
            },
        ],
    },

    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageProvider: 'babel',
    coverageReporters: ['text-summary', 'html'],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },
}
