const assert = require('assert');
const eslint = require('eslint');
const linter = new eslint.CLIEngine({
  configFile: __dirname + '/../{{cookiecutter.project_slug}}/.eslintrc.yml',
});
const lint = (text) => linter.executeOnText(text).results[0];
// helpers for linting assertions
describe('eslint configuration', ()=>{
  it('object rest spread operator does not cause an error', ()=>{
    const text = '{...{a: 1}}\n';
    lint(text).messages.forEach((msg) =>{
      assert.notEqual(
        msg, 'Parsing error: Unexpected token ...', '... not parsed'
      );
    });
  });
  it('2-space indentaion required', ()=>{
    assert.deepEqual(
      linter.config.specificConfig.rules.indent,
      ['error', 2],
      'indent rule is not 2 spaces'
    );
  });
});
