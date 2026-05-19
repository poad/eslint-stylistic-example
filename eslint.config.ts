import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { configs, parser } from 'typescript-eslint';
import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { defineConfig, includeIgnoreFile } from 'eslint/config';

import pluginPromise from 'eslint-plugin-promise';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  {
    ignores: [
      '**/*.d.ts',
      '*.{js,jsx}',
      'src/tsconfig.json',
      'src/stories',
      '**/*.css',
      'node_modules/**/*',
      'dist',
    ],
  },
  eslint.configs.recommended,
  ...configs.strict,
  ...configs.stylistic,
  // @ts-expect-error ignore type errors
  pluginPromise.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', '*.js', 'eslint.config.ts'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
        createNodeResolver(),
      ],
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],

      'import-x/order': [
        'error',
        {
          'groups': [
            // Imports of builtins are first
            'builtin',
            // Then sibling and parent imports. They can be mingled together
            ['sibling', 'parent'],
            // Then index file imports
            'index',
            // Then any arcane TypeScript imports
            'object',
            // Then the omitted imports: internal, external, type, unknown
          ],
        },
      ],
    },
  },
);
