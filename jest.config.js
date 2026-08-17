module.exports = {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/www/$1',
  }
};