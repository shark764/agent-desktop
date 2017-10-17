/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
  * urlHash
  *
  * Returns a object with the parsed current url hash
  *
  */

export function urlHash() {
  const hashObj = {};
  const hashArr = window.location.hash.substr(1).split('&');
  hashArr.forEach((hashItem) => {
    if (hashItem !== '') {
      const splitHash = hashItem.split('=');
      hashObj[splitHash[0]] = splitHash[1];
    }
  });
  return hashObj;
}

/*
  * clearUrlHash
  */

export function clearUrlHash() {
  window.history.pushState('', document.title, window.location.pathname);
}
