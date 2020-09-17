import { browserInfo } from 'serenova-js-utils/browser';

export function sdkResponseLog(component, topic, response) {
  let newResponse = response;
  const { OSName, browserName, fullVersion } = browserInfo();
  if (
    (window.ADconf !== undefined && window.ADconf.env === 'prod')
  ) {
    newResponse = JSON.stringify(response);
  }
  console.log(browserName, fullVersion, OSName, component, topic, newResponse);
}
