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

const selectHasUnrespondedInteractions = createSelector(
  [selectInteractionsList, getSelectedInteractionId],
  (interactions, id) => {
    const interactionArray = interactions.toJS();
    const wasFound = interactionArray.findIndex(
      (interaction) =>
        interaction.messageHistory &&
        interaction.messageHistory.length &&
        (interaction.messageHistory[interaction.messageHistory.length - 1]
          .type === 'customer' ||
          interaction.messageHistory[interaction.messageHistory.length - 1]
            .type === 'message' ||
          interaction.messageHistory[interaction.messageHistory.length - 1]
            .type === 'system') &&
        interaction.interactionId !== id &&
        interaction.status !== 'work-ended-pending-script'
    );
    if (wasFound >= 0) {
      return true;
    } else {
      return false;
    }
  }
);

const selectPreviousInteraction = createSelector(
  [selectInteractionsList, getSelectedInteractionId],
  (interactions, id) => {
    const interactionArray = interactions.toJS();
    const voiceInteractionIndex = interactionArray.findIndex(
      (interaction) => interaction.channelType === 'voice'
    );
    if (voiceInteractionIndex >= 0) {
      const voiceInteraction = interactionArray.splice(
        voiceInteractionIndex,
        1
      )[0];
      interactionArray.unshift(voiceInteraction);
    }
    const startAt = interactionArray.findIndex(
      (interaction) => interaction.interactionId === id
    );
    if (interactionArray[startAt - 1] === undefined || startAt === 0) {
      return id;
    } else {
      return interactionArray[startAt - 1].interactionId;
    }
  }
);

const selectNextInteraction = createSelector(
  [selectInteractionsList, getSelectedInteractionId],
  (interactions, id) => {
    const interactionArray = interactions.toJS();
    const voiceInteractionIndex = interactionArray.findIndex(
      (interaction) => interaction.channelType === 'voice'
    );
    if (voiceInteractionIndex >= 0) {
      const voiceInteraction = interactionArray.splice(
        voiceInteractionIndex,
        1
      )[0];
      interactionArray.unshift(voiceInteraction);
    }
    const startAt = interactionArray.findIndex(
      (interaction) => interaction.interactionId === id
    );
    if (
      interactionArray[startAt + 1] === undefined ||
      interactionArray.length === startAt + 1
    ) {
      return id;
    } else {
      return interactionArray[startAt + 1].interactionId;
    }
  }
);

const selectNewInteractionPanel = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('newInteractionPanel').toJS()
);

const selectCurrentCrmItemHistoryPanel = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('currentCrmItemHistoryPanel').toJS()
);

const selectQueues = createSelector(selectAgentDesktopMap, (agentDesktop) =>
  agentDesktop.get('queues').toJS()
);

const selectQueuesSet = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('queuesSet') || false
);

const selectNoInteractionContactPanel = createSelector(
  selectAgentDesktopMap,
  (agentDesktop) => agentDesktop.get('noInteractionContactPanel').toJS()
);

const getSelectedInteraction = createSelector(
  [
    selectNewInteractionPanel,
    selectCurrentCrmItemHistoryPanel,
    selectInteractionsList,
    getSelectedInteractionId,
    selectNoInteractionContactPanel,
  ],
  (
    newInteractionPanel,
    currentCrmItemHistoryPanel,
    interactions,
    selectedInteractionId,
    noInteractionContactPanel
  ) => {
    if (selectedInteractionId !== undefined) {
      if (selectedInteractionId === 'creating-new-interaction') {
        return newInteractionPanel;
      } else if (selectedInteractionId === 'current-crm-item-history') {
        return currentCrmItemHistoryPanel;
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

const selectCurrentScript = createSelector(
  getSelectedInteraction,
  (interaction) => {
    if (interaction !== undefined && interaction.script !== undefined) {
      return interaction.script;
    } else {
      return {};
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
        smsInteractionNumbers.push(
          `+${interaction.get('customer').replace(/\D+/g, '')}`
        );
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
    (crmModule !== 'none' || agentDesktop.get('standalonePopup')) &&
    !panelCollapsed &&
    ((interaction.script !== undefined &&
      interaction.channelType !== 'voice' &&
      !interaction.isScriptOnly) ||
      interaction.contact !== undefined)
);

const areInteractionsInWrapup = createSelector(
  [selectInteractionsList, getSelectedInteractionId],
  (interactions) => {
    const interactionArrayWrapup = interactions.toJS();
    const wasFoundWrapup = interactionArrayWrapup.findIndex(
      (interaction) => interaction.status === 'wrapup'
    );
    return wasFoundWrapup >= 0;
  }
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
  selectCurrentScript,
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
  selectPreviousInteraction,
  selectNextInteraction,
  selectHasUnrespondedInteractions,
  areInteractionsInWrapup,
};
