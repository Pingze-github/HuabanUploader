module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true,
    $: true,
    location: true,
    Base64: true,
    config: true
  },
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 警告 console
    'no-console': 0,
    // 允许使用for-in/for-of
    'no-restricted-syntax': 0,
    // 允许箭头函数无return
    'consistent-return': 0,
    // 允许new
    'no-new': 0,
    // 允许体尾空行
    'padded-blocks': 0,
    // 不强制使用模板字符串
    'prefer-template': 0,
    // 允许空行
    'no-trailing-spaces': 0,
    // 允许箭头函数参数无括号
    'arrow-parens': 0,
    // 允许连加
    'no-plusplus': 0,
    // 允许空体
    'no-empty': 0,
    // 允许函数先使用
    'no-use-before-define': 0,
    'object-curly-newline': 0
  }
};
