/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  DEEPLINK_QUERY_PARAMS,
  DEEPLINK_USERNAME_TENANTID_IDP,
  DEEPLINK_USERNAME_TENANTID,
  DEEPLINK_USERNAME_IDP,
  DEEPLINK_TENANTID_IDP,
  DEEPLINK_TENANTID,
} from '../containers/Login/constants';

const toolbar = window.location.href.indexOf('desktop') === -1;
const beta = window.location.href.indexOf('beta') !== -1;
const alpha = window.location.href.indexOf('alpha') !== -1;

export function isToolbar() {
  return toolbar;
}

export function isDesktop() {
  return !toolbar;
}

export function isBeta() {
  return beta;
}

export function isAlpha() {
  return alpha;
}

/*
 * urlParamsToObj
 *
 * Returns a object with the parsed current url queryParams
 *
 */
export function urlParamsToObj() {
  const queryParamsObj = {};
  const queryParamsArr = window.location.search.substr(1).split(/[&#]+/);
  queryParamsArr.forEach((queryParamsItem) => {
    if (queryParamsItem !== '') {
      const splitQueryParams = queryParamsItem.toLowerCase().split('=');
      queryParamsObj[splitQueryParams[0]] = splitQueryParams[1] || 1;
    }
  });
  return queryParamsObj;
}

/*
 * removeDeepLinkParams
 *
 * Removes query params used for deep linking
 *
 */
export function removeDeepLinkParams() {
  const queryParamsArr = window.location.search.substr(1).split('&');
  // remove any key/val pairs in the queryParams where the key is
  // designated as a deep link query parameter
  const updatedQueryParams = queryParamsArr
    .filter((queryParamsItem) => {
      const splitQueryParams =
        queryParamsItem && queryParamsItem.toLowerCase().split('=');
      return DEEPLINK_QUERY_PARAMS.indexOf(splitQueryParams[0]) === -1;
    })
    .join('&');

  // update the URL in the address bar, making sure to keep
  // the hash in place if there is one
  window.history.pushState(
    '',
    document.title,
    `${window.location.pathname}?${updatedQueryParams}${window.location.hash}`
  );
}

/*
 * getDeepLinkLogin
 *
 * Returns the constant variable name that tells the Login screen how
 * to handle the deep link login
 *
 */
export function getDeepLinkLogin() {
  const idpDeeplinkQueryParams = urlParamsToObj();

  // Let's start by checking if there is a username...
  // #'s in comments pertain to query param permutations
  // deep link table in spec doc
  if (idpDeeplinkQueryParams.username) {
    if (idpDeeplinkQueryParams.tenantid || idpDeeplinkQueryParams.idp) {
      if (idpDeeplinkQueryParams.tenantid && idpDeeplinkQueryParams.idp) {
        // if there is username AND tenantid AND idp | #4
        return DEEPLINK_USERNAME_TENANTID_IDP;
      } else if (idpDeeplinkQueryParams.tenantid) {
        // if there is username AND tenantid | #3
        return DEEPLINK_USERNAME_TENANTID;
      } else {
        // if there is username AND idp | #2 (same behavior as #1)
        return DEEPLINK_USERNAME_IDP;
      }
    } else {
      // if there is ONLY a username | #1 (same behavior as #2)
      return DEEPLINK_USERNAME_IDP;
    }
    // ...OK, no username, so let's see about tenantid
  } else if (idpDeeplinkQueryParams.tenantid) {
    if (idpDeeplinkQueryParams.idp) {
      // there is tenantid AND idp | #6 (same as #4)
      return DEEPLINK_TENANTID_IDP;
    } else {
      // there is ONLY tenantid | #5
      return DEEPLINK_TENANTID;
    }
  }

  return null;
}
