/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Toolbar reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  transferSearchInput: '',
  transferTabIndex: 0,
  focusedTransferItemIndex: -1,
  showTransferDialpad: false,
  userAssignedTransferLists: {
    voiceListsLoadingState: true,
    nonVoiceListsLoadingState: true,
  },
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_RESOURCE_CAPACITY: {
      return state.set('resourceCapacity', fromJS(action.resourceCapacity));
    }
    case ACTIONS.SET_USERS: {
      return state.set('users', fromJS(action.users));
    }
    case ACTIONS.SET_QUEUES_LIST_VISIBLE_STATE: {
      return state.set('queuesListVisibleState', action.queuesListVisibleState);
    }
    case ACTIONS.SET_AGENTS_LIST_VISIBLE_STATE: {
      return state.set('agentsListVisibleState', action.agentsListVisibleState);
    }
    case ACTIONS.SET_TRANSFER_SEARCH_INPUT: {
      return state.set('transferSearchInput', action.transferSearchInput);
    }
    case ACTIONS.SET_TRANSFER_TAB_INDEX: {
      return state.set('transferTabIndex', action.transferTabIndex);
    }
    case ACTIONS.SET_FOCUSED_TRANSFER_ITEM_INDEX: {
      return state.set(
        'focusedTransferItemIndex',
        action.focusedTransferItemIndex
      );
    }
    case ACTIONS.SET_SHOW_TRANSFER_DIAL_PAD: {
      return state.set('showTransferDialpad', action.showTransferDialpad);
    }
    case ACTIONS.SET_USER_ASSIGNED_TRANSFER_LISTS: {
      if (action.channelType === 'nonVoice') {
        return state
          .setIn(
            ['userAssignedTransferLists', 'nonVoiceListsLoadingState'],
            false
          )
          .setIn(
            ['userAssignedTransferLists', 'onlyQueueTransferLists'],
            fromJS(action.userAssignedTransferLists)
          );
      } else {
        return state
          .setIn(['userAssignedTransferLists', 'voiceListsLoadingState'], false)
          .setIn(
            ['userAssignedTransferLists', 'pstnSipQueueTransferLists'],
            fromJS(action.userAssignedTransferLists)
          );
      }
    }
    case ACTIONS.SET_USER_ASSIGNED_TRANSFER_LISTS_LOADING_STATE: {
      if (action.channelType === 'voice') {
        return state.setIn(
          ['userAssignedTransferLists', 'voiceListsLoadingState'],
          action.isLoading
        );
      } else {
        return state.setIn(
          ['userAssignedTransferLists', 'nonVoiceListsLoadingState'],
          action.isLoading
        );
      }
    }
    case ACTIONS.SET_USER_ASSIGNED_TRANSFER_LIST_VISIBLE_STATE: {
      return state.setIn(
        ['userAssignedTransferLists', 'transferListsVisibleState'],
        fromJS(action.userAssignedTransferListsVisibleState)
      );
    }
    case ACTIONS.SET_VISIBLE_STATE_OF_ALL_USER_ASSIGNED_TRANSFER_LISTS: {
      return state.setIn(
        ['userAssignedTransferLists', 'allTransferListsVisibleState'],
        action.visibleStateOfAllUserAssignedTransferLists
      );
    }
    default:
      return state;
  }
}
