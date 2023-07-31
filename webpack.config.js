const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new Webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: true,
            filename: 'index.html',
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                plugins: [
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeViewBox: false,
                                            addAttributesToSVGElement: {
                                                params: {
                                                    attributes: [
                                                        {
                                                            xmlns: 'http://www.w3.org/2000/svg',
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                ],
            },
            test: /\.svg$/i,
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
            filename: '[path][name].[ext]',
            deleteOriginalAssets: true,
            publicPath: '',
            severityError: 'warning',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/images', to: 'images' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                        },
                    },
                ],
            },
            {
                test: /\.(svg)$/i,
                type: 'asset',
            },
        ],
    },
    devServer: {
        static: {
            publicPath: path.join(__dirname, 'dist'),
        },
        port: 3200,
        liveReload: true,
        compress: true,
        hot: false,
    },
};
