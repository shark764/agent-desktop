/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

const { exec } = require('child_process');
const { node, npm } = require('../../package.json').engines;

const PACKAGE_NODE_VERSION = node.trim();
const PACKAGE_NPM_VERSION = npm.trim();

exec('node -v', function checkVersion(err, stdout) {
  if (err) {
    throw err;
  }

  const NODE_VERSION = stdout.trim().replace('v', '');

  let hasError = false;

  if (
    (PACKAGE_NODE_VERSION.includes('~') ||
      PACKAGE_NODE_VERSION.includes('^')) &&
    PACKAGE_NODE_VERSION.replace('~', '').replace('^', '') < NODE_VERSION
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need Node version approximately equivalent to ${node}, you have version ${stdout}`
    );
    hasError = true;
  } else if (
    PACKAGE_NODE_VERSION.includes('>=') &&
    NODE_VERSION < PACKAGE_NODE_VERSION.replace('>=', '')
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need Node version that match the condition ${node}, you have version ${stdout}`
    );
    hasError = true;
  } else if (
    !PACKAGE_NODE_VERSION.includes('>=') &&
    PACKAGE_NODE_VERSION.includes('>') &&
    NODE_VERSION <= PACKAGE_NODE_VERSION.replace('>', '')
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need Node version that match the condition ${node}, you have version ${stdout}`
    );
    hasError = true;
  } else if (
    /^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(PACKAGE_NODE_VERSION) &&
    stdout !== `v${node}\n` &&
    stdout !== `v${node}\r\n`
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need Node version ${node}, you have version ${stdout}`
    );
    hasError = true;
  }

  if (hasError) {
    console.log(
      'Use nvm to easily switch between node versions: https://github.com/creationix/nvm \nRead nvm doc to find out how you can get nvm to switch version automatically. \nhttps://github.com/creationix/nvm#nvmrc\n'
    );
    process.exit(1);
  }
});

exec('npm -v', function checkVersion(err, stdout) {
  if (err) {
    throw err;
  }

  const NPM_VERSION = stdout.trim().replace('v', '');

  if (
    (PACKAGE_NPM_VERSION.includes('~') || PACKAGE_NPM_VERSION.includes('^')) &&
    PACKAGE_NPM_VERSION.replace('~', '').replace('^', '') < NPM_VERSION
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need NPM version approximately equivalent to ${npm}, you have version ${stdout}`
    );
    process.exit(1);
  } else if (
    PACKAGE_NPM_VERSION.includes('>=') &&
    NPM_VERSION < PACKAGE_NPM_VERSION.replace('>=', '')
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need NPM version that match the condition ${npm}, you have version ${stdout}`
    );
    process.exit(1);
  } else if (
    !PACKAGE_NPM_VERSION.includes('>=') &&
    PACKAGE_NPM_VERSION.includes('>') &&
    NPM_VERSION <= PACKAGE_NPM_VERSION.replace('>', '')
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need NPM version that match the condition ${npm}, you have version ${stdout}`
    );
    process.exit(1);
  } else if (
    /^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(PACKAGE_NPM_VERSION) &&
    stdout !== `${npm}\n`
  ) {
    console.log(
      '\x1b[33m%s\x1b[0m',
      `\nAgent Desktop \nYou need npm version ${npm}, you have ${stdout}`
    );
  }
});
