import js from '@eslint/js';
import globals from 'globals';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['src/static/**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: {
                ...globals.browser,
                React: 'readonly',
                ReactDOM: 'readonly',
                ReactBootstrap: 'readonly',
            },
        },
    },
    {
        files: ['src/**/*.js', 'spec/**/*.js'],
        ignores: ['src/static/**/*.js'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
    },
    {
        files: ['spec/**/*.js'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.jest,
        },
    },
    {
        files: ['**/*.md'],
        plugins: { markdown },
        language: 'markdown/gfm',
        extends: ['markdown/recommended'],
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
    },
    {
        ignores: [
            '.git/',
            '**/node_modules/',
            'db/',
            '**/react*.js',
            '**/babel*.js',
            'src/static/css/bootstrap.min.css',
            'src/static/css/font-awesome/all.min.css',
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
]);
