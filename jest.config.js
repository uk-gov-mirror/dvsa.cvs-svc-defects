module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],
  setupFiles: [
    "jest-plugin-context/setup"
  ],
  moduleFileExtensions: ["js", "ts"],
  testResultsProcessor: "jest-sonar-reporter",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["<rootDir>/tests/**/*.test.ts"]
}
