/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { selectCurrentInteraction } from 'containers/InfoTab/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectContact = createSelector(
  [selectCurrentInteraction],
  (currentInteraction) => currentInteraction.contact
);

export { getSelectedInteractionId, selectContact };
