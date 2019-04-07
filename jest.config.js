module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|mjs)$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  }
};
