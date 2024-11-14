import { defineConfig } from 'tsup'

export default defineConfig({
    entryPoints: [
        'src/array/ArrLen.ts',
        'src/array/AtLeast.ts',
        'src/array/FixedArray.ts',
        'src/array/RangedArray.ts',
        'src/array/Some.ts',
        'src/array/UpTo.ts',

        'src/number/Integer.ts',
        'src/number/Natural.ts',
        'src/number/PositiveInteger.ts',
        'src/number/Range.ts',

        'src/schema/JSONSchema.ts',
    ],
    format: ['cjs', 'esm'],
    sourcemap: true,
    splitting: true,
    clean: true,
    minify: true,
    bundle: false,
    target: 'es2022',
    tsconfig: './tsconfig.json',
})
