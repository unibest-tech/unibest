import uni from '@uni-helper/eslint-config'

export default uni({
  rules: {
    'no-console': 'warn',
  },
  ignores: [
    'dist/outfile.cjs',
    'packages/gui',
  ],
})
