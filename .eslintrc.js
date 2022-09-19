module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        eqeqeq: 'off',
        curly: 'off',
        'no-inline-styles': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
