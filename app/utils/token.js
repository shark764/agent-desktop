/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import moment from 'moment';

// Check if the current time is later than the expiration time
// minus "hoursBeforeExpiration" hours, since this ensures that you will never be
// booted off while in "Ready" mode due to an expired
// token during a typical work day
export default function expireToken (token, hoursBeforeExpiration, isSso, debugTokenVal) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const expirationObj = JSON.parse(window.atob(base64));
  const expirationTime = expirationObj.exp * 1000;

  // the values we'll need for the upcoming comparison
  const currentTime = Number(moment().format('x'));
  let expirationTimeMinusBuffer;
  expirationTimeMinusBuffer = moment(expirationTime)
    .subtract(hoursBeforeExpiration, 'hours')
    .format('x');

  // for debuging token expiration behavior...
  if (
    debugTokenVal &&
    typeof Number(debugTokenVal) === 'number'
  ) {
    // since we are not able to change the token expiration for sso, then just
    // force the token to expire in 30 seconds (86370 seconds
    // is an assumed 9 hours minus 30 seconds)
    if (isSso) {
      expirationTimeMinusBuffer = moment(expirationTime)
        .subtract(86370, 'seconds')
        .format('x');
    } else {
      // if we're debugging a CxEngage token, then just expire in 50% of the
      // fake token expiration time
      const debugExpirationThreshold =
        Number(debugTokenVal) / 2;
      expirationTimeMinusBuffer = moment(expirationTime)
        .subtract(debugExpirationThreshold, 'seconds')
        .format('x');
    }
  }

  return currentTime >= expirationTimeMinusBuffer;
}
