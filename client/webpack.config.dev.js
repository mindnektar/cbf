const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const config = require('../shared/config');

module.exports = webpackMerge(require('./webpack.config.common.js'), {
    mode: 'development',

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        hot: true,
        inline: true,
        port: config.port.webpackDevServer,
        host: '0.0.0.0',
        disableHostCheck: true,
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],

    devtool: 'cheap-module-eval-source-map',
});
