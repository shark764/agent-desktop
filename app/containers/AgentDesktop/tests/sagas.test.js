/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import {
  loadHistoricalInteractionBody,
  loadContactInteractions,
  goNotReady,
  goDeleteContacts,
  goAssignContact,
  goAcceptWork,
  callTransferListsFromFlowAndUpdateState,
  changeInteractionTransferListVisibleState,
  updateVisibleStateofAllFlowTransferLists,
} from 'containers/AgentDesktop/sagas';
jest.mock('utils/uuid', () => ({
  generateUUID: jest.fn(() => 'mock-uuid'),
}));

describe('loadHistoricalInteractionBody Saga', () => {
  describe('if bodyType is recordings', () => {
    const mockAction = {
      bodyType: 'recordings',
      interactionId: 'mockId',
    };
    const generator = loadHistoricalInteractionBody(mockAction);
    const mockGetRecordings = 'mockGetRecordingsFunction';
    const mockRecordings = [
      {
        url: 'mockRecordingUrl',
      },
    ];
    beforeEach(() => {
      global.CxEngage = {
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
    const mockGetTranscriptsResponse = [
      {
        url: 'mockTranscriptUrl',
      },
    ];
    const mockTranscriptUrlResponse = {
      data: 'mockTranscript',
    };
    beforeEach(() => {
      global.CxEngage = {
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
  let mockInteractionHistory;
  let mockInteractionHistory2;
  let mockAction;
  let generator;

  beforeEach(() => {
    global.CxEngage = {
      reporting: {
        getContactInteractionHistory: 'getContactInteractionHistory',
      },
    };
    mockInteractionHistory = {
      results: [
        { startTimestamp: 'mockTimestamp1' },
        { startTimestamp: 'mockTimestamp2' },
        { startTimestamp: 'mockTimestamp3' },
      ],
      limit: 3,
      total: 10,
      page: 0,
    };
    mockInteractionHistory2 = { ...mockInteractionHistory, page: 3 };
    mockAction = {
      contactId: 'mockContactId',
    };
  });

  describe('when action.page is undefined', () => {
    describe('when total results are greater than returned results length', () => {
      it('should call the promise util with the SDK getContactHistory with the correct arguments', () => {
        generator = loadContactInteractions(mockAction);
        expect(generator.next()).toMatchSnapshot();
      });
      it('should call the promise util with SDK getContactHistory with the final page derived from limit and total', () => {
        expect(generator.next(mockInteractionHistory)).toMatchSnapshot();
      });
      it('should dispatch a setContactInteractionHistory action with results, results data and earliestTimestamp from the last result of the 2nd SDK call', () => {
        expect(generator.next(mockInteractionHistory2)).toMatchSnapshot();
      });
    });
    describe('when total results are equal to returned results length', () => {
      beforeEach(() => {
        mockInteractionHistory.total = 3;
      });
      it('should call the promise util with the SDK getContactHistory with the correct arguments', () => {
        generator = loadContactInteractions(mockAction);
        expect(generator.next()).toMatchSnapshot();
      });
      it('should dispatch a setContactInteractionHistory action with results, results data and earliestTimestamp from the last result of the SDK call', () => {
        expect(generator.next(mockInteractionHistory)).toMatchSnapshot();
      });
    });
  });

  describe('when action.page is defined', () => {
    beforeEach(() => {
      mockAction.page = 1;
    });
    it('should call the promise util with the SDK getContactHistory with the correct arguments', () => {
      generator = loadContactInteractions(mockAction);
      expect(generator.next()).toMatchSnapshot();
    });
    it('should use the yielded SDK results to dispatch a setContactInteractionHistory action with the correct args', () => {
      expect(generator.next(mockInteractionHistory));
    });
  });
});

describe('goNotReady', () => {
  beforeEach(() => {
    global.CxEngage = {
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
  const mockCheckedContacts = [{ id: 'reasonId1' }, { id: 'reasonId2' }];
  beforeEach(() => {
    global.CxEngage = {
      contacts: {
        delete: 'deleteContacts',
      },
    };
  });

  describe('when action.reasonIds is an array of Ids', () => {
    beforeEach(() => {
      generator = goDeleteContacts();
      generator.next();
      generator.next();
      generator.next();
    });
    it('should call the promise util with the SDK goDeleteContacts and the correct arguments', () => {
      expect(generator.next(mockCheckedContacts)).toMatchSnapshot();
    });
    describe('when API responds with true bools', () => {
      const mockDeleteResponses = [true, true];
      it('should use the yielded SDK responses to dispatch a removeContact action for each contactId', () => {
        generator.next(mockCheckedContacts);
        expect(generator.next(mockDeleteResponses)).toMatchSnapshot();
      });
    });
    describe('when API responds with a false bool for contactId1 and a true bool for 2', () => {
      const mockDeleteResponses = [false, true];
      it('should only dispatch a removeContact action contactId2', () => {
        generator.next(mockCheckedContacts);
        expect(generator.next(mockDeleteResponses)).toMatchSnapshot();
      });
    });
  });
});

describe('goAssignContact', () => {
  let generator;
  describe('target is noInteractionContactPanel', () => {
    beforeAll(() => {
      generator = goAssignContact({
        interactionId: undefined,
        contact: { id: 'mock-contact-id' },
      });
    });
    it('calls getInteraction with the interaction id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to true', () => {
      expect(generator.next({ interactionId: undefined })).toMatchSnapshot();
    });
    it('puts selectContact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls loadContactInteractions with the contact id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to false', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });

  describe('target is "creating-new-interaction" panel', () => {
    beforeAll(() => {
      generator = goAssignContact({
        interactionId: 'creating-new-interaction',
        contact: { id: 'mock-contact-id' },
      });
    });
    it('calls getInteraction with the interaction id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to true', () => {
      expect(
        generator.next({ interactionId: 'creating-new-interaction' })
      ).toMatchSnapshot();
    });
    it('puts newInteractionPanelSelectContact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts showSidePanel', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls loadContactInteractions with the contact id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to false', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });

  describe('target is non-UUID interaction (outbound)', () => {
    beforeAll(() => {
      generator = goAssignContact({
        interactionId: 'non-uuid',
        contact: { id: 'mock-contact-id' },
      });
    });
    it('calls getInteraction with the interaction id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to true', () => {
      expect(generator.next({ interactionId: 'non-uuid' })).toMatchSnapshot();
    });
    it('puts setAssignedContact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls loadContactInteractions with the contact id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to false', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });

  describe('target is script-only interaction', () => {
    beforeAll(() => {
      generator = goAssignContact({
        interactionId: '6a94e45e-5c37-11e7-907b-a6006ad3dba0',
        contact: { id: 'mock-contact-id' },
      });
    });
    it('calls getInteraction with the interaction id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to true', () => {
      expect(
        generator.next({
          interactionId: '6a94e45e-5c37-11e7-907b-a6006ad3dba0',
          status: 'script-only',
        })
      ).toMatchSnapshot();
    });
    it('puts setAssignedContact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls loadContactInteractions with the contact id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to false', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });

  describe('target is interaction with contactMode of search', () => {
    beforeAll(() => {
      generator = goAssignContact({
        interactionId: '6a94e45e-5c37-11e7-907b-a6006ad3dba0',
        contact: { id: 'mock-contact-id' },
      });
      global.CxEngage = {
        interactions: {
          unassignContact: 'unassignContact',
          assignContact: 'assignContact',
        },
      };
    });
    it('calls getInteraction with the interaction id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to true', () => {
      expect(
        generator.next({
          interactionId: '6a94e45e-5c37-11e7-907b-a6006ad3dba0',
          contact: { id: 'old-contact-id' },
          contactMode: 'search',
        })
      ).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.unassignContact to old contact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.assignContact to new contact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setAssignedContact', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts addContactNotification', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactMode to search', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls loadContactInteractions with the contact id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts setContactSaveLoading to false', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
});

describe('goAcceptWork', () => {
  let generator;
  beforeAll(() => {
    global.CxEngage = {
      entities: {
        getUser: 'getUser',
      },
    };
  });
  describe('if no active resources exist', () => {
    beforeAll(() => {
      generator = goAcceptWork({
        interactionId: 'interaction-id',
        response: {},
      });
    });
    it('selects current interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setInteractionStatus with work-accepted', () => {
      expect(
        generator.next({ interactionId: 'mockInteraction-Id' })
      ).toMatchSnapshot();
    });
    it('sets interaction transferLists loading state to true', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done after dispatching action', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('if active resources exist', () => {
    beforeAll(() => {
      generator = goAcceptWork({
        interactionId: 'interaction-id',
        response: {
          activeResources: [
            { id: 'resource-1', externalResource: true },
            { id: 'resource-2', externalResource: false },
          ],
        },
      });
    });
    it('selects current interaction', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setInteractionStatus with work-accepted', () => {
      expect(
        generator.next({ interactionId: 'mockInteraction-Id' })
      ).toMatchSnapshot();
    });
    it('sets interaction transferlists loading state to true', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setActiveResources', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should call getUser for each active resource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should set the resource name', () => {
      expect(
        generator.next([
          {
            result: {
              firstName: 'resource',
              lastName: '1',
              id: 'resource-1',
            },
          },
          {
            result: {
              email: 'resource2@serenova.com',
              id: 'resource-2',
            },
          },
        ])
      ).toMatchSnapshot();
    });
    it('should be done after calling getUser for each resource', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('callTransferListsFromFlowAndUpdateState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  const tenantTransferLists = {
    result: [
      {
        active: true,
        id: 'mockVocieTransferListId',
        name: 'mockVocieTransferLitName',
        endpoints: [
          { contactType: 'queue', hierarchy: 'mockHierarchy1' },
          { contactType: 'PSTN', hierarchy: 'mockHierarchy1' },
          { conctactType: 'SIP', hierarchy: 'mockHierarchy2' },
          { contactType: 'queue', hierarchy: 'mockHierarchy2' },
        ],
      },
      {
        active: true,
        id: 'mockNonVoiceTransferListI',
        name: 'mockNonVoiceTransferListName',
        endpoints: [
          { contactType: 'queue', hierarchy: 'mockHierarchy5' },
          { contactType: 'PSTN', hierarchy: 'mockHierarchy6' },
          { conctactType: 'SIP', hierarchy: 'mockHierarchy6' },
          { contactType: 'queue', hierarchy: 'mockHierarchy5' },
        ],
      },
    ],
  };
  const voiceFlowTransferLists = [
    { type: 'id', value: 'mockVocieTransferListId' },
    { type: 'id', value: 'mockVocieTransferListId' },
  ];
  const nonVoiceFlowTransferLists = [
    { type: 'name', value: 'mockNonVoiceTransferListName' },
    { type: 'name', value: 'mockNonVoiceTransferListName' },
  ];
  const tenant = { id: 'tenantId' };
  const agent = { userId: 'agentId' };
  const selectedInteraction = { interactionId: 'mockNonVoiceInteractionId' };
  const voiceInteraction = { interactionId: 'mockVoiceInteractionId' };

  describe('sets interaction transfet lists and there visible state for voice interactions', () => {
    const generator = callTransferListsFromFlowAndUpdateState({
      channelType: 'voice',
    });
    const mockGetTenantTransferLists = 'getTenantTransferListsFunction';
    const mockGetItem = jest.fn(() => null);
    beforeEach(() => {
      global.CxEngage = {
        entities: {
          getTransferLists: mockGetTenantTransferLists,
        },
      };
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant id, agent id and transfer lists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls the promise util with the SDK getTransferLists function to get the active transferLists', () => {
      expect(
        generator.next([
          tenant,
          agent,
          selectedInteraction,
          voiceInteraction,
          voiceFlowTransferLists,
          nonVoiceFlowTransferLists,
        ])
      ).toMatchSnapshot();
    });
    it('updates interactionTransferLists state by dispatching setInteractionTransferLists action', () => {
      expect(generator.next(tenantTransferLists)).toMatchSnapshot();
    });
    it('sets interactionTransferListsVisibleState to true by dispatching setInteractionTransferListsVisibleState action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets all visibleStateOfAllInteractionTransferLists to true by dispatching setVisibleStateOfAllInteractionTransferLists action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set flow transfer lists hidden state', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('sets interaction transfet lists and there visible state for the non voice interactions', () => {
    const generator = callTransferListsFromFlowAndUpdateState({
      channelType: 'nonVoice',
    });
    const mockGetTenantTransferLists = 'getTenantTransferListsFunction';
    const mockGetItem = jest.fn(() => 'false');
    beforeEach(() => {
      global.CxEngage = {
        entities: {
          getTransferLists: mockGetTenantTransferLists,
        },
      };
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant id, agent id and transfer lists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls the promise util with the SDK getTransferLists function to get the active transferLists', () => {
      expect(
        generator.next([
          tenant,
          agent,
          selectedInteraction,
          voiceInteraction,
          voiceFlowTransferLists,
          nonVoiceFlowTransferLists,
        ])
      ).toMatchSnapshot();
    });
    it('updates interactionTransferLists state by dispatching setInteractionTransferLists action', () => {
      expect(generator.next(tenantTransferLists)).toMatchSnapshot();
    });
    it('sets interactionTransferListsVisibleState to false by dispatching setInteractionTransferListsVisibleState action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets visibleStateOfAllInteractionTransferLists to false by dispatching setVisibleStateOfAllInteractionTransferLists action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set flow transfer lists hidden state', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('when there are no active transfer lists in the tenant', () => {
    const generator = callTransferListsFromFlowAndUpdateState({
      channelType: 'voice',
    });
    const mockGetTenantTransferLists = 'getTenantTransferListsFunction';
    const mockGetItem = jest.fn(() => true);
    beforeEach(() => {
      global.CxEngage = {
        entities: {
          getTransferLists: mockGetTenantTransferLists,
        },
      };
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const inactiveTransferLists = {
      result: [{ active: false }, { active: false }],
    };
    it('selects tenant id, agent id and transfer lists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls the promise util with the SDK getTransferLists function to get the active transferLists', () => {
      expect(
        generator.next([
          tenant,
          agent,
          selectedInteraction,
          voiceInteraction,
          voiceFlowTransferLists,
          nonVoiceFlowTransferLists,
        ])
      ).toMatchSnapshot();
    });
    it('updates interactionTransferLists state to null by dispatching setInteractionTransferLists action', () => {
      expect(generator.next(inactiveTransferLists)).toMatchSnapshot();
    });
    it('sets interactionTransferListsVisibleState to null by dispatching setInteractionTransferListsVisibleState action', () => {
      expect(generator.next(inactiveTransferLists)).toMatchSnapshot();
    });
    it('sets visibleStateOfAllInteractionTransferLists to null by dispatching setVisibleStateOfAllInteractionTransferLists action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('when the current interaction flow doesnot have any transfer lists', () => {
    const generator = callTransferListsFromFlowAndUpdateState({
      channelType: 'voice',
    });
    const mockGetTenantTransferLists = 'getTenantTransferListsFunction';
    const mockGetItem = jest.fn(() => true);
    beforeEach(() => {
      global.CxEngage = {
        entities: {
          getTransferLists: mockGetTenantTransferLists,
        },
      };
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant id, agent id and transfer lists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('set voice interaction transfer lists to null by dispatching setInteractionTrasnferLists action', () => {
      expect(
        generator.next([
          tenant,
          agent,
          selectedInteraction,
          voiceInteraction,
          undefined,
          undefined,
        ])
      ).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('changeInteractionTransferListVisibleState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  const generator = changeInteractionTransferListVisibleState({
    transferListId: 'mockTransferListId',
  });
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('selects tenant-id, agent-id and previous transferListVisibleState', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('updates interactionTransferListsVisibleState to false by dispatching setInteractionTransferListsVisibleState', () => {
    expect(
      generator.next([
        { id: 'tenantId' },
        { userId: 'agentId' },
        { 'flowTransferList-mockTransferListId': true },
      ])
    ).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
  it('updates localStorage with interactionTransferListsVisibleState set to false', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
});

describe('updateVisibleStateofAllFlowTransferLists', () => {
  const generator = updateVisibleStateofAllFlowTransferLists({
    transferListId: 'mockTransferListId',
  });
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('selects tenant-id, agent-id and previous transferListVisibleState', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('updates visibleStateOfAllInteractionTransferLists to false by dispatching setVisibleStateOfAllInteractionTransferLists', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
    ).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
  it('updates localStorage with visibleStateOfAllFlowTransferLists set to false', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
});
