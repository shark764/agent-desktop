/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: [/node_modules/, /cxengagesdk/],
      query: options.babelQuery,
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader',
    }, {
      test: /\.(eot|svg)$/,
      loader: 'file-loader',
    },
    {
      test: /\.[ot]tf$/,
      loader: 'url-loader',
      query: {
        limit: 50000,
        mimetype: 'application/opentype',
        name: './fonts/[hash].[ext]',
      },
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: ['file-loader?context=src/images&name=images/[path][name].[ext]', {
        loader: 'image-webpack-loader',
        query: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 4,
          },
          pngquant: {
            quality: '75-90',
            speed: 3,
          },
        },
      }],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports?self.fetch!whatwg-fetch',
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.NamedModulesPlugin(),
  ]),
  resolve: {
    alias: {
      'moment$': 'moment/moment',
    },
    modules: (options.resolve && options.resolve.modules) || ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});
