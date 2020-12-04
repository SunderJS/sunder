module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/test/setup.ts"],
  transform: {
    '^.+\\.(jt)s?$': 'ts-jest',
    '.*': 'ts-jest',
  },
  modulePathIgnorePatterns: [
    "<rootDir>/build"
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001] // irrelevant esModuleInterop warning
      }
    }
  }
};
