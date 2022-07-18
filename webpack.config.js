const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/wjyvue.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "wjyvue.js",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: [["es2015", { modules: false }], "stage-1"],
        },
      },
    ],
  },
  devtool: "inline-source-map",
  devServer: {
    port: 8092,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      filename: "index.html",
      inject: "head",
      scriptLoading: "blocking",
    }),
  ],
};
