const babel = require('@babel/core');
const fs = require('fs');
const options = JSON.parse(
  fs.readFileSync(__dirname + '/../{{cookiecutter.project_slug}}/.babelrc')
);

describe('babel', ()=>{
  // each test will raise an error if Babel cannot parse the file
  it('handles es6 modules', ()=>{
    babel.transformFileSync(
      __dirname + '/fixtures/import-module-example.js', options
    );
  });
  it('handles the object rest spread operator', ()=>{
    babel.transformFileSync(
      __dirname + '/fixtures/rest-spread-example.js', options
    );
  });
  it('handles async-await syntax', ()=>{
    babel.transformFileSync(
      __dirname + '/fixtures/async-await-example.js', options
    );
  });
  it('handles generator functions', ()=>{
    babel.transformFileSync(
      __dirname + '/fixtures/generator-example.js', options
    );
  });
  it('minifies', ()=>{
    process.env.BABEL_ENV = 'production';
    babel.transformFileSync(
      __dirname + '/fixtures/import-module-example.js', options
    );
  });
});
// TODO: test minification @ webpack
