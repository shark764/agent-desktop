/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectLoginMap = (state) => state.get('login');
const selectAgentDesktopMap = (state) => state.get('agentDesktop');

const selectAgentId = createSelector(selectLoginMap, (login) =>
  login.get('agent').get('userId')
);

const selectIsAgentReady = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('presence') === 'ready'
);

const selectInteractionsList = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);
const selectNewInteractionPanel = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('newInteractionPanel').toJS()
);
const selectQueues = createSelector(selectAgentDesktopMap, (agentDesktop) =>
  agentDesktop.get('queues').toJS()
);

const selectQueuesSet = createSelector(selectAgentDesktopMap, (agentDesktop) =>
  agentDesktop.get('queuesSet')
);

const selectNoInteractionContactPanel = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel').toJS()
);

const getSelectedInteraction = createSelector(
  [
    selectNewInteractionPanel,
    selectInteractionsList,
    getSelectedInteractionId,
    selectNoInteractionContactPanel,
  ],
  (
    newInteractionPanel,
    interactions,
    selectedInteractionId,
    noInteractionContactPanel
  ) => {
    if (selectedInteractionId !== undefined) {
      if (selectedInteractionId === 'creating-new-interaction') {
        return newInteractionPanel;
      } else {
        return interactions
          .toJS()
          .find(
            (interaction) => interaction.interactionId === selectedInteractionId
          );
      }
    } else {
      return noInteractionContactPanel;
    }
  }
);

const selectAwaitingDisposition = createSelector(
  getSelectedInteraction,
  (interaction) =>
    interaction !== undefined &&
    interaction.status === 'wrapup' &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0
);

const selectHasVoiceInteraction = createSelector(
  selectInteractionsList,
  (interactions) =>
    interactions.findIndex(
      (interaction) => interaction.get('channelType') === 'voice'
    ) !== -1
);

const selectSmsInteractionNumbers = createSelector(
  selectInteractionsList,
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

const selectInteractionEmails = createSelector(
  selectInteractionsList,
  (interactions) => {
    const interactionEmails = [];
    interactions.forEach((interaction) => {
      if (interaction.get('channelType') === 'email') {
        interactionEmails.push(interaction.get('customer'));
      }
    });
    return interactionEmails;
  }
);

const selectIsSidePanelCollapsed = createSelector(
  getSelectedInteraction,
  (interaction) => interaction.isSidePanelCollapsed === true
);

const selectSidePanelPx = createSelector(selectAgentDesktopMap, (agentDesktop) =>
  agentDesktop.get('sidePanelPx')
);

const selectIsInteractionsBarCollapsed = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('isInteractionsBarCollapsed')
);

const selectCrmModule = createSelector(selectAgentDesktopMap, (agentDesktop) =>
  agentDesktop.get('crmModule')
);

const selectCustomFields = createSelector(
  getSelectedInteraction,
  (interaction) => interaction.customFields
);

const selectCustomFieldsCollapsed = createSelector(
  getSelectedInteraction,
  (interaction) => interaction.customFieldsCollapsed
);

const selectExpandWindowForCrm = createSelector(
  [
    selectAgentDesktopMap,
    selectCrmModule,
    selectIsSidePanelCollapsed,
    getSelectedInteraction,
  ],
  (agentDesktop, crmModule, panelCollapsed, interaction) =>
    (crmModule === 'zendesk' || agentDesktop.get('standalonePopup')) &&
    !panelCollapsed &&
    interaction.script !== undefined &&
    interaction.channelType !== 'voice' &&
    !interaction.isScriptOnly
);

export {
  selectAgentId,
  selectIsAgentReady,
  selectInteractionsList,
  getSelectedInteractionId,
  selectLoginMap,
  selectAgentDesktopMap,
  selectNoInteractionContactPanel,
  selectNewInteractionPanel,
  getSelectedInteraction,
  selectAwaitingDisposition,
  selectHasVoiceInteraction,
  selectSmsInteractionNumbers,
  selectInteractionEmails,
  selectQueues,
  selectQueuesSet,
  selectIsSidePanelCollapsed,
  selectSidePanelPx,
  selectIsInteractionsBarCollapsed,
  selectCrmModule,
  selectCustomFields,
  selectCustomFieldsCollapsed,
  selectExpandWindowForCrm,
};
