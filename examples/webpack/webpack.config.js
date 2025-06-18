const path = require("path");

module.exports = {
  // Define multiple entry points
  entry: {
    example: "./example.js",
    fp: "./fp.js",
    misc: "./misc.js",
    minimal: "./minimal.js",
    constants: "./constants.js",
    es2: "./es2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  watch: true,
  mode: "production",
  target: "node",
};
