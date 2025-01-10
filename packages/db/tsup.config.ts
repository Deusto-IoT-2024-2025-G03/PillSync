import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/mongodb.ts', 'src/postgresql.ts', 'src/index.ts'],
    format: ['cjs', 'esm'],

    sourcemap: false,
    splitting: false,
    clean: true,
    minify: false,

    tsconfig: './tsconfig.json',
})
