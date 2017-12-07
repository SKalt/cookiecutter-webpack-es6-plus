/* eslint-env node */
const path = require('path');
// const fs = require('fs');
// const webpack = require('webpack');

module.exports = (env={}) => {
  return {
    entry: './src/js/main.js',
    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          // see https://webpack.js.org/loaders/babel-loader/
          // options and plugins are specified in .babelrc
          test: /\.js$/,
          use: 'babel-loader'
          },
          exclude: /(node_modules|bower_components)/,
        },
        // see https://webpack.js.org/loaders/#styling
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        // see https://webpack.js.org/loaders/#files
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(Object.assign({
        // to_replace: default value that can be overrided in env
        // note all string replacements must be double-quoted as with
        // JSON.stringify(your_str)
      }, env)
    ],
  };
};