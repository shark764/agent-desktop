import { browserInfo } from 'serenova-js-utils/browser';
import { isAlpha } from './url';

export function sdkResponseLog(component, topic, response) {
  let newResponse = response;
  const { OSName, browserName, fullVersion } = browserInfo();
  if (
    (window.ADconf !== undefined && window.ADconf.env === 'prod') ||
    isAlpha()
  ) {
    newResponse = JSON.stringify(response);
  }
  console.log(browserName, fullVersion, OSName, component, topic, newResponse);
}
