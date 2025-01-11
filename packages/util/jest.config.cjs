/** @type {import('ts-jest').JestConfigWithTsJest} */

const { compilerOptions } = require('./tsconfig.json')
let { paths } = compilerOptions ?? {}
paths = paths ?? {}

const { pathsToModuleNameMapper } = require('ts-jest')
const moduleNameMapper = pathsToModuleNameMapper(paths, {
    prefix: '<rootDir>',
})

module.exports = {
    ...require('../../jest.config.cjs'),
    projects: undefined,

    rootDir: './',
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper,
}
