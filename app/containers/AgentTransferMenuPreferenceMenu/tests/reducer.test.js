import { fromJS } from 'immutable';
import transferMenuPreferencesReducer from '../reducer';
import * as constant from '../constants';

describe('agentTransferMenuPreferenceMenuReducer', () => {
  it('returns the correct initial state', () => {
    expect(transferMenuPreferencesReducer(undefined, {})).toMatchSnapshot();
  });

  let action;
  let initialState;

  const runReducerAndExpectSnapshot = () => {
    expect(
      transferMenuPreferencesReducer(fromJS(initialState), action)
    ).toMatchSnapshot();
  };

  describe('SET_AGENTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        agentsTransferMenu: false,
      };
      action = {
        type: constant.SET_AGENTS_TRANSFER_MENU_PREFERENCE,
        agentsTransferMenu: true,
      };
    });
    it('changes agentsTransferMenu preference', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        showQueues: false,
      };
      action = {
        type: constant.SET_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE,
        showQueues: true,
      };
    });
    it('opens queues dropdown', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        queuesVisibleStateMap: { '123': false, abc: true },
      };
      action = {
        queue: '123',
        type: constant.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle one queue to selected', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        queuesVisibleStateMap: { '123': true, abc: true },
      };
      action = {
        queue: '123',
        type: constant.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle one queue and unselect it', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        queuesVisibleStateMap: { '123': false, abc: false },
      };
      action = {
        queues: ['123', 'abc'],
        type: constant.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all queues to selected', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        queuesVisibleStateMap: { '123': true, abc: true },
      };
      action = {
        queues: ['123', 'abc'],
        type: constant.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all queues to unselected', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        queuesVisibleStateMap: {},
      };
      action = {
        queuesVisibleStateMap: { '123': true, abc: true },
        type: constant.TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all stored queues to state', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        showTransferLists: false,
      };
      action = {
        type: constant.SET_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
        showTransferLists: true,
      };
    });
    it('opens transfer list dropdown', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        transferListsVisibleStateMap: { '123': false },
      };
      action = {
        transferList: '123',
        type: constant.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle one transfer list to selected list', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        transferListsVisibleStateMap: { '123': true },
      };
      action = {
        transferList: '123',
        type: constant.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle one transfer list and unselect it', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        transferListsVisibleStateMap: { '123': false, abc: false },
      };
      action = {
        transferLists: ['abc', 'abc'],
        type:
          constant.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all transfer lists to selected', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        transferListsVisibleStateMap: { '123': true, abc: true },
      };
      action = {
        transferLists: ['123', 'abc'],
        type:
          constant.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all transfer lists to unselected', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        transferListsVisibleStateMap: {},
      };
      action = {
        transferListsVisibleStateMap: { '123': true, abc: false },
        type: constant.TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all stored transfer lists to state', () => {
      runReducerAndExpectSnapshot();
    });
  });
});
