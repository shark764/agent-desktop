/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectLoginMap = (state) => state.get('login');
const selectAgentDesktopMap = (state) => state.get('agentDesktop');

const selectAgentId = createSelector(
  selectLoginMap,
  (login) => login.get('agent').get('userId')
);

const selectIsAgentReady = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('presence') === 'ready'
);

const selectInteractions = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectNewInteractionPanel = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('newInteractionPanel')
);
const selectQueues = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('queues').toJS()
);

const selectSelectedInteraction = createSelector(
  [selectNewInteractionPanel, selectInteractions, getSelectedInteractionId],
  (newInteractionPanel, interactions, selectedInteractionId) => {
    if (selectedInteractionId !== undefined) {
      if (selectedInteractionId === 'creating-new-interaction') {
        return newInteractionPanel.toJS();
      } else {
        return interactions.toJS().find((interaction) =>
          interaction.interactionId === selectedInteractionId
        );
      }
    } else {
      return undefined;
    }
  }
 );

const selectAwaitingDisposition = createSelector(
  selectSelectedInteraction,
  (interaction) => (
    typeof interaction !== 'undefined' &&
    interaction.status === 'wrapup' &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0
  )
);

const selectHasVoiceInteraction = createSelector(
  selectInteractions,
  (interactions) => interactions.findIndex(
    (interaction) => (interaction.get('channelType') === 'voice')
  ) !== -1
);

const selectSmsInteractionNumbers = createSelector(
  selectInteractions,
  (interactions) => {
    const smsInteractionNumbers = [];
    interactions.forEach((interaction) => {
      if (interaction.get('channelType') === 'sms') {
        smsInteractionNumbers.push(interaction.get('customer'));
      }
    });
    return smsInteractionNumbers;
  }
);

const selectIsContactsPanelCollapsed = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('isContactsPanelCollapsed')
);

export {
  selectAgentId,
  selectIsAgentReady,
  selectInteractions,
  getSelectedInteractionId,
  selectLoginMap,
  selectAgentDesktopMap,
  selectSelectedInteraction,
  selectAwaitingDisposition,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
  selectQueues,
  selectIsContactsPanelCollapsed,
};
