import { defineConfig } from 'tsup'

export default defineConfig({
    entryPoints: [
        'src/array/ArrLen.ts',
        'src/array/AtLeast.ts',
        'src/array/FixedArray.ts',
        'src/array/RangedArray.ts',
        'src/array/Some.ts',
        'src/array/UpTo.ts',

        'src/event/Duration.ts',
        'src/event/Event.ts',
        'src/event/Host.ts',
        'src/event/Message.ts',
        'src/event/Melody.ts',
        'src/event/Slot.ts',
        'src/event/Trigger.ts',

        'src/number/Integer.ts',
        'src/number/Natural.ts',
        'src/number/PositiveInteger.ts',
        'src/number/Range.ts',

        'src/schema/JSONSchema.ts',

        'src/util/CronTime.ts',
        'src/util/Enumerate.ts',
        'src/util/Hash.ts',
        'src/util/Permutation.ts',
        'src/util/RequestMethod.ts',
        'src/util/id/HostID.ts',
        'src/util/id/OID.ts',
        'src/util/id/UserID.ts',
    ],
    format: ['cjs', 'esm'],
    sourcemap: true,
    splitting: true,
    clean: true,
    minify: true,
    bundle: false,
    tsconfig: './tsconfig.json',
})
