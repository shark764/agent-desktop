/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */
import { createSelector } from 'reselect';
import { selectQueues } from 'containers/AgentDesktop/selectors';
import { selectUserAssignedTransferLists } from 'containers/TransferMenu/selectors';

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

export const selectTransferListsPreferences = createSelector(
  selectUserAssignedTransferLists,
  selectSelectedTransferLists,
  (userTransferLists, selectedTransferLists) =>
    userTransferLists.length === selectedTransferLists.length
);

export const selectShowQueues = (state) =>
  selectTransferMenuPreferences(state).get('showQueues');

export const selectShowTransferLists = (state) =>
  selectTransferMenuPreferences(state).get('showTransferLists');
