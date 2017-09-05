/* eslint-disable */
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const prod = process.argv[2] && process.argv[2].split('=')[1] === 'prod';
const namingScheme = prod ? '[name]-[hash]' : '[name]';
const extractSass = new ExtractTextPlugin({ filename: 'style/' + namingScheme + '.css' });

module.exports = {
    context: path.join(__dirname, 'app'),

    entry: {
        app: [
            './script/main.jsx',
        ],
    },

    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'script/' + namingScheme + '.js',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'app/script'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /\.test\.jsx?$/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react'],
                            plugins: [
                                'transform-class-properties',
                                'transform-object-rest-spread',
                            ],
                        },
                    },
                ],
            },

            {
                test: /\.sass$/,
                exclude: /external\.sass$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        extractSass,
    ],

    devServer: {
        contentBase: ['./public/script/', './public/style'],
        hot: true,
        inline: true,
        port: 3031,
        proxy: {
            "**": "http://localhost:3030",
        },
    },

    devtool: '#inline-source-map',
};
