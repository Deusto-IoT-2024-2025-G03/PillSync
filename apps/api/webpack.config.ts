import type { Configuration } from 'webpack'
import { totalmem } from 'node:os'
import nodeExternals from 'webpack-node-externals'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin'
import { swcDefaultsFactory } from '@nestjs/cli/lib/compiler/defaults/swc-defaults'
const { swcOptions } = swcDefaultsFactory()

const config = (options: any, webpack: any): Configuration => {
    const hmr = options.WEBPACK_WATCH

    return {
        ...options,

        entry: hmr ? ['webpack/hot/poll?100', options.entry] : options.entry,

        externals: hmr
            ? [
                  nodeExternals({
                      allowlist: ['webpack/hot/poll?100'],
                  }),
              ]
            : undefined,

        experiments: {
            topLevelAwait: true,
        },

        node: {
            __dirname: true,
        },

        target: ['es2022'],
        output: {
            chunkFormat: 'commonjs',
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,

                    resolve: {
                        fullySpecified: false,
                    },

                    use: {
                        loader: 'swc-loader',
                        options: swcOptions,
                    },
                },
            ],
        },

        plugins: [
            ...options.plugins,

            ...(hmr
                ? [
                      new webpack.HotModuleReplacementPlugin(),

                      new webpack.WatchIgnorePlugin({
                          paths: [/\.js$/, /\.d\.ts$/],
                      }),

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
