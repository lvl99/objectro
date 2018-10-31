const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const pkg = require("./package.json");

module.exports = {
  mode: process.env.NODE_ENV || "production",
  entry: {
    objectro: path.resolve(__dirname, "index.js"),
    "objectro.min": path.resolve(__dirname, "index.js")
  },
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "objectro",
    libraryTarget: "umd"
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "lib")],
    extensions: [".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          babelrc: true
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `${pkg.name} v${pkg.version} by ${pkg.author}
@see https://github.com/lvl99/objectro/LICENSE.md for full license info`,
      entryOnly: true
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\./
      })
    ]
  }
};
