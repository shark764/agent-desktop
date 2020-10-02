module.exports = {
  setupFiles: [
    './internals/scripts/shim.js',
    './internals/scripts/enzymeConfig.js',
  ],
  setupFilesAfterEnv: ['./internals/scripts/setupTests.js'],
  testEnvironment: 'jest-environment-jsdom-global',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!cx-ui-components).+(js|jsx)$'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.test.{js,jsx}',
    '!app/**/messages.js',
    '!app/**/constants.js',
    '!app/**/actions.js',
    '!app/app.js',
  ],
  moduleDirectories: ['node_modules', 'app'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/internals/mocks/image.js',
  },
  testRegex: 'tests/.*\\.test\\.js$',
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
