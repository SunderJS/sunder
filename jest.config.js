module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ["<rootDir>/test/setup.ts"],
    transform: {
      '^.+\\.(jt)s?$': 'ts-jest',
      '.*': 'ts-jest',
    },
    globals: {
      'ts-jest': {
        diagnostics: {
          ignoreCodes: [151001] // irrelevant esModuleInterop warning
      }
    }
  }
};
