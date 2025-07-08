import uni from '@uni-helper/eslint-config'

export default uni({
  rules: {
    'no-console': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
  ignores: [
    'dist/outfile.cjs',
    'packages/gui',
  ],
})
