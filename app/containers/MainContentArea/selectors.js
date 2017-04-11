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

const selectSelectedInteraction = createSelector(
  [selectInteractions, getSelectedInteractionId],
  (interactions, selectedInteractionId) => {
    if (selectedInteractionId !== undefined) {
      return interactions.toJS().find((interaction) =>
        interaction.interactionId === selectedInteractionId
      );
    } else {
      return undefined;
    }
  }
 );

const selectMessageTemplates = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('userConfig').get('messageTemplates').toJS()
);

export {
  selectSelectedInteraction,
  selectMessageTemplates,
};
