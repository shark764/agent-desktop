const currentVersion = require(`../../node_modules/serenova-js-utils/package.json`)
  .dependencies['libphonenumber-js'];
const { exec } = require('child_process');

exec('npm view libphonenumber-js version', (error, version, stderr) => {
  if (currentVersion !== `^${version}` && currentVersion !== version) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `


    Phone Number Library Version | Current: ${currentVersion} - Latest: ${version}
    
    ##          UPDATE PHONE LIB VERSION BEFORE COMMIT          ##


    `
    );
  }
  if (stderr) {
    console.error(stderr);
  }
  if (error) {
    console.error(error);
  }
});
