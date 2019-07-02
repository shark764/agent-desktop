/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { selectQueues } from 'containers/AgentDesktop/selectors';
import {
  selectUserAssignedTransferLists,
  selectUserAssigNonVoiceTransLists,
} from 'containers/TransferMenu/selectors';

export const selectTransferMenuPreferences = state =>
  state.get('transferMenuPreferences');

export const selectSelectedQueues = createSelector(
  selectTransferMenuPreferences,
  transferMenuPreference =>
    transferMenuPreference.get('queuesVisibleStateMap').toJS()
);

export const selectSelectedTransferLists = createSelector(
  selectTransferMenuPreferences,
  transferMenuPreference =>
    transferMenuPreference.get('transferListsVisibleStateMap').toJS()
);

export const selectAgentsPreferences = state =>
  selectTransferMenuPreferences(state).get('agentsTransferMenu');

export const selectVisibleQueues = createSelector(
  selectQueues,
  selectSelectedQueues,
  (userQueues, selectedQueues) => {
    const activeQueuesMap = fromJS(selectedQueues).filter((value, key) =>
      userQueues.map(userQueue => userQueue.id).includes(key)
    );
    const visibleQueues = activeQueuesMap
      .filter(value => value)
      .map(activeQueue => activeQueue);
    return userQueues.filter(queue =>
      Array.from(visibleQueues.keys()).includes(queue.id)
    );
  }
);

export const selectVisibleVoiceTransferLists = createSelector(
  selectUserAssignedTransferLists,
  selectSelectedTransferLists,
  (userTransferLists, selectedTransferLists) => {
    if (userTransferLists !== null) {
      const activeTransferListsMap = fromJS(selectedTransferLists).filter(
        (value, key) =>
          userTransferLists
            .map(userTransferList => userTransferList.id)
            .includes(key)
      );
      const visibleTransferLists = activeTransferListsMap
        .filter(value => value)
        .map(activeTransferList => activeTransferList);
      return userTransferLists.filter(transferList =>
        Array.from(visibleTransferLists.keys()).includes(transferList.id)
      );
    } else {
      return [];
    }
  }
);

export const selectVisibleNonVoiceTransferLists = createSelector(
  selectUserAssigNonVoiceTransLists,
  selectSelectedTransferLists,
  (userNonVoiceTransferLists, selectedTransferLists) => {
    if (userNonVoiceTransferLists !== null) {
      const activeTransferListsMap = fromJS(selectedTransferLists).filter(
        (value, key) =>
          userNonVoiceTransferLists
            .map(userTransferList => userTransferList.id)
            .includes(key)
      );
      const visibleTransferLists = activeTransferListsMap
        .filter(value => value)
        .map(activeTransferList => activeTransferList);
      return userNonVoiceTransferLists.filter(transferList =>
        Array.from(visibleTransferLists.keys()).includes(transferList.id)
      );
    } else {
      return [];
    }
  }
);

export const selectShowQueues = state =>
  selectTransferMenuPreferences(state).get('showQueues');

export const selectShowTransferLists = state =>
  selectTransferMenuPreferences(state).get('showTransferLists');

export const selectPreferenceMenuQueuesLoading = state =>
  selectTransferMenuPreferences(state).get('preferenceMenuQueuesLoading');

export const selectPreferenceMenuTransferListsLoading = state =>
  selectTransferMenuPreferences(state).get(
    'preferenceMenuTransferListsLoading'
  );
