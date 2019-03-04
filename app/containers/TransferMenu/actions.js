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

export function setUserAssignedTransferLists(userAssignedTransferLists) {
  return {
    type: ACTIONS.SET_USER_ASSIGNED_TRANSFER_LISTS,
    userAssignedTransferLists,
  };
}

export function setUserAssignedTransferListsLoadingState(isLoading) {
  return {
    type: ACTIONS.SET_USER_ASSIGNED_TRANSFER_LISTS_LOADING_STATE,
    isLoading,
  };
}

export function setUserAssignedTransferListsVisibleState(
  userAssignedTransferListsVisibleState
) {
  return {
    type: ACTIONS.SET_USER_ASSIGNED_TRANSFER_LIST_VISIBLE_STATE,
    userAssignedTransferListsVisibleState,
  };
}

export function setVisibleStateOfAllUserAssignedTransferLists(
  visibleStateOfAllUserAssignedTransferLists
) {
  return {
    type: ACTIONS.SET_VISIBLE_STATE_OF_ALL_USER_ASSIGNED_TRANSFER_LISTS,
    visibleStateOfAllUserAssignedTransferLists,
  };
}

// Saga Actions:

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

export function tearDownTransferMenuStates() {
  return {
    type: ACTIONS.TEAR_DOWN_TRANSFER_MENU_STATES,
  };
}

export function transferInteraction(
  setShowTransferMenu,
  name,
  resourceId,
  queueId,
  transferExtension
) {
  return {
    type: ACTIONS.TRANSFER_INTERACTION,
    setShowTransferMenu,
    name,
    resourceId,
    queueId,
    transferExtension,
  };
}

export function updateUserAssignedTransferLists() {
  return {
    type: ACTIONS.UPDATE_USER_ASSIGNED_TRANSFER_LISTS,
  };
}

export function updateUserAssignedTransferListsVisibleState(transferListId) {
  return {
    type: ACTIONS.UPDATE_USER_ASSIGNED_TRANSFER_LIST_VISIBLE_STATE,
    transferListId,
  };
}

export function updateVisibleStateOfAllUserAssignedTransferlists() {
  return {
    type: ACTIONS.UPDATE_VISIBLE_STATE_OF_ALL_USER_ASSIGNED_TRANSFER_LISTS,
  };
}
