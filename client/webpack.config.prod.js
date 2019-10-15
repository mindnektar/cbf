const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = webpackMerge(require('./webpack.config.common.js'), {
    output: {
        filename: 'script/[name].bundle.[hash].js',
        chunkFilename: 'script/[name].[chunkhash].js',
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            hash: true,
            template: 'index.template.html',
            title: 'Cardboard Frenzy',
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },

    mode: 'production',
});
