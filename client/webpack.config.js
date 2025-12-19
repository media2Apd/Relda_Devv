const path = require('path');

module.exports = {
    mode: 'production', // Set the mode to 'production' for optimized builds
    entry: './src/index.js', // Your entry file
    output: {
        filename: 'static/js/main.[contenthash].js', // Output file with content hash for cache busting
        path: path.resolve(__dirname, 'build'), // Output directory
        sourceMapFilename: 'static/js/main.[contenthash].js.map', // Output source map file
    },
    devtool: 'source-map', // Generates full source maps for production
    module: {
        rules: [
            {
                test: /\.js$/, // Apply this rule to .js files
                exclude: /node_modules/, // Exclude node_modules
                use: {
                    loader: 'babel-loader', // Use Babel loader for transpiling
                    options: {
                        presets: ['@babel/preset-env'], // Preset for compiling ES6+ down to ES5
                    },
                },
            },
        ],
    },
    plugins: [
        // Add any other plugins you need here
    ],
};