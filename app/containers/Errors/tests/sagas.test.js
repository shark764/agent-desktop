/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { goHandleSDKError } from 'containers/Errors/sagas';

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
  describe('session fatal level errors', () => {
    beforeEach(() => {
      mockAction.error.level = 'session-fatal';
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
  describe('interaction fatal level errors', () => {
    beforeEach(() => {
      mockAction.error.level = 'interaction-fatal';
      mockAction.error.data = { interactionId: 'mock-interaction-id' };
    });
    it('should call removeInteractionHard', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
  describe('outbound voice interaction fails to connect', () => {
    beforeEach(() => {
      mockAction.error.level = 'error';
      mockAction.topic = 'cxengage/interactions/voice/dial-send-acknowledged';
    });
    it('should select the failed voice interaction and remove it', () => {
      expect(generator.next()).toMatchSnapshot();
      expect(
        generator.next({ interactionId: 'test-interaction-id' })
      ).toMatchSnapshot();
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
