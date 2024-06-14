module.exports = module.exports = {
    roots: ['<rootDir>'],
    displayName: 'product-search-widget',
    setupFiles: ['<rootDir>/tests/setup/setup.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/mock/empty-mock.ts',
        '\\.(css|less|scss)$': '<rootDir>/tests/mock/empty-mock.ts',
    },
    globals: {
        IS_REACT_ACT_ENVIRONMENT: true,
    },
    testEnvironment: 'jsdom',
    testRegex: '.(test|spec).(jsx?|tsx?)$',
    testPathIgnorePatterns: ['<rootDir>/tests/mock', '<rootDir>/tests/setup'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs'],
};
