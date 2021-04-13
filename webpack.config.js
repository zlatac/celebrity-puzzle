const path = require('path');
const production = process.env.NODE_ENV === 'production'

module.exports = [
    {
        name: 'bmr-engine',
        entry: './www/bmr/engine/src/index.js',
        mode: production ? 'production': 'development',
        devtool: production ? 'none' : 'inline-source-map',
        devServer: {
            contentBase: './www/bmr/engine/dist',
            port: 9000,
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, 'www/bmr/engine/dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'to-string-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.styl$/,
                    loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
                }
            ],
        },
        node: {
            Buffer: false
        }
    },
    {
        name: 'bmr',
        entry: './www/bmr/scripts/main.js',
        mode: production ? 'production': 'development',
        devtool: production ? 'none' : 'inline-source-map',
        devServer: {
            contentBase: './www/bmr/dist',
            port: 8080,
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, 'www/bmr/dist')
        },
        module: {},
        node: {
            Buffer: false
        }
    }
];