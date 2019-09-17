const path = require('path');

module.exports = {
    context: __dirname,

    entry: {
        app: ['whatwg-fetch', './client/main.jsx'],
    },

    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'script/[name].js',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname),
            path.join(__dirname, 'client'),
            path.join(__dirname, 'client/components/ui'),
            'node_modules',
        ],
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread',
                            ],
                        },
                    },
                ],
            },

            {
                test: /\.sass$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { url: false } },
                    { loader: 'sass-loader' },
                    { loader: 'import-glob-loader' },
                ],
            },
        ],
    },
};
