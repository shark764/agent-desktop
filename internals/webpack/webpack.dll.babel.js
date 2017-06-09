/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const { join } = require('path');
const pullAll = require('lodash/pullAll');
const uniq = require('lodash/uniq');
const webpack = require('webpack');
const pkg = require(join(process.cwd(), 'package.json'));

if (!pkg.dllPlugin) { process.exit(0); }

const dllConfig = pkg.dllPlugin;
const outputPath = join(process.cwd(), dllConfig.path);

const entry = function (pkg) {
  const dependencyNames = Object.keys(pkg.dependencies);
  const exclude = pkg.dllPlugin.exclude;
  const include = pkg.dllPlugin.include;
  const includeDependencies = uniq(dependencyNames.concat(include));

  return {
    [pkg.dllPlugin.name]: pullAll(includeDependencies, exclude),
  };
};

module.exports = require('./webpack.base.babel')({
  context: process.cwd(),
  entry: entry(pkg),
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({ name: '[name]', path: join(outputPath, '[name].json') }), // eslint-disable-line no-new
  ],
  // mock fs
  node: {
    fs: 'empty',
  },
  resolve: {
    modules: ['node_modules'],
  }
});
