import {
  setAgentsQueuesInitialVisibleState,
  changeQueuesListVisibleState,
  changeAgentsListVisibleState,
  tearDownTransferMenuStates,
  transferInteraction,
  callUserAssignedTransferListsAndUpdateState,
  changeUserAssignedTransferListVisibleState,
  changeVisibleStateofAllUserAssignedTransferLists,
} from '../sagas';

describe('setAgentsQueuesInitialVisibleState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  describe('when queuesListHiddenState and agentsListHiddenState not saved in localStorage', () => {
    const generator = setAgentsQueuesInitialVisibleState();
    const mockGetItem = jest.fn(() => null);
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets queuesListVisibleState to true by dispatching setQueuesListVisibleState action', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('sets agentsListVisibleState to true by dispatching setAgentsListVisibleState action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set queuesListVisibleState and agentsListVisibleState', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('when queuesListHiddenState and agentsListHiddenState saved in localStorage', () => {
    const generator = setAgentsQueuesInitialVisibleState();
    const mockGetItem = jest.fn(() => 'false');
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets queuesListVisibleState to false by dispatching setQueuesListVisibleState action', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('sets agentsListVisibleState to false by dispatching setAgentsListVisibleState action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set queuesListVisibleState and agentsListVisibleState', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('changeQueuesListVisibleState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  describe('collpase/expand queuesList Transfer options', () => {
    const generator = changeQueuesListVisibleState();
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.localStorage = {
        setItem: mockSetItem,
      };
    });
    it('selects tenant-id, agent-id and previous queuesListVisibleState', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('updates queuesListVisibleState to false by dispatching setQueuesListVisibleState', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
      ).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
    it('updates localStorage with queuesListVisibleState set to false', () => {
      expect(mockSetItem.mock.calls).toMatchSnapshot();
    });
  });
});

describe('changeAgentsListVisibleState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  describe('collpase/expand agentsList Transfer options', () => {
    const generator = changeAgentsListVisibleState();
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.localStorage = {
        setItem: mockSetItem,
      };
    });
    it('selects tenant-id, agent-id and previous agentsListVisibleState', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('updates agentsListVisibleState to false by dispatching setAgentsListVisibleState', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
      ).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
    it('updates localStorage with agentsListVisibleState set to false', () => {
      expect(mockSetItem.mock.calls).toMatchSnapshot();
    });
  });
});

describe('tearDownTransferMenuStates', () => {
  describe('tearDownTransferMenuStates for voice interactions', () => {
    const generator = tearDownTransferMenuStates({ channelType: 'voice' });
    it('gets voice and currently selected interactionId', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets transferSearchInput to its default state', () => {
      expect(
        generator.next('mockselectedInteractionId', 'mockVoiceInteractionId')
      ).toMatchSnapshot();
    });
    it('sets transferTabIndex to its default state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets showTransferDialpad to its default state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets voice interactionTransferListsLoadingState to its true', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets userAssignedTransferListsLoadingState to its default state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('tearDownTransferMenuStates for non-voice interactions', () => {
    const generator = tearDownTransferMenuStates({ channelType: 'nonVoice' });
    it('gets voice and currently selected interactionId', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets transferSearchInput to its default state', () => {
      expect(
        generator.next('mockselectedInteractionId', 'mockNonVoiceInteractionId')
      ).toMatchSnapshot();
    });
    it('sets transferTabIndex to its default state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets showTransferDialpad to its default state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets non-voice interactionTransferListsLoadingState to true', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets userAssignedTransferListsLoadingState to its default state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('transferInteraction', () => {
  describe('Making a warm transfer of voice interaction to a resource', () => {
    const mockTransferToResource = jest.fn();
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          transferToResource: mockTransferToResource,
        },
      };
    });
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'Agent 1',
      resourceId: 'resId1',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'voice',
          },
          0,
        ])
      ).toMatchSnapshot();
    });
    it('dispatch startWarmTransfering to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.transferToResource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('Making a cold transfer of a nonvoice interaction to a resource', () => {
    const mockTransferToResource = jest.fn();
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          transferToResource: mockTransferToResource,
        },
      };
    });
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'Agent 1',
      resourceId: 'resId1',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'email',
          },
          0,
        ])
      ).toMatchSnapshot();
    });
    it('dispatches setIsColdTransferring to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.transferToResource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('Making a cold transfer of a nonvoice interaction to a queue', () => {
    const mockTransferToQueue = jest.fn();
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          transferToQueue: mockTransferToQueue,
        },
      };
    });
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'Queue 1',
      resourceId: undefined,
      queueId: 'queue1',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'email',
          },
          0,
        ])
      ).toMatchSnapshot();
    });
    it('dispatches setIsColdTransferring to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.transferToQueue', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('Making a cold transfer of a voice interaction to a transferExtension', () => {
    const mockTransferToExtension = jest.fn();
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          transferToExtension: mockTransferToExtension,
        },
      };
    });
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'Transfer Extension 1',
      resourceId: undefined,
      queueId: undefined,
      transferExtension: 'transferExtension1',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'voice',
          },
          1,
        ])
      ).toMatchSnapshot();
    });
    it('dispatches setIsColdTransferring to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.transferToExtension', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('Making a warm transfer of a voice interaction when not passing neither a resource, queue or a transfer extension', () => {
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'notUsefulValue',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'voice',
          },
          0,
        ])
      ).toMatchSnapshot();
    });
    it('throws an error', () => {
      expect(() => {
        generator.next();
      }).toThrow(
        'warm transfer: neither resourceId, queueId, nor transferExtension passed in'
      );
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('Making a cold transfer of a nonvoice interaction when not passing neither a resource, queue or a transfer extension', () => {
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'notUsefulValue',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'email',
          },
          0,
        ])
      ).toMatchSnapshot();
    });
    it('dispatches setIsColdTransferring to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('throws an error', () => {
      expect(() => {
        generator.next();
      }).toThrow(
        'neither resourceId, queueId, nor transferExtension passed in'
      );
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('call to CxEngage.interaction.transferToResource fails when trying to make a warm transfer of a voice interaction to a resource', () => {
    const mockTransferToResource = jest.fn();
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          transferToResource: mockTransferToResource,
        },
      };
    });
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'Agent 1',
      resourceId: 'resId1',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'voice',
          },
          0,
        ])
      ).toMatchSnapshot();
    });
    it('dispatch startWarmTransfering to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.transferToResource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('CxEngage.interactions.transferToResource call fails, its error gets logged in console and transferCancelled is dispatched', () => {
      expect(generator.throw('Failed promise')).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('call to CxEngage.interaction.transferToResource fails when trying to make a cold transfer of a voice interaction to a resource', () => {
    const mockTransferToResource = jest.fn();
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          transferToResource: mockTransferToResource,
        },
      };
    });
    const mockAction = {
      setShowTransferMenu: () => {},
      name: 'Agent 1',
      resourceId: 'resId1',
    };
    const generator = transferInteraction(mockAction);
    it('gets the interaction id, and channel type from the selected interaction and the index of the transfer tab', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
      expect(
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'voice',
          },
          1,
        ])
      ).toMatchSnapshot();
    });
    it('dispatches setIsColdTransferring to the store', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.transferToResource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('CxEngage.interactions.transferToResource call fails, its error gets logged in console and setIsColdTransferring is called again', () => {
      expect(generator.throw('Failed promise')).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('callUserAssignedTransferListsAndUpdateState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  const transferLists = [
    {
      active: true,
      id: 'mockTransferListId1',
      name: 'mockTransferListName',
      endpoints: [
        {
          contactType: 'queue',
          hierarchy: 'mockHierarchy1',
          endPointRenderUUID: 'mockEndPointUUID1',
          hierarchyRenderUUID: 'mockEndPointUUID1',
        },
        {
          contactType: 'PSTN',
          hierarchy: 'mockHierarchy2',
          endPointRenderUUID: 'mockEndPointUUID2',
          hierarchyRenderUUID: 'mockEndPointUUID2',
        },
        {
          conctactType: 'SIP',
          hierarchy: 'mockHierarchy3',
          endPointRenderUUID: 'mockEndPointUUID3',
          hierarchyRenderUUID: 'mockEndPointUUID3',
        },
      ],
      transferListRenderUUID: 'mockTransferListUUID1',
    },
    {
      active: true,
      id: 'mockTransferListId2',
      name: 'mockTransferListName2',
      endpoints: [
        {
          contactType: 'queue',
          hierarchy: 'mockHierarchy4',
          endPointRenderUUID: 'mockEndPointUUID4',
          hierarchyRenderUUID: 'mockEndPointUUID4',
        },
        {
          contactType: 'PSTN',
          hierarchy: 'mockHierarchy5',
          endPointRenderUUID: 'mockEndPointUUID5',
          hierarchyRenderUUID: 'mockEndPointUUID6',
        },
        {
          conctactType: 'SIP',
          hierarchy: 'mockHierarchy6',
          endPointRenderUUID: 'mockEndPointUUID5',
          hierarchyRenderUUID: 'mockEndPointUUID6',
        },
      ],
      transferListRenderUUID: 'mockTransferListUUID2',
    },
  ];
  describe('sets user assigned transfer lists and there visible state for the voice interactions', () => {
    const generator = callUserAssignedTransferListsAndUpdateState({
      channelType: undefined,
    });
    const mockGetTenantTransferLists = 'getTransferListsFunction';
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
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls updateUserAssignedTransferLists generator function', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('selects userAssginedTransferLists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets userAssignedTransferListsVisibleState to true by dispatching setUserAssignedTransferListsVisibleState action', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('sets visibleStateOfAllAssignedTransferLists to true by dispatching setVisibleStateOfAllUserAssignedTransferLists action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('sets user assigned transfer lists and there visible state for non voice interactions', () => {
    const generator = callUserAssignedTransferListsAndUpdateState({
      channelType: 'nonVoice',
    });
    const mockGetTenantTransferLists = 'getTransferListsFunction';
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
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls updateUserAssignedTransferLists generator function', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('selects userAssginedTransferLists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets non-voice interaction transfer lists by dispatching setUserAssignedTransferLists', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('sets userAssignedTransferListsVisibleState to false by dispatching setUserAssignedTransferListsVisibleState action', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('sets visibleStateOfAllAssignedTransferLists to false by dispatching setVisibleStateOfAllUserAssignedTransferLists action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('when the current logged in agent doesnot have any transfer lists', () => {
    const generator = callUserAssignedTransferListsAndUpdateState({
      channelType: undefined,
    });
    const mockGetTenantTransferLists = 'getTransferListsFunction';
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
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls updateUserAssignedTransferLists generator function', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('selects userAssginedTransferLists', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets userAssignedTransferListsVisibleState to null by dispatching setUserAssignedTransferListsVisibleState action', () => {
      expect(generator.next(null)).toMatchSnapshot();
    });
    it('sets visibleStateOfAllAssignedTransferLists to null by dispatching setVisibleStateOfAllUserAssignedTransferLists action', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('changeUserAssignedTransferListVisibleState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  const action = {
    transferListId: 'mockTransferListId',
  };
  const generator = changeUserAssignedTransferListVisibleState(action);
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('selects tenant-id, agent-id and previous transferListVisibleState', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('updates userAssignedTransferListsVisibleState to false by dispatching setUserAssignedTransferListsVisibleState', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
    ).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
  it('updates localStorage with userAssignedTransferListsVisibleState set to false', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
});

describe('changeVisibleStateofAllUserAssignedTransferLists', () => {
  const action = {
    transferListId: 'mockTransferListId',
  };
  const generator = changeVisibleStateofAllUserAssignedTransferLists(action);
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('selects tenant-id, agent-id and previous transferListVisibleState', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('updates visibleStateOfAllAssignedTransferLists to false by dispatching setVisibleStateOfAllUserAssignedTransferLists', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
    ).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
  it('updates localStorage with visibleStateOfAllFlowTransferLists set to false', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
});
