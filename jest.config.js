export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // CSS imports
    '\\.css$': 'identity-obj-proxy',
    // SVG imports - fixed regex pattern
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js',
    // Handle absolute paths for Vite
    '^/(.*)$': '<rootDir>/public/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest']
  }
};