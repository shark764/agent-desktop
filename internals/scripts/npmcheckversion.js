/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

const exec = require('child_process').exec;
const { node, npm } = require('../../package.json').engines;

exec('node -v', function(err, stdout, stderr) {
  if (err) throw err;
  if (stdout !== `v${node}\n`) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need Node version ${node}, you have version ${stdout}`
    );
    console.log(
      'Use nvm to easily switch between node versions: https://github.com/creationix/nvm \nRead nvm doc to find out how you can get nvm to switch version automatically. \nhttps://github.com/creationix/nvm#nvmrc\n`'
    );
    process.exit(1);
  }
});

exec('npm -v', function(err, stdout, stderr) {
  if (err) throw err;
  if (stdout !== `${npm}\n`) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need npm version ${npm}, you have ${stdout}`
    );
    process.exit(1);
  }
});
