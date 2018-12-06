import * as ACTIONS from './constants';

// REDUCER ACTIONS:

export function setResourceCapactiy(resourceCapacity) {
  return {
    type: ACTIONS.SET_RESOURCE_CAPACITY,
    resourceCapacity,
  };
}

export function setUsers(users) {
  return {
    type: ACTIONS.SET_USERS,
    users,
  };
}

export function getAndSetTransferLists(transferLists) {
  return {
    type: ACTIONS.GET_AND_SET_TRANSFER_LISTS,
    transferLists,
  };
}

export function setQueuesListVisibleState(queuesListVisibleState) {
  return {
    type: ACTIONS.SET_QUEUES_LIST_VISIBLE_STATE,
    queuesListVisibleState,
  };
}

export function setAgentsListVisibleState(agentsListVisibleState) {
  return {
    type: ACTIONS.SET_AGENTS_LIST_VISIBLE_STATE,
    agentsListVisibleState,
  };
}

export function setTransferListsVisibleState(transferListsVisibleState) {
  return {
    type: ACTIONS.SET_TRANSFER_LIST_VISIBLE_STATE,
    transferListsVisibleState,
  };
}

export function setTransferSearchInput(transferSearchInput) {
  return {
    type: ACTIONS.SET_TRANSFER_SEARCH_INPUT,
    transferSearchInput,
  };
}

export function setFocusedTransferItemIndex(focusedTransferItemIndex) {
  return {
    type: ACTIONS.SET_FOCUSED_TRANSFER_ITEM_INDEX,
    focusedTransferItemIndex,
  };
}

export function setTransferTabIndex(transferTabIndex) {
  return {
    type: ACTIONS.SET_TRANSFER_TAB_INDEX,
    transferTabIndex,
  };
}

export function setShowTransferDialPad(showTransferDialpad) {
  return {
    type: ACTIONS.SET_SHOW_TRANSFER_DIAL_PAD,
    showTransferDialpad,
  };
}

// Saga Actions:

export function setTransferLists() {
  return {
    type: ACTIONS.SET_TRANSFER_LISTS,
  };
}
export function initializeQueuesAgentsVisibleState() {
  return {
    type: ACTIONS.SET_INITIAL_TRANSFER_MENUS_VISIBLE_STATE,
  };
}

export function updateQueuesListVisibleState() {
  return {
    type: ACTIONS.UPDATE_QUEUES_LIST_VISIBLE_STATE,
  };
}

export function updateAgentsListVisibleState() {
  return {
    type: ACTIONS.UPDATE_AGENTS_LIST_VISIBLE_STATE,
  };
}

export function updateTransferListVisibleState(transferListId) {
  return {
    type: ACTIONS.UPDATE_TRANSFER_LIST_VISIBLE_STATE,
    transferListId,
  };
}
export function tearDownTransferMenuStates() {
  return {
    type: ACTIONS.TEAR_DOWN_TRANSFER_MENU_STATES,
  };
}
