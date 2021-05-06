const { exec } = require('child_process');
const { node, npm } = require('../../package.json').engines;

const parseVersion = (versionText) =>
  versionText
    .split('.')
    .map((text) => text.replace(/\D/g, ''))
    .map((version) => parseInt(version, 0));

const fancyLog = (program, packageVersion, localVersion) =>
  console.log(
    '\x1b[33m%s\x1b[0m',
    `\nAgent Desktop \nYou need ${program} version approximately equivalent to ${packageVersion}, you have ${localVersion}`
  );

const compareVersionNumbers = (localVersion, packageVersion, onFail) => {
  const [localMajor, localMinor] = localVersion;
  const [packageMajor, packageMinor] = packageVersion;

  if (
    localMajor < packageMajor ||
    localMajor <= 0 ||
    localMinor < packageMinor
  ) {
    onFail();
    console.log(
      'Use nvm to easily switch between node versions: https://github.com/creationix/nvm \nRead nvm doc to find out how you can get nvm to switch version automatically. \nhttps://github.com/creationix/nvm#nvmrc\n'
    );
    process.exit(1);
  }
};

exec('node -v', (err, stdout) => {
  const localNodeVersion = parseVersion(stdout);
  const packageNodeVersion = parseVersion(node);

  compareVersionNumbers(localNodeVersion, packageNodeVersion, () =>
    fancyLog('NodeJS', node, stdout)
  );
});

exec('npm -v', (err, stdout) => {
  const localNpmVersion = parseVersion(stdout);
  const packageNpmVersion = parseVersion(npm);

  compareVersionNumbers(localNpmVersion, packageNpmVersion, () =>
    fancyLog('NPM', npm, stdout)
  );
});
