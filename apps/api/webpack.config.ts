import type { Configuration } from 'webpack'
import { totalmem } from 'node:os'
import nodeExternals from 'webpack-node-externals'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin'
import { swcDefaultsFactory } from '@nestjs/cli/lib/compiler/defaults/swc-defaults'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { resolve } from 'node:path'
const { swcOptions } = swcDefaultsFactory()

const HOT_POLL = 'webpack/hot/poll?100' as const

const config = (options: any, webpack: any): Configuration => {
    const hmr = options.WEBPACK_WATCH

    return {
        ...options,

        devtool: 'inline-source-map',

        entry: hmr ? [HOT_POLL, options.entry] : options.entry,

        externals: hmr
            ? [
                  nodeExternals({
                      allowlist: [HOT_POLL],
                  }),
              ]
            : [],

        experiments: {
            topLevelAwait: true,
        },

        node: {
            __dirname: true,
        },

        target: ['es2022'],
        output: {
            chunkFormat: 'commonjs',
            path: resolve(__dirname, 'dist'),
        },

        module: {
            rules: [
                {
                    test: /\.((m|c)?js)|(ts)$/,
                    exclude: /node_modules/,

                    resolve: {
                        fullySpecified: true,
                    },

                    use: {
                        loader: 'swc-loader',
                        options: swcOptions,
                    },

                    transpileOnly: true,
                },
            ],
        },

        resolve: {
            symlinks: false,

            alias: {
                '@repo/types': resolve(__dirname, '../../packages/types'),
                '@repo/typescript-config': resolve(__dirname, '../../packages/typescript-config'),
            },

            plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
        },

        watch: !!hmr,
        watchOptions: hmr
            ? {
                  ignored: [/\.js$/, /\.d\.ts$/],
              }
            : undefined,

        plugins: [
            ...options.plugins,

            ...(hmr
                ? [
                      new webpack.HotModuleReplacementPlugin(),

                      new RunScriptWebpackPlugin({
                          name: options.output.filename,
                          autoRestart: false,
                      }),
                  ]
                : []),

            new ForkTsCheckerWebpackPlugin({
                async: false,
                typescript: { memoryLimit: totalmem() / 1024 / 4 },
            }),
        ],
    } as const
}

export default config
