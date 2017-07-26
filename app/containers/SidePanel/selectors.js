/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import has from 'lodash/has';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectNewInteractionPanel = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('newInteractionPanel')
);

const selectNoInteractionContactPanelContactsData = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel')
);

const getSelectedInteraction = createSelector(
  [
    selectInteractions,
    getSelectedInteractionId,
    selectNewInteractionPanel,
    selectNoInteractionContactPanelContactsData,
  ],
  (
    interactions,
    selectedInteractionId,
    newInteractionPanel,
    noInteractionContactPanelContactsData
  ) => {
    if (typeof selectedInteractionId !== 'undefined') {
      if (selectedInteractionId === 'creating-new-interaction') {
        return newInteractionPanel.toJS();
      } else {
        return interactions
          .toJS()
          .find(
            (interaction) => interaction.interactionId === selectedInteractionId
          );
      }
    }
    return noInteractionContactPanelContactsData.toJS();
  }
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
  getSelectedInteraction,
  getSelectedInteractionIsVoice,
  getSelectedInteractionScript,
  getSelectedInteractionIsScriptOnly,
  getHasAssignedContact,
  getSelectedSidePanelTab,
};
