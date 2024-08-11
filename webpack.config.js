const path = require('path');

module.exports = {
    mode: 'development',
    target: 'node',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            constant: path.resolve(__dirname, 'src/constant'),
            type: path.resolve(__dirname, 'src/type'),
            Util: path.resolve(__dirname, 'src/util'),
            Processor: path.resolve(__dirname, 'src/processor')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: {
        vscode: 'commonjs vscode'
    },
    devtool: 'source-map'
};
