const path = require('path');

module.exports = {
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
            	test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
          
        ],
        },
        {
        test: /\.json$/,
        loader: 'json5-loader'
        },
        ],
    },
    resolve: {
        extensions: ['.mjs', '.js', '.ts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/build'),
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './public/',
    },
     

    
};
