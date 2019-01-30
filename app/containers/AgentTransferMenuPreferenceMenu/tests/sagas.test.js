/*
 * Copyright © 2015-2019 Serenova, LLC. All rights reserved.
 */

import {
  goInitializeTransferMenuPreferences,
  goToggleAgentsTransferMenuPreference,
  goToggleShowQueuesTransferMenuPreference,
  changeSelectedQueuesState,
  goToggleShowTransferListTransferMenuPreference,
  changeSelectedTransferListsState,
} from '../sagas';

describe('goInitializeTransferMenuPreferences', () => {
  afterAll(() => {
    delete global.localStorage;
  });
  describe('initialize all preferences stored in localStorage', () => {
    const mockGetItem = jest.fn().mockReturnValue('true');
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const generator = goInitializeTransferMenuPreferences();
    it('selects the agent and tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts the agent preference into state', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
      ).toMatchSnapshot();
    });
    it('puts selected queues into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts selected transfer lists into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('uses the tenant and agent id to get the items from localStorage', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('setting AgentPreference to true on state', () => {
    const mockGetItem = jest.fn();
    mockGetItem.mockReturnValueOnce(true);
    mockGetItem.mockReturnValue(undefined);
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const generator = goInitializeTransferMenuPreferences();
    it('selects the agent and tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts the agent preference into state', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
      ).toMatchSnapshot();
    });
    it('puts all queues into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts all transfer lists into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('uses the tenant and agent id to get the items from localStorage', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('setting a queue as selected on state', () => {
    const mockGetItem = jest.fn();
    mockGetItem.mockReturnValueOnce(undefined);
    mockGetItem.mockReturnValueOnce('123');
    mockGetItem.mockReturnValue(undefined);
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const generator = goInitializeTransferMenuPreferences();
    it('selects the agent and tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets agent preference to true into state', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
      ).toMatchSnapshot();
    });
    it('puts selected queue into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts all transfer lists into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('uses the tenant and agent id to get the items from localStorage', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('setting a transfer list as selected on state', () => {
    const mockGetItem = jest.fn();
    mockGetItem.mockReturnValueOnce(undefined);
    mockGetItem.mockReturnValueOnce(undefined);
    mockGetItem.mockReturnValue('abc');
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    const generator = goInitializeTransferMenuPreferences();
    it('selects the agent and tenant id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets agent preference to true into state', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }, true])
      ).toMatchSnapshot();
    });
    it('puts all queues into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('puts selected transfer list into state', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('uses the tenant and agent id to get the items from localStorage', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
  describe('when agentPreference, selectedQueues and selectedTransferLists not saved in localStorage', () => {
    const generator = goInitializeTransferMenuPreferences();
    const mockGetItem = jest.fn().mockReturnValue('false');
    beforeEach(() => {
      global.localStorage = {
        getItem: mockGetItem,
      };
    });
    it('selects tenant and agent id', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('sets agentPreference to true by dispatching setAgentsTransferMenuPreference action', () => {
      expect(
        generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
      ).toMatchSnapshot();
    });
    it('does not set selectedQueues to true by dispatching toggleAllSelectedQueuesTransferMenuPreference action', () => {
      expect(generator.next('false')).toMatchSnapshot();
    });
    it('does not set selectedTransferLists to true by dispatching toggleSelectedTransferLists action', () => {
      expect(generator.next('false')).toMatchSnapshot();
    });
    it('gets localStorage properties that are used to set agentPreference, selectedQueues and selectedTransferLists', () => {
      expect(mockGetItem.mock.calls).toMatchSnapshot();
    });
    it('is done', () => {
      expect(generator.next().done).toBe(true);
    });
  });
});

describe('goToggleAgentsTransferMenuPreference', () => {
  const generator = goToggleAgentsTransferMenuPreference();
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('gets agentsTransferMenu preference', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('toggles agentPreference by dispatching setAgentsTransferMenuPreference action', () => {
    expect(generator.next(false)).toMatchSnapshot();
  });
  it('selects tenant and agent id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('is done', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }]).done
    ).toBe(true);
  });
});

describe('goToggleShowQueuesTransferMenuPreference', () => {
  const generator = goToggleShowQueuesTransferMenuPreference();
  it('gets showQueuesTransferMenu preference', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('toggles showQueuesTransferMenu by dispatching setShowQueuesTransferMenuPreference action', () => {
    expect(generator.next(false)).toMatchSnapshot();
  });
  it('is done', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }]).done
    ).toBe(true);
  });
});

describe('changeSelectedQueuesState', () => {
  const generator = changeSelectedQueuesState();
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('selects tenant and agent id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('gets selectedQueues', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
    ).toMatchSnapshot();
  });
  it('updates selectedQueues in localStorage', () => {
    expect(
      generator.next({ selectedQueues: ['123', 'abc'] })
    ).toMatchSnapshot();
  });
  it('calls setItem function', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
});

describe('goToggleShowTransferListTransferMenuPreference', () => {
  const generator = goToggleShowTransferListTransferMenuPreference();
  it('gets showTransferListTransferMenu preference', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('toggles goToggleShowTransferListTransferMenuPreference by dispatching setShowTransferListTransferMenuPreference action', () => {
    expect(generator.next(false)).toMatchSnapshot();
  });
  it('is done', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }]).done
    ).toBe(true);
  });
});

describe('changeSelectedTransferListsState', () => {
  const generator = changeSelectedTransferListsState();
  const mockSetItem = jest.fn();
  beforeEach(() => {
    global.localStorage = {
      setItem: mockSetItem,
    };
  });
  it('selects tenant and agent id', () => {
    expect(generator.next()).toMatchSnapshot();
  });
  it('gets selectedTransferLists', () => {
    expect(
      generator.next([{ id: 'tenantId' }, { userId: 'agentId' }])
    ).toMatchSnapshot();
  });
  it('updates selectedTransferLists in localStorage', () => {
    expect(
      generator.next({ selectedTransferLists: ['123', 'abc'] })
    ).toMatchSnapshot();
  });
  it('calls setItem function', () => {
    expect(mockSetItem.mock.calls).toMatchSnapshot();
  });
  it('is done', () => {
    expect(generator.next().done).toBe(true);
  });
});
