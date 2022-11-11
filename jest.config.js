module.exports = {
  // includes resolving, transformation, etc
  preset: "solid-jest/preset/browser/",
  testEnvironment: "jsdom",

  // coverage
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coveragePathIgnorePatterns: ["assets", ".css.d.ts"],

  // Handle css, images, etc
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(scss|sass|css|less)$": "identity-obj-proxy",
  },
}
