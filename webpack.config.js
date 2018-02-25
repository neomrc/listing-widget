const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        index: ['babel-polyfill', './src/js/client.js']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'env', 'stage-0'],
                        plugins: ['transform-class-properties']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: PRODUCTION ? '[hash:base64:5]' : '[local]'
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new Dotenv({
            path: './.env',
            safe: false
        })
    ],
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: "[name]/listing-widget.js"
    }
};