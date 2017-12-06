/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectContact = createSelector(
  [selectAgentDesktopDomain, getSelectedInteraction],
  (agentDesktop, currentInteraction) => {
    if (currentInteraction.interactionId === 'current-crm-item-history') {
      return agentDesktop.getIn(['crmActiveTab', 'contact']).toJS();
    } else {
      return currentInteraction.contact;
    }
  }
);

export { selectContact };
