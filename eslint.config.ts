import tsParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

const config: FlatConfig.Config = {
 files: ['**/*.ts'],
 ignores: ['node_modules/**', 'dist/**'],
 languageOptions: {
  parser: tsParser,
  ecmaVersion: 'latest',
  sourceType: 'module',
 },
 plugins: {
  '@typescript-eslint': typescriptPlugin,
  prettier: prettierPlugin,
 },
 rules: {
  'prettier/prettier': [
   'error',
   {
    tabWidth: 1,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
    endOfLine: 'lf',
   },
  ],
 },
};

export default [config];
