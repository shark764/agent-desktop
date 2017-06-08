/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

const exec = require('child_process').exec;
exec('npm -v', function (err, stdout, stderr) {
  if (err) throw err;
  if (parseFloat(stdout) < 3) {
    throw new Error('[ERROR: Agent Desktop] You need npm version @>=3');
    process.exit(1);
  }
});
