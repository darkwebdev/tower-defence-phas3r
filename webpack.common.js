const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WatchIgnorePlugin } = require('webpack');

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
        phaser: {
          test: /node_modules\/phaser/,
          name: 'phaser',
          chunks: 'all',
          reuseExistingChunk: true
        },
        react: {
          test: /node_modules\/react/,
          name: 'react',
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    }
  },

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.json', '.less' ]
  },

  module: {
    rules: [
      { test: /\.less$/, use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.tsx?$/,
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
    new WatchIgnorePlugin([
      /\.js$/,
      /\.d\.ts$/
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['phaser', 'react', 'main'],
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
