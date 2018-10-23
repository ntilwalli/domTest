const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin/lib')
const path = require('path');

const config = {
  mode: 'development',
  entry: {
    main: './main.ts'
  },
  watch: true,
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/, 
        use: [{
            loader: 'awesome-typescript-loader',
            options: {
              useCache: true,
            },
          }]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
  ]
};

module.exports = config;
