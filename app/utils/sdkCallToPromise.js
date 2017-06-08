/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

export default function sdkCallToPromise(targetFn, argsObject, sourceModule) {
  return new Promise((resolve, reject) => {
    targetFn(argsObject, (error, topic, response) => {
      console.log(`[${sourceModule}] CxEngage.subscribe()`, topic, response);
      if (error || response.error) {
        reject(error || response);
      } else {
        resolve(response);
      }
    });
  });
}
