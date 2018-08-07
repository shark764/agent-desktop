/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import {
  urlParamsToObj,
  removeDeepLinkParams,
  getDeepLinkLogin,
} from 'utils/url';

describe('urlParamsToObj', () => {
  beforeEach(() => {
    global.jsdom.reconfigure({
      url:
        'http://localhost:3000/?desktop&username=test@test.com&tenantId=83e35671-5580-4e95-9304-00aac61a303c&idp=72c794b5-990b-443b-99f5-248122056a22#sso',
    });
  });

  it('returns an object with 3 properties: username, tenantId, and idpId', () => {
    const urlParamsObj = urlParamsToObj();
    expect(urlParamsObj).toHaveProperty('username');
    expect(urlParamsObj).toHaveProperty('tenantid');
    expect(urlParamsObj).toHaveProperty('idp');
  });

  it('has the correct values for the 3 properties in the URL params', () => {
    const urlParamsObj = urlParamsToObj();
    expect(urlParamsObj.username).toBe('test@test.com');
    expect(urlParamsObj.tenantid).toBe('83e35671-5580-4e95-9304-00aac61a303c');
    expect(urlParamsObj.idp).toBe('72c794b5-990b-443b-99f5-248122056a22');
  });
});

describe('removeDeepLinkParams', () => {
  it('calls window.history.pushState()', () => {
    window.history.pushState = jest.fn();
    removeDeepLinkParams();
    expect(window.history.pushState).toHaveBeenCalled();
  });
});

describe('getDeepLinkLogin', () => {
  it('returns the correct constant value depending on the URL query params', () => {
    global.jsdom.reconfigure({
      url:
        'http://localhost:3000/?desktop&username=test@test.com&tenantId=83e35671-5580-4e95-9304-00aac61a303c#sso',
    });
    expect(getDeepLinkLogin()).toBe('DEEPLINK_USERNAME_TENANTID');

    global.jsdom.reconfigure({
      url: 'http://localhost:3000/?desktop&username=test@test.com',
    });
    expect(getDeepLinkLogin()).toBe('DEEPLINK_USERNAME_IDP');

    global.jsdom.reconfigure({
      url: 'http://localhost:3000/?desktop',
    });
    expect(getDeepLinkLogin()).toBeNull();
  });
});
