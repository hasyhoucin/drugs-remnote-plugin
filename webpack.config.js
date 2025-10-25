const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    mode: env.production ? 'production' : 'development',
    entry: './src/widgets/index.tsx',
    devtool: env.production ? undefined : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      fallback: {
        path: false,
        fs: false,
        os: false,
      },
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'plugin',
      libraryTarget: 'commonjs',
    },
  };
};