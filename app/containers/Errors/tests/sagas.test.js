/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  goHandleSDKError,
  goSetLoginErrorAndReload,
} from 'containers/Errors/sagas';

describe('handleError Saga', () => {
  let generator;
  let mockAction;
  beforeAll(() => {
    global.console = { warn: jest.fn() };
  });
  beforeEach(() => {
    mockAction = {
      error: {
        code: 'mockErrorCode',
      },
      topic: 'mockErrorTopic',
    };
    generator = goHandleSDKError(mockAction);
  });
  describe('fatal level errors', () => {
    beforeEach(() => {
      mockAction.error.level = 'fatal';
    });
    it('should call setCriticalError', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('error level errors', () => {
    beforeEach(() => {
      mockAction.error.level = 'error';
    });
    it('should call setNonCriticalError', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('other level errors', () => {
    beforeEach(() => {
      mockAction.error.level = 'warning';
    });
    it('are ignored', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
});

describe('setLoginErrorAndReload Saga', () => {
  let generator;
  let output;
  beforeAll(() => {
    global.CxEngage = {
      authentication: {
        logout: 'mockLogoutFunction',
      },
      subscribe: 'mockSubscribeFunction',
    };
    global.window.onbeforeunload = 'mockHandler';
    global.window.localStorage = {
      setItem: jest.fn(),
    };
    const mockAction = {
      errorType: 'mockErrorType',
    };
    generator = goSetLoginErrorAndReload(mockAction);
    output = generator.next();
  });

  it('should set window.onbeforeunload to null', () => {
    expect(global.window.onbeforeunload).toEqual(null);
  });
  it('should call localStorage.setItem with "ADError" and errorType', () => {
    expect(global.window.localStorage.setItem.mock.calls[0]).toMatchSnapshot();
  });
  it('should call SDK logout function', () => {
    expect(output).toMatchSnapshot();
  });
  it('should call SDK subscribe function with session topic', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('should call CxEngage logout', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});
