const https = require('https');

const currentVersion = require(`../../node_modules/serenova-js-utils/package.json`)
  .dependencies['libphonenumber-js'];

https.get(
  'https://raw.githubusercontent.com/catamphetamine/libphonenumber-js/master/package.json',
  (res) => {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (data) => (body += data));
    res.on('end', () => {
      const { version } = JSON.parse(body);
      if (currentVersion !== version) {
        console.warn(
          '\x1b[33m%s\x1b[0m',
          `


      Phone Number Library Version | Current: ${currentVersion} - Latests: ${version}
      
      ##          UPDATE PHONE LIB VERSION BEFORE COMMIT          ##


      `
        );
        process.exit(1);
      }
    });
  }
);
