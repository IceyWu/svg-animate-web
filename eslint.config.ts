import antfu from '@antfu/eslint-config'

export default antfu({
  overrides: {
    typescript: {
      'ts/ban-ts-comment': 'off',
      'ts/prefer-ts-expect-error': 'off',
      'ts/consistent-indexed-object-style': 'off',
    },
  },

  ignores: ['play/'],

})
