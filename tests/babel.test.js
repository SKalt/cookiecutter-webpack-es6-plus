const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const options = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '{{cookiecutter.project_slug}}', '.babelrc'),
    'utf8'
  )
);

const checkOutput = (fixture, outputCheck) =>{
  const filename = path.join(__dirname, 'fixtures', fixture);
  const transform = babel.transformFileSync(
    filename, options
  );
  assert.ok(transform.code.length > 1, 'no code output');
  if (outputCheck) outputCheck(transform);
};

describe('babel', ()=>{
  // each test will raise an error if Babel cannot parse the file
  it('handles es6 modules', ()=>{
    checkOutput('import-module-example.js', ({code})=>console.log(code.length));
  });
  it('handles the object rest spread operator', ()=>{
    checkOutput('rest-spread-example.js', ({code})=>{
      assert.ok(
        code.match('Object.assign', 'g'),
        'rest spread not transpiled to Object.assign'
      );
    });
  });
  it('handles async-await syntax', ()=>{
    checkOutput('async-await-example.js');
  });
  it('handles generator functions', ()=>{
    checkOutput('generator-example.js');
  });
  // mangling breaks babel-minify.  Until it works, I'm using webpack's
  // UglifygjsPlugin for mangling.
  it('minifies without mangling', ()=>{
    process.env.BABEL_ENV = 'production';
    checkOutput('import-module-example.js', ({code})=>console.log(code));
  });
});
