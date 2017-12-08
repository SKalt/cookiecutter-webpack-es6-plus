/* eslint-env node */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const debug = require('debug');
const log = debug('webpack-config');
const babelrc = JSON.parse(
  fs.readFileSync( path.join(__dirname, '.babelrc'), 'utf8')
);
log(babelrc);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env={}) => {
  log('envs:', process.env.NODE_ENV, process.env.BABEL_ENV);
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
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              // options: babelrc
              options: {
              //   presets: ['@babel/preset-env'],
                plugins: ['transform-object-rest-spread']
              }
            }
          ]
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
      new webpack.DefinePlugin(
        Object.assign({
          // to_replace: default value that can be overrided in env
          // note all string replacements must be double-quoted as with
          // JSON.stringify(your_str)
        }, env)
      )
    ].concat([
      process.env.NODE_ENV == 'production' && new UglifyJsPlugin({
        // sourcemap: true,
        uglifyOptions: {
          // see https://github.com/webpack-contrib/uglifyjs-webpack-plugin#options
          ecma: 6
        }
      })
    ]).filter((plugin) => !!plugin)
  };
};
