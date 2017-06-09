/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

const chalk = require('chalk');

/**
 * Adds mark check symbol
 */
function addCheckMark(callback) {
  process.stdout.write(chalk.green(' ✓'));
  if (callback) callback();
}

module.exports = addCheckMark;
