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
        agentsTransferMenu: false,
      };
    });
    it('changes agentsTransferMenu preference', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        transferMenuPreferences: {
          showQueues: false,
        },
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
        selectedQueues: [],
      };
      action = {
        queue: '123',
        type: constant.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle one queue to selected list', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        selectedQueues: ['123', 'abc'],
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
        selectedQueues: [],
      };
      action = {
        queues: ['123', 'abc', '3d2'],
        type: constant.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all queues to selected list', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        selectedQueues: ['123', 'abc', '3d2'],
      };
      action = {
        queues: [],
        type: constant.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all queues and return empty list', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        selectedQueues: ['abc'],
      };
      action = {
        queues: ['123'],
        type: constant.TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all stored queues to selected list', () => {
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
        selectedTransferLists: [],
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
        selectedTransferLists: ['123'],
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
        selectedTransferLists: ['123'],
      };
      action = {
        transferLists: ['abc', '3d2'],
        type:
          constant.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all transfer lists to selected list', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        selectedTransferLists: ['123', 'abc', '3d2'],
      };
      action = {
        transferLists: [],
        type:
          constant.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all transfer lists and unselect it', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE', () => {
    beforeEach(() => {
      initialState = {
        selectedTransferLists: ['asd'],
      };
      action = {
        transferLists: ['321'],
        type: constant.TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
      };
    });
    it('toggle all stored transfer lists to selected list', () => {
      runReducerAndExpectSnapshot();
    });
  });
});
