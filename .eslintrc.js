module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'no-undef': 'off',

    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 'off',
    // very ineffective
    'react-hooks/exhaustive-deps': 'off',
    'no-restricted-syntax': 'off',
    'comma-dangle': ['error', 'always-multiline'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules', 'dist', 'cjs', 'es', '*.test.*', 'stories', '*.json', '**/*.json'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
      },
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/strict'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-implied-eval': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['src/**/*.tsx'],
      extends: ['airbnb-base', 'airbnb-typescript'],
      rules: {
        'max-len': ['error', { code: 180 }],
        'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
        'jsx-quotes': ['error', 'prefer-single'],
        'object-curly-newline': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            '': 'never',
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
          },
        ],
        // keep this off until more code is completed
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        // broken for any union type
        '@typescript-eslint/indent': 'off',
        // tailwind rules
        'tailwindcss/classnames-order': 'error',
        'tailwindcss/enforces-shorthand': 'error',
        'tailwindcss/migration-from-tailwind-2': 'off',
        'tailwindcss/no-arbitrary-value': 'off',
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/no-contradicting-classname': 'error',
      },
      plugins: ['tailwindcss'],
    },
  ],
};
