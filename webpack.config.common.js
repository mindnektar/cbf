const path = require('path');

module.exports = {
    context: __dirname,

    entry: {
        app: ['@babel/polyfill', './client/main.jsx'],
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

            {
                // needed for apollo-link-state
                // see: https://github.com/apollographql/apollo-link-state/issues/302
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
            },
        ],
    },
};
