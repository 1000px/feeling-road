const htmlPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    target: 'electron-renderer',
    entry: './app-test/app.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../output')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new htmlPlugin({
            template: './tpls/vue-tpl.html',
            title: 'Test Webpack',
            filename: 'index.html'
        })
    ]
}