/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import has from 'lodash/has';

import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const getSelectedInteractionIsVoice = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined &&
    selectedInteraction.channelType === 'voice'
);

const getSelectedSidePanelTab = createSelector(
  getSelectedInteraction,
  (selectedInteraction) => selectedInteraction.selectedSidePanelTab
);

const getSelectedInteractionScript = createSelector(
  getSelectedInteraction,
  (selectedInteraction) => {
    if (selectedInteraction !== undefined) {
      return selectedInteraction.script;
    } else {
      return undefined;
    }
  }
);

const getSelectedInteractionIsScriptOnly = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined &&
    selectedInteraction.isScriptOnly === true
);

const getHasAssignedContact = createSelector(
  getSelectedInteraction,
  (selectedInteraction) => has(selectedInteraction, 'contact.id')
);

export {
  getSelectedInteractionId,
  getSelectedInteractionIsVoice,
  getSelectedInteractionScript,
  getSelectedInteractionIsScriptOnly,
  getHasAssignedContact,
  getSelectedSidePanelTab,
};
