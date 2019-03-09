/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import { createSelector } from 'reselect';
import { selectQueues } from 'containers/AgentDesktop/selectors';
import { selectUserAssignedTransferLists, selectUserAssigNonVoiceTransLists } from 'containers/TransferMenu/selectors';

export const selectTransferMenuPreferences = (state) =>
  state.get('transferMenuPreferences');

export const selectSelectedQueues = createSelector(
  selectTransferMenuPreferences,
  (transferMenuPreference) =>
    transferMenuPreference.get('selectedQueues').toJS()
);

export const selectSelectedTransferLists = createSelector(
  selectTransferMenuPreferences,
  (transferMenuPreference) =>
    transferMenuPreference.get('selectedTransferLists').toJS()
);

export const selectAgentsPreferences = (state) =>
  selectTransferMenuPreferences(state).get('agentsTransferMenu');

export const selectQueuesPreferences = createSelector(
  selectQueues,
  selectSelectedQueues,
  (userQueues, selectedQueues) => userQueues.length === selectedQueues.length
);

export const selectVisibleQueues = createSelector(
  selectQueues,
  selectSelectedQueues,
  (userQueues, selectedQueues) =>
    userQueues.filter((queue) => selectedQueues.includes(queue.id))
);

export const selectVisibleTransferLists = createSelector(
  selectUserAssignedTransferLists,
  selectSelectedTransferLists,
  (userTransferLists, selectedTransferLists) => {
    if (userTransferLists !== null) {
      return userTransferLists.filter((transferList) =>
        selectedTransferLists.includes(transferList.id)
      );
    } else {
      return [];
    }
  }
);

export const selectVisibleNonVoiceTransferLists = createSelector(
  selectUserAssigNonVoiceTransLists,
  selectSelectedTransferLists,
  (userTransferLists, selectedTransferLists) => {
    if (userTransferLists !== null) {
      return userTransferLists.filter((transferList) =>
        selectedTransferLists.includes(transferList.id)
      );
    } else {
      return [];
    }
  }
);

export const selectVisibleVoiceTransferLists = createSelector(
  selectUserAssignedTransferLists,
  selectSelectedTransferLists,
  (userTransferLists, selectedTransferLists) => {
    if (userTransferLists !== null) {
      return userTransferLists.filter((transferList) =>
        selectedTransferLists.includes(transferList.id)
      );
    } else {
      return [];
    }
  }
);

export const selectShowQueues = (state) =>
  selectTransferMenuPreferences(state).get('showQueues');

export const selectShowTransferLists = (state) =>
  selectTransferMenuPreferences(state).get('showTransferLists');

export const selectPreferenceMenuQueuesLoading = (state) =>
  selectTransferMenuPreferences(state).get('preferenceMenuQueuesLoading');

export const selectPreferenceMenuTransferListsLoading = (state) =>
  selectTransferMenuPreferences(state).get(
    'preferenceMenuTransferListsLoading'
  );
