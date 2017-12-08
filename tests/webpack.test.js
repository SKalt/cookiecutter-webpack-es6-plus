const webpack = require('webpack');
const path = require('path');
// const debug = require('debug');
const wpConfig = require(
  __dirname + '/../{{cookiecutter.project_slug}}/webpack.config.js'
);
const fs = require('fs');
const assert = require('assert');
const baseConfig = wpConfig();
baseConfig.output.path =__dirname + '/output';

const config = (fileName, base=baseConfig)=>{
  const entry = path.join(__dirname, 'fixtures', fileName);
  const config = Object.assign({}, base, {entry});
  config.output.filename = fileName;
  return config;
};

/**
 * Checks webpack builds, then uses a callback to check the transpiled files
 * @param  {String} fileName a file to transpile
 * @param  {Function|undefined} fileTest an optional callback on the transpiled
 * code
 * @param  {Object} [base=baseConfig] the webpack config object
 * @return {Promise} a promise that resolves iff the transpilation was
 * successful.
 */
function checkWebpack(fileName, fileTest, base=baseConfig) {
  return new Promise((resolve, reject)=>{
    webpack(config(fileName, base), (err, stats)=>{
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

describe('Webpack', ()=>{
  describe('Transpilation', ()=>{
    it('processing generators correctly', ()=>{
      return checkWebpack('generator-example.js');
    }),
    it('processing async-await correctly', ()=>{
      return checkWebpack('async-await-example.js');
    }),
    it('processing es6 module imports correctly', ()=>{
      return checkWebpack(
        'import-module-example.js',
        (text) => assert( text.match(/bar: ?2/g))
      );
    }),
    it('processing object rest spread correctly', ()=>{
      // debug.enable('babel');
      return checkWebpack('rest-spread-example.js');
      // debug.disable('babel');
    });
  });
  describe('Minification', ()=>{
    it('correctly minifies with uglify', ()=>{
      process.env.NODE_ENV = 'production';
      minifyConfig = wpConfig();
      minifyConfig.output.path = __dirname + '/output';
      return checkWebpack(
        'generator-example.js',
        (fileText)=>{
          // console.log(fileText.slice(0, 300));
          if (fileText.match(/\/\*\*\*\*\*\*\//)) {
            throw assert.AssertionError('not minified');
          }
        },
        base=minifyConfig
      );
    });
  });
});
