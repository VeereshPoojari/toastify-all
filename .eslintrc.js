module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn'
    },
    ignorePatterns: [
        'dist/',
        'node_modules/',
        '*.config.js',
        '*.config.mjs'
    ]
};