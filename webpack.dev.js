const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  
  devtool: 'inline-source-map',

  plugins: [
    new CopyWebpackPlugin([
      { from: 'map', to: 'map'},
      { from: 'images', to: 'images'},
    ], {})
  ],
  
  devServer: {
    port: 8080,
    // hot: true,
    open: false,
    contentBase: 'dist',
    watchOptions: {
      ignored: ['assets', 'node_modules', 'dist', 'build']
    }
  }
});
