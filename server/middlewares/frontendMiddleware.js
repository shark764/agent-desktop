/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/* eslint-disable global-require */
const express = require('express');
const path = require('path');
const compression = require('compression');

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(outputPath, 'index.html'))
  );
};

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  addProdMiddlewares(app, options);
  return app;
};
