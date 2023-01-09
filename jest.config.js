module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|mjs)$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverageFrom: ["lib/**/*.ts"],
  coverageReporters: ["text-summary", "html"],
  watchPathIgnorePatterns: ["<rootDir>/node_modules/"]
};
