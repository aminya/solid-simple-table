exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.css$": "jest-transform-css"
  },
  preset: "ts-jest/presets/js-with-babel",
  globals: {
    "ts-jest": {
      babelConfig: true,
      useESM: false,
    },
  },
  roots: ["src"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
}
