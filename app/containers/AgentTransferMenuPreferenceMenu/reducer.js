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
  agentsTransferMenu: true,
  showQueues: false,
  showTransferLists: false,
  selectedQueues: [],
  unSelectedQueues: [],
  selectedTransferLists: [],
  unSelectedTransferLists: [],
  preferenceMenuQueuesLoading: false,
  preferenceMenuTransferListsLoading: false,
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
    case ACTIONS.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE_ON_STATE:
      return state
        .update('selectedQueues', (queues) => {
          if (queues.includes(action.queue)) {
            return queues.filter((queue) => queue !== action.queue);
          } else {
            return queues.push(action.queue);
          }
        })
        .update('unSelectedQueues', (queues) => {
          const isQueueSelected = state
            .get('selectedQueues')
            .includes(action.queue);
          const isQueueUnselected = queues.includes(action.queue);
          if (isQueueUnselected) {
            return queues.filter((queue) => queue !== action.queue);
          } else if (isQueueSelected) {
            return queues.push(action.queue);
          } else {
            return queues;
          }
        });
    //  Toggles all queues items in dropdown
    case ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE_ON_STATE: {
      let allSelected = false;
      const previousSelectedQueues = state.get('selectedQueues');
      const previousUnSelectedQueues = state.get('unSelectedQueues');
      //  If there are disabled queues then, the preference for those will be still store even if they don't show up with the next two variables
      const remainingSelectedQueues = previousSelectedQueues.filter(
        (queue) => !action.queues.includes(queue)
      );
      const remainingUnselectedQueues = previousUnSelectedQueues.filter(
        (queue) => !action.queues.includes(queue)
      );
      return state
        .update('selectedQueues', (queues) => {
          //  Checking if there is at least one selected item, so we select all remaining items that are unselected
          const leftSelectedQueues = action.queues.filter((queue) =>
            previousSelectedQueues.includes(queue)
          );
          if (
            (action.queues.length > 0 && queues.size < action.queues.length) ||
            leftSelectedQueues.length < action.queues.length
          ) {
            const newQueues = action.queues.filter(
              (queue) => !queues.includes(queue)
            );
            //  Setting a allSelected flag to true, so we make sure that un unSelectedQueues it will execute the if statement
            allSelected = true;
            return queues.push(...newQueues);
          } else {
            allSelected = false;
            if (remainingSelectedQueues.size > 0) {
              return List(remainingSelectedQueues);
            } else {
              return List();
            }
          }
        })
        .update('unSelectedQueues', (queues) => {
          if (
            (action.queues.length > 0 &&
              queues.size < action.queues.length &&
              allSelected) ||
            allSelected
          ) {
            if (remainingUnselectedQueues.size > 0) {
              return List(remainingUnselectedQueues);
            } else {
              return List();
            }
          } else {
            const newQueues = action.queues.filter(
              (queue) => !queues.includes(queue)
            );
            if (remainingUnselectedQueues.length > 0) {
              queues.push(remainingUnselectedQueues);
            }
            return queues.push(...newQueues);
          }
        });
    }
    //  Toggles all local storage queues items
    case ACTIONS.TOGGLE_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE:
      return state
        .set('selectedQueues', List(action.queues))
        .set('unSelectedQueues', List(action.unSelectedQueues));
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
    case ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE_ON_STATE:
      return state
        .update('selectedTransferLists', (transferLists) => {
          if (transferLists.includes(action.transferList)) {
            return transferLists.filter(
              (transferList) => transferList !== action.transferList
            );
          } else {
            return transferLists.push(action.transferList);
          }
        })
        .update('unSelectedTransferLists', (transferLists) => {
          const isTransferListSelected = state
            .get('selectedTransferLists')
            .includes(action.transferList);
          const isTransferListUnselected = transferLists.includes(
            action.transferList
          );
          if (isTransferListUnselected) {
            return transferLists.filter(
              (transferList) => transferList !== action.transferList
            );
          } else if (isTransferListSelected) {
            return transferLists.push(action.transferList);
          } else {
            return transferLists;
          }
        });
    //  Toggles all transfer lists items in dropdown
    case ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE_ON_STATE: {
      let allSelected = false;
      const previousSelectedTransferLists = state.get('selectedTransferLists');
      const previousUnSelectedTransferLists = state.get(
        'unSelectedTransferLists'
      );
      //  If there are disabled transfer lists then, the preference for those will be still store even if they don't show up with the next two variables
      const remainingSelectedTransferLists = previousSelectedTransferLists.filter(
        (transferList) => !action.transferLists.includes(transferList)
      );
      const remainingUnselectedTransferLists = previousUnSelectedTransferLists.filter(
        (transferList) => !action.transferLists.includes(transferList)
      );
      return state
        .update('selectedTransferLists', (transferLists) => {
          //  Checking if there is at least one selected item, so we select all remaining items that are unselected
          const leftSelectedtransferLists = action.transferLists.filter(
            (transferList) =>
              previousSelectedTransferLists.includes(transferList)
          );
          if (
            (action.transferLists.length > 0 &&
              transferLists.size < action.transferLists.length) ||
            leftSelectedtransferLists.length < action.transferLists.length
          ) {
            const newTransferLists = action.transferLists.filter(
              (transferList) => !transferLists.includes(transferList)
            );
            //  Setting a allSelected flag to true, so we make sure that un unSelectedQueues it will execute the if statement
            allSelected = true;
            return transferLists.push(...newTransferLists);
          } else {
            allSelected = false;
            //  If there are disabled transfer lists then, the preference for those will be still store even if they don't show up
            if (remainingSelectedTransferLists.size > 0) {
              return List(remainingSelectedTransferLists);
            } else {
              return List();
            }
          }
        })
        .update('unSelectedTransferLists', (transferLists) => {
          if (
            (action.transferLists.length > 0 &&
              transferLists.size < action.transferLists.length &&
              allSelected) ||
            allSelected
          ) {
            if (remainingUnselectedTransferLists.size > 0) {
              return List(remainingUnselectedTransferLists);
            } else {
              return List();
            }
          } else {
            const newTransferLists = action.transferLists.filter(
              (transferList) => !transferLists.includes(transferList)
            );
            if (remainingUnselectedTransferLists.length > 0) {
              transferLists.push(remainingUnselectedTransferLists);
            }
            return transferLists.push(...newTransferLists);
          }
        });
    }
    //  Toggles all local storage transfer lists items
    case ACTIONS.TOGGLE_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE:
      return state
        .set('selectedTransferLists', List(action.transferLists))
        .set('unSelectedTransferLists', List(action.unSelectedTransferLists));
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
