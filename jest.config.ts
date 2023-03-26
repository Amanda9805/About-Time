import { getJestProjects } from '@nrwl/jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?angular)',
  ],
  moduleNameMapper: {
    '^@mp/api/(.*)$': '<rootDir>/src/$1',
  },
};
