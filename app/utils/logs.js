import { isAlpha } from './url';

export function sdkResponseLog(component, topic, response) {
  let newResponse = response;
  if (
    (window.ADconf !== undefined && window.ADconf.env === 'prod') ||
    isAlpha()
  ) {
    newResponse = JSON.stringify(response);
  }
  console.log(
    navigator.appCodeName,
    navigator.appVersion,
    component,
    topic,
    newResponse
  );
}
