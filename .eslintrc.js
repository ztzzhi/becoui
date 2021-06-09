module.exports = {
  plugins: ['@xhs/eslint-plugin-xhs'],
  extends: ['plugin:@xhs/eslint-plugin-xhs/vue'],
  // 自定义配置
  rules: {
    'vue/require-default-prop': 0,
    'no-console': 0,
    'vue/no-parsing-error': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-empty-function': 0,
    'no-void': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'no-template-curly-in-string': 0,
  },
}
