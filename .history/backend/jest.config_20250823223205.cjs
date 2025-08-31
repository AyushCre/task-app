module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/logs/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!server.js',
    '!middleware/errorHandler.js',
    '!utils/logger.js',
    '!routes/tasks.js',
    '!node_modules/**',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(your-esm-module)/)',
  ],
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
