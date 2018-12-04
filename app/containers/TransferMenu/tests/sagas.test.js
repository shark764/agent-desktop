import {
  callTransferListsAndUpdateState,
  setAgentsQueuesInitialVisibleState,
  changeQueuesListVisibleState,
  changeAgentsListVisibleState,
  changeTransferListVisibleState,
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
