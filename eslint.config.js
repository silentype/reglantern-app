import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import noUnlistedHexColors from './eslint-rules/no-unlisted-hex-colors.js';

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      'dist',
      'storybook-static',
      'src/imports/**',
      // Generated artifact retained from Figma Make: kept for completeness, not edited.
      'default_shadcn_theme.css',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    files: ['src/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FileList: 'readonly',
        File: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLElement: 'readonly',
        SVGSVGElement: 'readonly',
        DragEvent: 'readonly',
        Event: 'readonly',
        Element: 'readonly',
        process: 'readonly',
        NodeJS: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      local: { rules: { 'no-unlisted-hex-colors': noUnlistedHexColors } },
    },
    settings: { react: { version: '18.3' } },
    rules: {
      // React 17+ JSX transform: no need to import React.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // We use TypeScript for prop validation.
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      ...reactHooks.configs.recommended.rules,

      // Pragmatic: this is a 5k-line inherited Figma Make codebase. Tighten later.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-undef': 'off', // TypeScript handles this better.

      // See eslint-rules/approved-colors.js and CLAUDE.md's "Colors" table —
      // the app's whole palette should be a closed, deliberate set.
      'local/no-unlisted-hex-colors': 'error',
    },
  },

  {
    // /test/colors, /test/typography, and Storybook are documentation/dev
    // surfaces that intentionally enumerate colors as page content — not
    // shipped app UI. Colors.stories.tsx in particular has its own drifted
    // palette values (e.g. '#ffcc66' vs the real '#fc6') that should
    // eventually point at eslint-rules/approved-colors.js instead of
    // maintaining a fourth independent copy, but that's a separate cleanup.
    files: [
      'src/app/pages/ColorsPage.tsx',
      'src/app/pages/TypographyPage.tsx',
      '**/*.stories.tsx',
      '.storybook/**/*.{ts,tsx}',
    ],
    rules: {
      'local/no-unlisted-hex-colors': 'off',
    },
  }
);
