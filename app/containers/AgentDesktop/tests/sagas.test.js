import { loadHistoricalInteractionBody, loadContactInteractions } from 'containers/AgentDesktop/sagas';

describe('loadHistoricalInteractionBody Saga', () => {
  describe('if bodyType is recordings', () => {
    const mockAction = {
      bodyType: 'recordings',
      interactionId: 'mockId',
    };
    const generator = loadHistoricalInteractionBody(mockAction);
    const mockGetRecordings = 'mockGetRecordingsFunction';
    const mockRecordings = [{
      url: 'mockRecordingUrl',
    }];
    beforeEach(() => {
      global.SDK = {
        interactions: {
          voice: {
            getRecordings: mockGetRecordings,
          },
        },
      };
    });
    it('should call the promise util with the SDK getRecordings function with the correct args', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch an updateContactHistoryInteractionDetails action with the correct args', () => {
      expect(generator.next(mockRecordings)).toMatchSnapshot();
    });
  });
  describe('if bodyType is transcript', () => {
    const mockAction = {
      bodyType: 'transcript',
      interactionId: 'mockId',
    };
    const generator = loadHistoricalInteractionBody(mockAction);
    const mockGetTranscripts = 'mockGetTranscriptsFunction';
    const mockGetTranscriptsResponse = [{
      url: 'mockTranscriptUrl',
    }];
    const mockTranscriptUrlResponse = {
      data: 'mockTranscript',
    };
    beforeEach(() => {
      global.SDK = {
        interactions: {
          messaging: {
            getTranscripts: mockGetTranscripts,
          },
        },
      };
    });
    it('should call the promise util with the SDK getTranscripts function with the correct args', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call axios get with the 1st returned transcript url', () => {
      expect(generator.next(mockGetTranscriptsResponse)).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch an updateContactHistoryInteractionDetails action with the correct args', () => {
      expect(generator.next(mockTranscriptUrlResponse)).toMatchSnapshot();
    });
  });
});

describe('loadContactInteractions', () => {
  const mockInteractionHistory = 'mockInteractionHistoryDetails';

  beforeEach(() => {
    global.SDK = {
      reporting: {
        getContactHistory: 'getContactHistory',
      },
    };
  });

  describe('when action.page is undefined', () => {
    const mockAction = {
      contactId: 'mockContactId',
    };
    const generator = loadContactInteractions(mockAction);
    it('should call the promise util with the SDK getContactHistory with the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch a setContactInteractionHistory action with the correct args', () => {
      expect(generator.next(mockInteractionHistory));
    });
  });

  describe('when action.page is defined', () => {
    const mockAction = {
      contactId: 'mockContactId',
      page: 1,
    };
    const generator = loadContactInteractions(mockAction);
    it('should call the promise util with the SDK getContactHistory with the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch a setContactInteractionHistory action with the correct args', () => {
      expect(generator.next(mockInteractionHistory));
    });
  });
});
