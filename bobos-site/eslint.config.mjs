import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: '@/**', group: 'internal' },
            {
              pattern: '*.css',
              group: 'index',
              position: 'after',
              patternOptions: { matchBase: true },
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['../*'], message: 'Use the @/ alias instead of parent-relative imports.' },
          ],
        },
      ],
    },
  },
  {
    // UI primitives must never depend on restaurant-specific code.
    files: ['src/components/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/features/*', '@/data/*', '@/providers/*'],
              message: 'ui/ must not import feature code.',
            },
            { group: ['../*'], message: 'Use the @/ alias instead of parent-relative imports.' },
          ],
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
