import js from '@eslint/js'
import globals from 'globals'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      semi: ['error', 'always'], // Adds missing semicolons
      quotes: ['error', 'single'] // Fixes quote style
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // keep browser globals
        process: 'readonly' // add process explicitly
      }
    },
    rules: {
      semi: ['error', 'always'], // Adds missing semicolons
      quotes: ['error', 'single'], // Fixes quote style
      indent: ['error', 2] // Fixes indentation
    }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin
    },
    rules: {
      semi: ['error', 'always'], // Adds missing semicolons
      quotes: ['error', 'single'], // Fixes quote style
      indent: ['error', 2] // Fixes indentation
    }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
]
