const plugins = process.env.BABAEL_CJS ? ["@babel/plugin-transform-modules-commonjs"] : []

module.exports = {
  presets: ["babel-preset-solid", "@babel/preset-typescript"],
  plugins,
}
