const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();

const aliases = {};

const js = {
  test: /\.(ts|js)x?$/,
  use: 'babel-loader',
};

module.exports = {
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: aliases,
  },
  entry: path.resolve(__dirname, 'client/index'),
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    publicPath: '/',
  },
  module: {
    rules: [
      js,
      {
        test: /\.(mp3|jpg|png)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BFF_ADDRESS: JSON.stringify(process.env.BFF_ADDRESS),
    }),
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
  ],
};
