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
            Processor: path.resolve(__dirname, 'src/processor'),
            Builder: path.resolve(__dirname, 'src/builder'),
            Initializer: path.resolve(__dirname, 'src/initializer'),
            InitializerContent: path.resolve(__dirname, 'src/initializer/content'),
            InitializerFile: path.resolve(__dirname, 'src/initializer/file'),
            State: path.resolve(__dirname, 'src/state')
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
