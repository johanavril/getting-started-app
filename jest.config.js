const { defineConfig } = require('jest');

module.exports = defineConfig({
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
});
