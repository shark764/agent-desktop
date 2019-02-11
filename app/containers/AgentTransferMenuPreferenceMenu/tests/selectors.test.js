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

describe('selectSelectedQueuees', () => {
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
