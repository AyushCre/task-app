module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/logs/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/server.js',
    '!backend/middleware/errorHandler.js',
    '!backend/utils/logger.js',
    '!backend/routes/tasks.js',
  ],
};
