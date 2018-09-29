const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  
  devtool: 'inline-source-map',

  // externals: {
  //   phaser: 'Phaser'
  // },
  
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
