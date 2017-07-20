/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS, List } from 'immutable';
import { goHandleSDKError } from 'containers/Errors/sagas';

describe('handleError Saga', () => {
  let generator;
  let mockAction;
  beforeAll(() => {
    global.console.warn = jest.fn();
    mockAction = {
      error: {
        code: 'mockErrorCode',
      },
      topic: 'mockErrorTopic',
    };
  });
  beforeEach(() => {
    mockAction = {
      error: {
        code: 'mockErrorCode',
      },
      topic: 'mockErrorTopic',
    };
  });
  describe('session fatal level errors', () => {
    beforeAll(() => {
      mockAction.error.level = 'session-fatal';
      generator = goHandleSDKError(mockAction);
    });
    it('should call setCriticalError', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('error level errors', () => {
    beforeAll(() => {
      mockAction.error.level = 'error';
      generator = goHandleSDKError(mockAction);
    });
    it('should call setNonCriticalError', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('interaction fatal level errors and interaction is there', () => {
    beforeAll(() => {
      mockAction.error.level = 'interaction-fatal';
      mockAction.error.data = { interactionId: 'mock-interaction-id' };
      generator = goHandleSDKError(mockAction);
    });
    it('should call select the interactions list to see if we have the interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call removeInteractionHard', () => {
      expect(
        generator.next(fromJS([{ interactionId: 'mock-interaction-id' }]))
      ).toMatchSnapshot();
    });
    it('should set a non critical error with interactionFatal flag', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('interaction fatal level errors and interaction is not there', () => {
    beforeAll(() => {
      mockAction.error.level = 'interaction-fatal';
      mockAction.error.data = { interactionId: 'mock-interaction-id' };
      generator = goHandleSDKError(mockAction);
    });
    it('should call select the interactions list to see if we have the interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next(new List())).toMatchSnapshot();
    });
  });
  describe('outbound voice interaction fails to connect', () => {
    beforeAll(() => {
      mockAction.error.level = 'error';
      mockAction.topic = 'cxengage/interactions/voice/dial-send-acknowledged';
      generator = goHandleSDKError(mockAction);
    });
    it('should select the failed voice interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should remove failed voice interaction', () => {
      expect(
        generator.next({ interactionId: 'test-interaction-id' })
      ).toMatchSnapshot();
    });
    it('should setNonCriticalError', () => {
      expect(
        generator.next({ interactionId: 'test-interaction-id' })
      ).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('outbound sms interaction fails to connect', () => {
    beforeAll(() => {
      mockAction.error.level = 'error';
      mockAction.topic =
        'cxengage/interactions/messaging/initialize-outbound-sms-response';
      generator = goHandleSDKError(mockAction);
    });
    it('should select the failed sms interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should remove failed sms interaction', () => {
      expect(
        generator.next({ interactionId: 'test-interaction-id' })
      ).toMatchSnapshot();
    });
    it('should setNonCriticalError', () => {
      expect(
        generator.next({ interactionId: 'test-interaction-id' })
      ).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('outbound email interaction fails to connect', () => {
    beforeAll(() => {
      mockAction.error.level = 'error';
      mockAction.topic =
        'cxengage/errors/error/failed-to-create-outbound-email-interaction';
      generator = goHandleSDKError(mockAction);
    });
    it('should try to remove nonexisting interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call setNonCriticalError with the fatal flag', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('other level errors', () => {
    beforeAll(() => {
      mockAction.error.level = 'warning';
      generator = goHandleSDKError(mockAction);
    });
    it('are ignored', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
});
