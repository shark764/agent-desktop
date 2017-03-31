import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectNoInteractionContactPanelContactsData = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel')
);

const getSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId, selectNoInteractionContactPanelContactsData],
  (interactions, selectedInteractionId, noInteractionContactPanelContactsData) => {
    if (typeof selectedInteractionId !== 'undefined') {
      return interactions.toJS().find(
        (interaction) => interaction.interactionId === selectedInteractionId
      );
    }
    return noInteractionContactPanelContactsData.toJS();
  }
);

const getSelectedInteractionIsVoice = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined && selectedInteraction.channelType === 'voice'
);

const getSelectedTabIndex = createSelector(
  getSelectedInteraction,
  (selectedInteraction) => selectedInteraction.sidePanelTabIndex
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

const getHasAssignedContact = createSelector(
  getSelectedInteraction,
  (selectedInteraction) =>
    selectedInteraction !== undefined && selectedInteraction.contact !== undefined
);

export {
  getSelectedInteractionId,
  getSelectedInteractionIsVoice,
  getSelectedInteractionScript,
  getHasAssignedContact,
  getSelectedTabIndex,
};
