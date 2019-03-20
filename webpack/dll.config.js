const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const dependencies = Object.keys(
  require('../package.json').dependencies
).filter(dep => dep !== 'react-polymorph' && dep !== 'node-sass');

module.exports = {
  mode: 'production',
  optimization: {
    // https://github.com/webpack/webpack/issues/7470
    nodeEnv: false,
    splitChunks: {
      chunks: 'all',
    },
  },
  context: process.cwd(),
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.less', '.css'],
    modules: [__dirname, 'node_modules']
  },

  entry: {
    vendor: dependencies
  },
  node: {
    fs: 'empty'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },

  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]',
      path: path.join(__dirname, '../dll/[name]-manifest.json')
    })
  ]
};
