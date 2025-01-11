import { defineConfig } from 'tsup'

export default defineConfig({
    entryPoints: ['src/array/Arrayify.ts', 'src/array/Dearrayify.ts'],
    format: ['cjs', 'esm'],
    sourcemap: true,
    splitting: true,
    clean: true,
    minify: true,
    bundle: false,
    target: 'es2022',
    tsconfig: './tsconfig.json',
})
