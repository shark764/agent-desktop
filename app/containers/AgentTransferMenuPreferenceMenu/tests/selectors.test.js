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
    it('when all queues are selected queues in selected queues list', () => {
      const queues = ['123', 'abc'];
      const selectSelectedQueuesMap = fromJS({
        transferMenuPreferences: {
          selectedQueues: ['123', 'abc'],
        },
      });
      expect(selectSelectedQueues(selectSelectedQueuesMap)).toEqual(
        expect.arrayContaining(queues)
      );
    });
    it('when there are queues selected in selected queues list', () => {
      const queues = ['123', 'abc', '1c3'];
      const selectSelectedQueuesMap = fromJS({
        transferMenuPreferences: {
          selectedQueues: ['123', 'abc'],
        },
      });
      expect(selectSelectedQueues(selectSelectedQueuesMap)).not.toEqual(
        expect.arrayContaining(queues)
      );
    });
    it('there are not queues in selected queues list', () => {
      expect(
        selectSelectedQueues(
          fromJS({
            transferMenuPreferences: {
              selectedQueues: [],
            },
          })
        )
      ).toEqual([]);
    });
  });
});

describe('selectSelectedTransferLists', () => {
  describe('selectedTransferLists is defined', () => {
    it('when all transfer lists are selected in selected list', () => {
      const transferLists = ['123', 'abc'];
      const selectSelectedTransferListsMap = fromJS({
        transferMenuPreferences: {
          selectedTransferLists: ['123', 'abc'],
        },
      });
      expect(
        selectSelectedTransferLists(selectSelectedTransferListsMap)
      ).toEqual(expect.arrayContaining(transferLists));
    });
    it('when there are transfer lists selected in selected trasnfer list', () => {
      const transferLists = ['123', 'abc', '1c3'];
      const selectSelectedTransferListsMap = fromJS({
        transferMenuPreferences: {
          selectedTransferLists: ['123', 'abc'],
        },
      });
      expect(
        selectSelectedTransferLists(selectSelectedTransferListsMap)
      ).not.toEqual(expect.arrayContaining(transferLists));
    });
    it('there are not transfer lists in selected transfer list', () => {
      expect(
        selectSelectedTransferLists(
          fromJS({
            transferMenuPreferences: {
              selectedTransferLists: [],
            },
          })
        )
      ).toEqual([]);
    });
  });
});

describe('selectVisibleTransferLists', () => {
  describe('selectVisibleTransferLists is defined', () => {
    it('when all transfer lists are included in selected list', () => {
      const transferLists = ['123', 'abc'];
      const visibleTransferListsMap = fromJS({
        transferMenuPreferences: {
          selectedTransferLists: ['123', 'abc'],
        },
      });
      expect(selectSelectedTransferLists(visibleTransferListsMap)).toEqual(
        expect.arrayContaining(transferLists)
      );
    });
    it('when there are visible transfer lists included in selected trasnfer list', () => {
      const transferLists = ['123', 'abc', '1c3'];
      const visibleTransferListsMap = fromJS({
        transferMenuPreferences: {
          selectedTransferLists: ['123', 'abc'],
        },
      });
      expect(selectSelectedTransferLists(visibleTransferListsMap)).not.toEqual(
        expect.arrayContaining(transferLists)
      );
    });
    it('there are not visible transfer lists in selected transfer list', () => {
      expect(
        selectSelectedTransferLists(
          fromJS({
            transferMenuPreferences: {
              selectedTransferLists: [],
            },
          })
        )
      ).toEqual([]);
    });
  });
});

describe('selectVisibleQueues', () => {
  describe('selectVisibleQueues is defined', () => {
    it('when all queues are included in selected list', () => {
      const queues = ['123', 'abc'];
      const visibleQueuesListMap = fromJS({
        transferMenuPreferences: {
          selectedQueues: ['123', 'abc'],
        },
      });
      expect(selectSelectedQueues(visibleQueuesListMap)).toEqual(
        expect.arrayContaining(queues)
      );
    });
    it('when there are visible queues included in selected queues list', () => {
      const queues = ['123', 'abc', '1c3'];
      const visibleQueuesListMap = fromJS({
        transferMenuPreferences: {
          selectedQueues: ['123', 'abc'],
        },
      });
      expect(selectSelectedQueues(visibleQueuesListMap)).not.toEqual(
        expect.arrayContaining(queues)
      );
    });
    it('there are not visible queues in selected queues list', () => {
      expect(
        selectSelectedQueues(
          fromJS({
            transferMenuPreferences: {
              selectedQueues: [],
            },
          })
        )
      ).toEqual([]);
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
