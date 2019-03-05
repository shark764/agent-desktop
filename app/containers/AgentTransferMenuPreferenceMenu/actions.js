/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentTransferMenuPreferenceMenu actions
 *
 */

import * as ACTIONS from './constants';

// Reducer actions
export function setAgentsTransferMenuPreference(agentsTransferMenu) {
  return {
    type: ACTIONS.SET_AGENTS_TRANSFER_MENU_PREFERENCE,
    agentsTransferMenu,
  };
}

//  Queues Reducer Actions
export function setShowQueuesTransferMenuPreference(showQueues) {
  return {
    type: ACTIONS.SET_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE,
    showQueues,
  };
}

export function toggleSelectedQueueTransferMenuPreferenceOnState(queue) {
  return {
    type: ACTIONS.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE_ON_STATE,
    queue,
  };
}

export function toggleAllSelectedQueuesTransferMenuPreferenceOnState(queues) {
  return {
    type: ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE_ON_STATE,
    queues,
  };
}

export function toggleSelectedQueues(queues) {
  return {
    type: ACTIONS.TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
    queues,
  };
}

//  Transfer Lists Reducer Actions
export function setShowTransferListTransferMenuPreference(showTransferLists) {
  return {
    type: ACTIONS.SET_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
    showTransferLists,
  };
}

export function toggleSelectedTransferListTransferMenuPreferenceOnState(
  transferList
) {
  return {
    type:
      ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE_ON_STATE,
    transferList,
  };
}

export function toggleAllSelectedTransferListsTransferMenuPreferenceOnState(
  transferLists
) {
  return {
    type:
      ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE_ON_STATE,
    transferLists,
  };
}

export function toggleSelectedTransferLists(transferLists) {
  return {
    type: ACTIONS.TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
    transferLists,
  };
}

// Saga actions
export function initializeTransferMenuPreferences() {
  return {
    type: ACTIONS.INITIALIZE_TRANSFER_MENU_PREFERENCES,
  };
}

export function toggleAgentsTransferMenuPreference() {
  return {
    type: ACTIONS.TOGGLE_AGENTS_TRANSFER_MENU_PREFERENCE,
  };
}

export function toggleShowQueuesTransferMenuPreference() {
  return {
    type: ACTIONS.TOGGLE_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE,
  };
}

export function toggleShowTransferListsTransferMenuPreference() {
  return {
    type: ACTIONS.TOGGLE_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
  };
}

export function setPreferenceMenuQueuesLoading(preferenceMenuQueuesLoading) {
  return {
    type: ACTIONS.SET_PREFERENCE_MENU_QUEUES_LOADING,
    preferenceMenuQueuesLoading,
  };
}

export function setPreferenceMenuTransferListsLoading(
  preferenceMenuTransferListsLoading
) {
  return {
    type: ACTIONS.SET_PREFERENCE_MENU_TRANSFER_LISTS_LOADING,
    preferenceMenuTransferListsLoading,
  };
}

export function toggleSelectedQueueTransferMenuPreference(queue) {
  return {
    type: ACTIONS.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE,
    queue,
  };
}

export function toggleAllSelectedQueuesTransferMenuPreference(queues) {
  return {
    type: ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
    queues,
  };
}

export function toggleSelectedTransferListTransferMenuPreference(transferList) {
  return {
    type: ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE,
    transferList,
  };
}

export function toggleAllSelectedTransferListsTransferMenuPreference(
  transferLists
) {
  return {
    type: ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
    transferLists,
  };
}
