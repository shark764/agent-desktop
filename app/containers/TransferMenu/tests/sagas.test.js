import {
  callTransferListsAndUpdateState,
  setAgentsQueuesInitialVisibleState,
  changeQueuesListVisibleState,
  changeAgentsListVisibleState,
  changeTransferListVisibleState,
  tearDownTransferMenuStates,
  transferInteraction,
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

describe('callTransferListsAndUpdateState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  const transferLists = {
    result: [
      {
        active: true,
        id: 'mockTransferListId',
        name: 'mockTransferListName',
        endpoints: [
          {
            hierarchy: 'mockHierarchyTitle',
            name: 'mockHierarchyName',
            endpoint: 'mockEndPointId',
          },
        ],
      },
    ],
  };
  describe('when transferListsHiddenState not saved in localStorage', () => {
    const generator = callTransferListsAndUpdateState();
    const mockGetTransferLists = 'getTransferListsFunction';
    const mockGetItem = jest.fn(() => null);
    beforeEach(() => {
      global.CxEngage = {
        entities: {
          getEntity: mockGetTransferLists,
        },
      };
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls the promise util with the SDK getTransferLists function to get the active transferLists', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('sets transferLists state by dispatching getAndSetTransferLists action', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('sets transferListsVisibleState to true by dispatching setTransferListsVisibleState action', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set transferListHiddenState', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('when transferListsHiddenState saved in localStorage', () => {
    const generator = callTransferListsAndUpdateState();
    const mockGetTransferLists = 'getTransferListsFunction';
    const mockGetItem = jest.fn(() => 'false');
    beforeEach(() => {
      global.CxEngage = {
        entities: {
          getEntity: mockGetTransferLists,
        },
      };
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls the promise util with the SDK getTransferLists function to get the active transferLists', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('sets transferLists state by dispatching getAndSetTransferLists action', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('sets transferListsVisibleState to false by dispatching setTransferListsVisibleState action', () => {
      expect(generator.next(transferLists)).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set transferListHiddenState', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('when no transferLists are available', () => {
  const noTransferLists = { result: [] };
  const generator = callTransferListsAndUpdateState();
  const mockGetTransferLists = 'getTransferListsFunction';
  beforeEach(() => {
    global.CxEngage = {
      entities: {
        getEntity: mockGetTransferLists,
      },
    };
  });
  it('selects tenant and agent id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('calls the promise util with the SDK getTransferLists function to get the active transferLists', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
    ).toMatchSnapshot();
  });
  it('sets transferLists state by dispatching getAndSetTransferLists action', () => {
    expect(generator.next(noTransferLists)).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
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

describe('changeTransferListVisibleState', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  const action = {
    transferListId: 'mockTransferListId',
  };
  describe('collpase/expand transferLists Transfer options', () => {
    const generator = changeTransferListVisibleState(action);
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.localStorage = {
        setItem: mockSetItem,
      };
    });
    it('selects tenant-id, agent-id and previous transferListVisibleState', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('updates transferListVisibleState to false by dispatching setTransferListsVisibleState', () => {
      expect(
        generator.next([
          { id: 'tenantId' },
          { userId: 'agentId' },
          { mockTransferListId: true },
        ])
      ).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
    it('updates localStorage with transferListVisibleState set to false', () => {
      expect(mockSetItem.mock.calls).toMatchSnapshot();
    });
  });
});

describe('tearDownTransferMenuStates', () => {
  const generator = tearDownTransferMenuStates();
  it('sets transferSearchInput to its default state', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('sets transferTabIndex to its default state', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('sets showTransferDialpad to its default state', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
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
    it('dispatch startWarmTransfering to the store', () => {
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
    it('calls CxEngage.interactions.transferToResource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('calls setShowTransferMenu', () => {
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
    it('calls CxEngage.interactions.transferToResource', () => {
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
    it('calls setShowTransferMenu', () => {
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
    it('calls CxEngage.interactions.transferToQueue', () => {
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
    it('calls setShowTransferMenu', () => {
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
    it('calls CxEngage.interactions.transferToExtension', () => {
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
    it('calls setShowTransferMenu', () => {
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
    it('throws an error', () => {
      expect(() => {
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'voice',
          },
          0,
        ]);
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
    it('throws an error', () => {
      expect(() => {
        generator.next([
          {
            interactionId: 'id1',
            channelType: 'email',
          },
          0,
        ]);
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
    it('dispatch startWarmTransfering to the store', () => {
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
    it('calls CxEngage.interactions.transferToResource', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('CxEngage.interactions.transferToResource call fails, its error gets logged in console and transferCancelled is dispatched', () => {
      expect(generator.throw('Failed promise')).toMatchSnapshot();
    });
    it("setsetShowTransferMenu it's called", () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it("it's done", () => {
      expect(generator.next().done).toBe(true);
    });
  });
});
