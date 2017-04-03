export default function sdkCallToPromise(targetFn, argsObject, sourceModule) {
  return new Promise((resolve, reject) => {
    targetFn(argsObject, (error, topic, response) => {
      console.log(`[${sourceModule}] SDK.subscribe()`, topic, response);
      if (error || response.error) {
        reject(error || response);
      } else {
        resolve(response);
      }
    });
  });
}
