module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?angular)',
  ],
  moduleNameMapper: {
    '^@mp/api/(.*)$': '<rootDir>/src/$1',
  },
};
