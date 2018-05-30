const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = webpackMerge(require('./webpack.config.common.js'), {
    mode: 'production',

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new UglifyJsPlugin(),
        new CompressionPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            hash: true,
            template: 'index.html',
            chunks: [],
            title: 'Cardboard Frenzy',
        }),
    ],
});
