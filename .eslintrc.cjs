module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Prop-types aren't used in this project.
    'react/prop-types': 'off',
    // React Three Fiber relies on many "unknown" DOM properties
    // (position, rotation-x, args, intensity, attach, ...).
    'react/no-unknown-property': 'off',
    // Apostrophes in copy are fine.
    'react/no-unescaped-entities': 'off',
  },
}
