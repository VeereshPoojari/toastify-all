module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    testMatch: [
        '<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/examples/**/*'
    ]
};