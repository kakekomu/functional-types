const path = require("path")
module.exports = {
  entry: {
    simple: "./simple/index.js",
    "simple-ts": "./simple-ts/index.js",
    mappings: "./mappings/index.js",
    "react-hooks": "./react-hooks/index.js"
  },
  output: {
    path: path.resolve("dist"),
    filename: "examples/[name]/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@kakekomu/remote-data": path.resolve(__dirname, "src/index.ts")
    }
  }
}
