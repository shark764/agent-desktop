/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentTransferMenuPreferenceMenu reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  agentsTransferMenu: true,
  showQueues: false,
  showTransferLists: false,
  preferenceMenuQueuesLoading: false,
  preferenceMenuTransferListsLoading: false,
  transferListsVisibleStateMap: {},
  queuesVisibleStateMap: {},
});

export default function transferMenuPreferencesReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    //  Preferences Actions
    case ACTIONS.SET_AGENTS_TRANSFER_MENU_PREFERENCE:
      return state.set('agentsTransferMenu', action.agentsTransferMenu);

    //  Queues Actions
    //  Opens queues menu preference ui dropdown
    case ACTIONS.SET_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE:
      return state.set('showQueues', action.showQueues);
    //  Toggles one single queue item in dropdown
    case ACTIONS.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE_ON_STATE: {
      const isQueueOnVisibleStateMap = state.hasIn([
        'queuesVisibleStateMap',
        action.queue,
      ]);
      if (isQueueOnVisibleStateMap) {
        return state.updateIn(
          ['queuesVisibleStateMap', action.queue],
          queueState => !queueState
        );
      } else {
        return state.setIn(['queuesVisibleStateMap', action.queue], true);
      }
    }
    //  Toggles all queues items in dropdown
    case ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE_ON_STATE: {
      return state.update('queuesVisibleStateMap', queuesVisibleStateMap => {
        const activeQueuesMap = queuesVisibleStateMap.filter((value, key) =>
          action.queues.includes(key)
        );
        const visibleQueuesList = activeQueuesMap.filter(value => value);
        if (
          visibleQueuesList.size >= 0 &&
          activeQueuesMap.size > visibleQueuesList.size
        ) {
          return queuesVisibleStateMap.map(
            (value, key) => (activeQueuesMap.has(key) ? true : value)
          );
        } else {
          return queuesVisibleStateMap.map(
            (value, key) => (activeQueuesMap.has(key) ? false : value)
          );
        }
      });
    }
    //  Toggles all local storage queues items
    case ACTIONS.TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE:
      return state.set(
        'queuesVisibleStateMap',
        fromJS(action.queuesVisibleStateMap)
      );
    //  Toggles the loading spinner for queues list in collapsibleMultiselect component
    case ACTIONS.SET_PREFERENCE_MENU_QUEUES_LOADING:
      return state.set(
        'preferenceMenuQueuesLoading',
        action.preferenceMenuQueuesLoading
      );

    //  Transfer Lists Actions
    //  Opens transfer menu preference ui dropdown
    case ACTIONS.SET_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE:
      return state.set('showTransferLists', action.showTransferLists);
    //  Toggles one single transfer list item in dropdown
    case ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE_ON_STATE: {
      const isTransferListOnVisibleStateMap = state.hasIn([
        'transferListsVisibleStateMap',
        action.transferList,
      ]);
      if (isTransferListOnVisibleStateMap) {
        return state.updateIn(
          ['transferListsVisibleStateMap', action.transferList],
          transferListState => !transferListState
        );
      } else {
        return state.setIn(
          ['transferListsVisibleStateMap', action.transferList],
          true
        );
      }
    }
    //  Toggles all transfer lists items in dropdown
    case ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE_ON_STATE: {
      return state.update(
        'transferListsVisibleStateMap',
        transferListsVisibleStateMap => {
          const activeTransferListsMap = transferListsVisibleStateMap.filter(
            (value, key) => action.transferLists.includes(key)
          );
          const visibleTransferLists = activeTransferListsMap.filter(
            value => value
          );
          if (
            visibleTransferLists.size >= 0 &&
            activeTransferListsMap.size > visibleTransferLists.size
          ) {
            return transferListsVisibleStateMap.map(
              (value, key) => (activeTransferListsMap.has(key) ? true : value)
            );
          } else {
            return transferListsVisibleStateMap.map(
              (value, key) => (activeTransferListsMap.has(key) ? false : value)
            );
          }
        }
      );
    }
    //  Toggles all local storage transfer lists items
    case ACTIONS.TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE:
      return state.set(
        'transferListsVisibleStateMap',
        fromJS(action.transferListsVisibleStateMap)
      );
    //  Toggles the loading spinner for transfer lists in collapsibleMultiselect component
    case ACTIONS.SET_PREFERENCE_MENU_TRANSFER_LISTS_LOADING:
      return state.set(
        'preferenceMenuTransferListsLoading',
        action.preferenceMenuTransferListsLoading
      );
    default:
      return state;
  }
}
