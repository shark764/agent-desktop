/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentTransferMenuPreferenceMenu reducer
 *
 */

import { fromJS, List } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  agentsTransferMenu: false,
  showQueues: false,
  showTransferLists: false,
  selectedQueues: [],
  selectedTransferLists: [],
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
    case ACTIONS.SET_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE:
      return state.set('showQueues', action.showQueues);
    case ACTIONS.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE:
      return state.update('selectedQueues', (queues) => {
        if (queues.includes(action.queue)) {
          return queues.filter((queue) => queue !== action.queue);
        } else {
          return queues.push(action.queue);
        }
      });
    case ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE:
      return state.update('selectedQueues', (queues) => {
        if (action.queues.length > 0 && queues.size < action.queues.length) {
          const newQueues = action.queues.filter(
            (queue) => !queues.includes(queue)
          );
          return queues.push(...newQueues);
        } else {
          return List();
        }
      });
    case ACTIONS.TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE:
      return state.set('selectedQueues', List(action.queues));

    //  Transfer Lists Actions
    case ACTIONS.SET_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE:
      return state.set('showTransferLists', action.showTransferLists);
    case ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE:
      return state.update('selectedTransferLists', (transferLists) => {
        if (transferLists.includes(action.transferList)) {
          return transferLists.filter(
            (transferList) => transferList !== action.transferList
          );
        } else {
          return transferLists.push(action.transferList);
        }
      });
    case ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE:
      return state.update('selectedTransferLists', (transferLists) => {
        if (
          action.transferLists.length > 0 &&
          transferLists.size < action.transferLists.length
        ) {
          const newTransferLists = action.transferLists.filter(
            (transferList) => !transferLists.includes(transferList)
          );
          return transferLists.push(...newTransferLists);
        } else {
          return List();
        }
      });
    case ACTIONS.TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE:
      return state.set('selectedTransferLists', List(action.transferLists));
    default:
      return state;
  }
}
