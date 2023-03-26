/* eslint-disable */
export default {
  displayName: 'app-profile-data-access',
  preset: '../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/app/profile/data-access',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?angular)',
  ],
};
