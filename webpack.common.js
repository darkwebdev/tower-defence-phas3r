const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules\/phaser/,
          name: 'phaser',
          chunks: 'all'

        }
      }
    }
  },

  resolve: {
    extensions: [ '.ts', '.js', '.json' ]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          experimentalFileCaching: true,
          transpileOnly: true
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  
  plugins: [
    new webpack.WatchIgnorePlugin([
      /\.js$/,
      /\.d\.ts$/
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['phaser', 'main'],
      // chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    })
  ]
};
