const path = require("path")
module.exports = {
  entry: {
    simple: "./examples/simple/index.js",
    "simple-ts": "./examples/simple-ts/index.js",
    mappings: "./examples/mappings/index.js",
    "react-hooks": "./examples/react-hooks/index.js"
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
