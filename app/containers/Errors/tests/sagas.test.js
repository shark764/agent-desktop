import Raven from 'raven-js';

import {
  goHandleSDKError,
  topicActions,
} from 'containers/Errors/sagas';

jest.mock('raven-js', () => ({
  captureException: jest.fn(),
}));

describe('handleError Saga', () => {
  let generator;
  const mockAction = {
    error: {
      code: 'mockErrorCode',
    },
    topic: 'mockErrorTopic',
  };
  beforeEach(() => {
    Raven.captureException.mockClear();
    generator = goHandleSDKError(mockAction);
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
        mockAction.topic = actionTopic;
        generator = goHandleSDKError(mockAction);
      });
      it(`should dispatch action ${topicActions[actionTopic].type}`, () => {
        expect(generator.next()).toMatchSnapshot();
      });
    });
  });

  describe('if error.level is "fatal"', () => {
    beforeEach(() => {
      mockAction.error = {
        level: 'fatal',
      };
      generator = goHandleSDKError(mockAction);
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
