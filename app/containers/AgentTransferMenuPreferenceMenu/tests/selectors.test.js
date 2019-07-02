import { fromJS } from 'immutable';

import {
  selectAgentsPreferences,
  selectSelectedQueues,
  selectSelectedTransferLists,
  selectShowQueues,
  selectShowTransferLists,
} from '../selectors';

describe('selectAgentsPreferences', () => {
  it('when selectAgentsPreferences is defined', () => {
    const state = fromJS({
      transferMenuPreferences: {
        agentsTransferMenu: true,
      },
    });
    expect(selectAgentsPreferences(state)).toBe(true);
  });
});

describe('selectSelectedQueues', () => {
  describe('selectedQueues is defined', () => {
    it('when all queues are selected queues in queues list', () => {
      const queues = { '123': true, '321': true };
      const selectSelectedQueuesMap = fromJS({
        transferMenuPreferences: {
          queuesVisibleStateMap: { '123': true, '321': true },
        },
      });
      expect(selectSelectedQueues(selectSelectedQueuesMap)).toEqual(
        expect.objectContaining(queues)
      );
    });
    it('when there are queues selected in selected queues list', () => {
      const queues = { '123': true, '321': false };
      const selectSelectedQueuesMap = fromJS({
        transferMenuPreferences: {
          queuesVisibleStateMap: { '123': true, '321': false },
        },
      });
      expect(selectSelectedQueues(selectSelectedQueuesMap)).toEqual(
        expect.objectContaining(queues)
      );
    });
    it('there are not queues in selected queues list', () => {
      expect(
        selectSelectedQueues(
          fromJS({
            transferMenuPreferences: {
              queuesVisibleStateMap: {},
            },
          })
        )
      ).toEqual({});
    });
  });
});

describe('selectSelectedTransferLists', () => {
  describe('selectedTransferLists is defined', () => {
    it('when all transfer lists are selected in selected list', () => {
      const transferLists = { '123': true, '321': true };
      const selectSelectedTransferListsMap = fromJS({
        transferMenuPreferences: {
          transferListsVisibleStateMap: { '123': true, '321': true },
        },
      });
      expect(
        selectSelectedTransferLists(selectSelectedTransferListsMap)
      ).toEqual(expect.objectContaining(transferLists));
    });
    it('when there are transfer lists selected in selected trasnfer list', () => {
      const transferLists = { '123': true, '321': true, '1c3': false };
      const selectSelectedTransferListsMap = fromJS({
        transferMenuPreferences: {
          transferListsVisibleStateMap: {
            '123': true,
            '321': true,
            '1c3': false,
          },
        },
      });
      expect(
        selectSelectedTransferLists(selectSelectedTransferListsMap)
      ).toEqual(expect.objectContaining(transferLists));
    });
    it('there are not transfer lists in selected transfer list', () => {
      expect(
        selectSelectedTransferLists(
          fromJS({
            transferMenuPreferences: {
              transferListsVisibleStateMap: {},
            },
          })
        )
      ).toEqual({});
    });
  });
});

describe('selectVisibleVoiceTransferLists', () => {
  describe('selectVisibleVoiceTransferLists is defined', () => {
    it('when all transfer lists are included in selected list', () => {
      const transferLists = { '123': true, '321': true, '1c3': false };
      const visibleTransferListsMap = fromJS({
        transferMenuPreferences: {
          transferListsVisibleStateMap: {
            '123': true,
            '321': true,
            '1c3': false,
          },
        },
      });
      expect(selectSelectedTransferLists(visibleTransferListsMap)).toEqual(
        expect.objectContaining(transferLists)
      );
    });
    it('when there are visible transfer lists included in selected trasnfer list', () => {
      const transferLists = { '123': true, '321': true, '1c3': false };
      const visibleTransferListsMap = fromJS({
        transferMenuPreferences: {
          transferListsVisibleStateMap: { '123': true, '321': true },
        },
      });
      expect(selectSelectedTransferLists(visibleTransferListsMap)).not.toEqual(
        expect.objectContaining(transferLists)
      );
    });
    it('there are not visible transfer lists in selected transfer list', () => {
      expect(
        selectSelectedTransferLists(
          fromJS({
            transferMenuPreferences: {
              transferListsVisibleStateMap: {},
            },
          })
        )
      ).toEqual({});
    });
  });
});

describe('selectVisibleQueues', () => {
  describe('selectVisibleQueues is defined', () => {
    it('when all queues are included in selected list', () => {
      const queues = { '123': true, '321': true, '1c3': true };
      const visibleQueuesListMap = fromJS({
        transferMenuPreferences: {
          queuesVisibleStateMap: { '123': true, '321': true, '1c3': true },
        },
      });
      expect(selectSelectedQueues(visibleQueuesListMap)).toEqual(
        expect.objectContaining(queues)
      );
    });
    it('when there are visible queues included in selected queues list', () => {
      const queues = { '123': true, '321': true, '1c3': false };
      const visibleQueuesListMap = fromJS({
        transferMenuPreferences: {
          queuesVisibleStateMap: { '123': true, '321': true, '1c3': false },
        },
      });
      expect(selectSelectedQueues(visibleQueuesListMap)).toEqual(
        expect.objectContaining(queues)
      );
    });
    it('there are not visible queues in selected queues list', () => {
      expect(
        selectSelectedQueues(
          fromJS({
            transferMenuPreferences: {
              queuesVisibleStateMap: {},
            },
          })
        )
      ).toEqual({});
    });
  });
});

describe('selectShowQueues', () => {
  it('when selectShowQueues is closed', () => {
    const state = fromJS({
      transferMenuPreferences: {
        showQueues: false,
      },
    });
    expect(selectShowQueues(state)).toMatchSnapshot();
  });
  it('when selectShowQueues is open', () => {
    const state = fromJS({
      transferMenuPreferences: {
        showQueues: true,
      },
    });
    expect(selectShowQueues(state)).toBe(true);
  });
});

describe('selectShowTransferLists', () => {
  it('when selectShowTransferLists is closed', () => {
    const state = fromJS({
      transferMenuPreferences: {
        showTransferLists: false,
      },
    });
    expect(selectShowTransferLists(state)).toMatchSnapshot();
  });
  it('when selectShowTransferLists is open', () => {
    const state = fromJS({
      transferMenuPreferences: {
        showTransferLists: true,
      },
    });
    expect(selectShowTransferLists(state)).toBe(true);
  });
});
