/**
 * foo
 * @return {[type]} [description]
 */
async function foo() {
  return 1;
}

/**
 * bar
 * @return {[type]} [description]
 */
async function bar() {
  return await foo() + 1;
}

bar();
