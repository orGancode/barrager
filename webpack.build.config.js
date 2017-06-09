var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    bundle: './src/index.es6',
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(es6)|(js)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        loader: 'url-loader?limit=8096&name=images/[hash].[ext]'
　　　　}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'html-withimg-loader!' + __dirname + "/src/index.html"
    }),
    new ExtractTextPlugin("style.css"),
    new webpack.optimize.UglifyJsPlugin(),
  ]
};
