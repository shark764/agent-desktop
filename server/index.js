/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/* eslint consistent-return:0 */

const express = require('express');

const argv = require('minimist')(process.argv.slice(2));
const { resolve } = require('path');
const logger = require('./logger');
const setup = require('./middlewares/frontendMiddleware');
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port);
});
