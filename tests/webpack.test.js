const webpack = require('webpack');
const path = require('path');
const debug = require('debug');
debug.enable('w*');
const log = debug('wp-test');
const wpConfig = require(
  __dirname + '/../{{cookiecutter.project_slug}}/webpack.config.js'
);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
// log(wpConfig());
const assert = require('assert');
// baseConfig.entry = path.join(__dirname, 'fixtures'all-syntax.js';
const baseConfig = wpConfig();
baseConfig.output.path =__dirname + '/output';

const config = (fileName, base=baseConfig)=>{
  console.log('\n\nbase:', base, '\n\n');
  const entry = path.join(__dirname, 'fixtures', fileName);
  const config = Object.assign({}, base, {entry});
  config.output.filename = fileName;
  return config;
};

/**
 * Checks webpac builds, then checks
 * @param  {[type]} fileName          [description]
 * @param  {[type]} fileTest          [description]
 * @param  {[type]} [base=baseConfig] [description]
 * @return {[type]}                   [description]
 */
function checkWebpack(fileName, fileTest, base=baseConfig) {
  return new Promise((resolve, reject)=>{
    webpack(config(fileName, base), (err, stats)=>{
      console.log('\n----', base.plugins[1], '---\n');
      if (err) reject(err);
      if (stats.compilation.errors.length > 0) {
        reject(
          new Error(
            stats.compilation.errors.join('\n========================\n')
          )
        );
      }
      // console.log(stats.compilation.errors);
      if (fileTest) {
        fileTest(
          fs.readFileSync(
            path.join(__dirname, 'output', fileName), 'utf8')
        );
      }
      resolve();
    });
  });
}

describe('webpack', ()=>{
  describe('Uses babel', ()=>{
    // it('processing generators correctly', ()=>{
    //   return checkWebpack('generator-example.js');
    // }),
    // it('processing async-await correctly', ()=>{
    //   return checkWebpack('async-await-example.js');
    // }),
    // it('processing es6 module imports correctly', ()=>{
    //   return checkWebpack(
    //     'import-module-example.js',
    //     (text) => assert( text.match(/bar: ?2/g))
    //   );
    // }),
    it('processing object rest spread correctly', ()=>{
      debug.enable('babel');
      return checkWebpack('rest-spread-example.js');
      debug.disable('babel');
    }),
    it('minifying correctly', ()=>{
      process.env.NODE_ENV = 'production';
      minifyConfig = wpConfig();
      minifyConfig.plugins.push(
        new UglifyJsPlugin({
          // sourcemap: true,
          uglifyOptions: {
            // see https://github.com/webpack-contrib/uglifyjs-webpack-plugin#options
            ecma: 6
          }
        })
      );
      console.log('----------------', minifyConfig.plugins);
      return checkWebpack(
        'generator-example.js',
        (fileText)=>{
          console.log(fileText.slice(0, 300));
          if (fileText.match(/\/\*\*\*\*\*\*\//)) {
            assert(false, 'not minified');
          }
        },
        base=minifyConfig
      );
    });
  });
});
