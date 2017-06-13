/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import Raven from 'raven-js';

import {
  goHandleSDKError,
  logSentryErrorAndSetError,
  goSetLoginErrorAndReload,
  topicActions,
} from 'containers/Errors/sagas';

jest.mock('raven-js', () => ({
  captureException: jest.fn(),
  isSetup: () => true,
}));

describe('handleError Saga', () => {
  let generator;
  let mockAction;
  beforeEach(() => {
    mockAction = {
      error: {
        code: 'mockErrorCode',
      },
      topic: 'mockErrorTopic',
    };
    generator = goHandleSDKError(mockAction);
  });
  it('should call logSentryErrorAndSetError by default', () => {
    expect(generator.next()).toMatchSnapshot();
  });
});

describe('logSentryErrorAndSetError saga', () => {
  let generator;
  let mockError;
  let mockTopic;
  beforeAll(() => {
    global.console = { warn: jest.fn() };
  });
  beforeEach(() => {
    mockError = {
      code: 'mockErrorCode',
    };
    mockTopic = 'mockErrorTopic';
    Raven.captureException.mockClear();
    generator = logSentryErrorAndSetError(mockTopic, mockError);
    generator.next();
  });

  it('should call Raven.captureException', () => {
    expect(Raven.captureException.mock.calls.length).toBe(1);
  });
  it('should call Raven.captureException with a new Error created from the action.topic', () => {
    const result = Raven.captureException.mock.calls[0][0];
    delete result.stack; // don't want to mess with Error and don't want diff snapshots everytime
    expect(result).toMatchSnapshot();
  });
  it('should call Raven.captureException with the SDK error in the extra info and error.code in the tags', () => {
    expect(Raven.captureException.mock.calls[0][1]).toMatchSnapshot();
  });

  Object.keys(topicActions).forEach((actionTopic) => {
    describe(`if topic is ${actionTopic}`, () => {
      beforeEach(() => {
        mockTopic = actionTopic;
        generator = logSentryErrorAndSetError(mockTopic, mockError);
      });
      it(`should dispatch action ${topicActions[actionTopic].type}`, () => {
        expect(generator.next()).toMatchSnapshot();
      });
    });
  });

  describe('if error.level is "fatal"', () => {
    beforeEach(() => {
      mockError.level = 'fatal';
      Raven.captureException.mockClear();
      generator = logSentryErrorAndSetError(mockTopic, mockError);
    });
    it('should dispatch action setCriticalError', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call Raven.captureException with level fatal', () => {
      generator.next();
      const result = Raven.captureException.mock.calls[0][1];
      expect(result.level).toBe('fatal');
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
