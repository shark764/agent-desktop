import {
  loadHistoricalInteractionBody,
  loadContactInteractions,
  goNotReady,
  goDeleteContacts,
} from 'containers/AgentDesktop/sagas';

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

describe('goNotReady', () => {
  beforeEach(() => {
    global.SDK = {
      session: {
        goNotReady: 'goNotReady',
      },
    };
  });

  describe('when action.reason is undefined', () => {
    const mockGoNotReadyResponse = 'mockGoNotReadyResponse';
    const mockAction = {};
    const generator = goNotReady(mockAction);
    it('should call the promise util with the SDK goNotReady and the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should use the yielded SDK response to dispatch a setPresence action with the correct args', () => {
      expect(generator.next(mockGoNotReadyResponse));
    });
  });

  describe('when action.reason is defined', () => {
    const mockReasonListId = 'mockReasonListId';
    const mockGoNotReadyResponse = 'mockGoNotReadyResponse';
    const mockAction = {
      listId: 'mockReasonListId',
      reason: {
        name: 'mockReasonName',
        reasonId: 'mockReasonId',
      },
    };
    const generator = goNotReady(mockAction);
    it('should use the yielded id to call the promise util with the SDK goNotReady and the correct arguments', () => {
      expect(generator.next(mockReasonListId)).toMatchSnapshot();
    });
    it('should use the yielded SDK response to dispatch a setPresence action with the correct args', () => {
      expect(generator.next(mockGoNotReadyResponse));
    });
  });
});

describe('goDeleteContacts', () => {
  let generator;
  beforeEach(() => {
    global.SDK = {
      contacts: {
        delete: 'deleteContacts',
      },
    };
  });

  describe('when action.reasonIds is an array of Ids', () => {
    beforeEach(() => {
      const mockAction = {
        contactIds: ['reasonId1', 'reasonId2'],
      };
      generator = goDeleteContacts(mockAction);
    });
    it('should call the promise util with the SDK goDeleteContacts and the correct arguments', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    describe('when API responds with true bools', () => {
      const mockDeleteResponses = [true, true];
      it('should use the yielded SDK responses to dispatch a removeContact action for each contactId', () => {
        generator.next();
        expect(generator.next(mockDeleteResponses)).toMatchSnapshot();
      });
    });
    describe('when API responds with a false bool for contactId1 and a true bool for 2', () => {
      const mockDeleteResponses = [false, true];
      it('should only dispatch a removeContact action contactId2', () => {
        generator.next();
        expect(generator.next(mockDeleteResponses)).toMatchSnapshot();
      });
    });
    it('should dispatch a clearSearchResults action after deletion is complete', () => {
      generator.next();
      generator.next([]);
      expect(generator.next()).toMatchSnapshot();
    });
  });
});
