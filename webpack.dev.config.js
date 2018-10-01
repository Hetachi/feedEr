var path = require('path');

module.exports = {
  target: "web",
  mode: "development",
  entry: {
    app: ["./index.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist/"),
    filename: "bundle.js",
  },
  module: {
    rules:[{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader"
      }]
    }]
  },
  devServer: {
    publicPath: '/dist/',
    contentBase: path.resolve(__dirname, "./"),
    watchContentBase: true,
    compress: true,
    port: 8080
  },
}
