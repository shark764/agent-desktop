/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectLoginMap = state => state.get('login');
const selectAgentDesktopMap = state => state.get('agentDesktop');
const selectQueuesMap = state => state.getIn(['agentDesktop', 'queues']);

const selectAgentId = createSelector(selectLoginMap, login =>
  login.get('agent').get('userId')
);

const selectIsAgentReady = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('presence') === 'ready'
);

const selectInteractionsList = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('interactions')
);

const getSelectedInteractionId = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('selectedInteractionId')
);

const selectHasUnrespondedInteractions = createSelector(
  [selectInteractionsList, getSelectedInteractionId],
  (interactions, id) => {
    const interactionArray = interactions.toJS();
    const wasFound = interactionArray.findIndex(
      interaction =>
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
      interaction => interaction.channelType === 'voice'
    );
    if (voiceInteractionIndex >= 0) {
      const voiceInteraction = interactionArray.splice(
        voiceInteractionIndex,
        1
      )[0];
      interactionArray.unshift(voiceInteraction);
    }
    const startAt = interactionArray.findIndex(
      interaction => interaction.interactionId === id
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
      interaction => interaction.channelType === 'voice'
    );
    if (voiceInteractionIndex >= 0) {
      const voiceInteraction = interactionArray.splice(
        voiceInteractionIndex,
        1
      )[0];
      interactionArray.unshift(voiceInteraction);
    }
    const startAt = interactionArray.findIndex(
      interaction => interaction.interactionId === id
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
  agentDesktop => {
    if (
      agentDesktop.get('newInteractionPanel').get('newInteractionFormInput') !==
      'BKMGNQBAWPJHRXDYZLEBCNTCIHFQJGKSRGSQISREQGDCUCLUKJ'
    ) {
      return agentDesktop.get('newInteractionPanel').toJS();
    } else {
      throw new Error('selector error');
    }
  }
);

const selectCurrentCrmItemHistoryPanel = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('currentCrmItemHistoryPanel').toJS()
);

const selectQueues = createSelector(selectQueuesMap, queues =>
  queues.toJS().sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  })
);

const selectQueuesSet = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('queuesSet') || false
);

const selectNoInteractionContactPanel = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('noInteractionContactPanel').toJS()
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
            interaction => interaction.interactionId === selectedInteractionId
          );
      }
    } else {
      return noInteractionContactPanel;
    }
  }
);

const selectCurrentScript = createSelector(
  getSelectedInteraction,
  interaction => {
    if (interaction !== undefined && interaction.script !== undefined) {
      return interaction.script;
    } else {
      return {};
    }
  }
);

const selectAwaitingDisposition = createSelector(
  getSelectedInteraction,
  interaction =>
    interaction !== undefined &&
    (interaction.status === 'wrapup' ||
      interaction.status === 'work-ended-pending-script') &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0
);

const selectAwaitingScript = createSelector(
  getSelectedInteraction,
  interaction =>
    interaction !== undefined &&
    interaction.status === 'wrapup' &&
    interaction.script !== undefined &&
    !interaction.script.autoScriptDismiss
);

const selectIsEndWrapupDisabled = createSelector(
  [getSelectedInteraction, selectAwaitingDisposition, selectAwaitingScript],
  (interaction, awaitingDisposition, awaitingScript) =>
    (interaction !== undefined &&
      (interaction.status === 'work-accepting' ||
        (interaction.status === 'work-accepted' &&
          interaction.sendingReply))) ||
    awaitingDisposition ||
    awaitingScript
);

const selectHasVoiceInteraction = createSelector(
  selectInteractionsList,
  interactions =>
    interactions.findIndex(
      interaction => interaction.get('channelType') === 'voice'
    ) !== -1
);

const selectSmsInteractionNumbers = createSelector(
  selectInteractionsList,
  interactions => {
    const smsInteractionNumbers = [];
    interactions.forEach(interaction => {
      if (
        interaction.get('channelType') === 'sms' &&
        interaction.get('customer')
      ) {
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
  interactions => {
    const interactionEmails = [];
    interactions.forEach(interaction => {
      if (interaction.get('channelType') === 'email') {
        interactionEmails.push(interaction.get('customer'));
      }
    });
    return interactionEmails;
  }
);

const selectIsSidePanelCollapsed = createSelector(
  getSelectedInteraction,
  interaction => interaction.isSidePanelCollapsed === true
);

const selectSidePanelPx = createSelector(selectAgentDesktopMap, agentDesktop =>
  agentDesktop.get('sidePanelPx')
);

const selectIsInteractionsBarCollapsed = createSelector(
  selectAgentDesktopMap,
  agentDesktop => agentDesktop.get('isInteractionsBarCollapsed')
);

const selectCrmModule = createSelector(selectAgentDesktopMap, agentDesktop =>
  agentDesktop.get('crmModule')
);

const selectCustomFields = createSelector(
  getSelectedInteraction,
  interaction => interaction.customFields
);

const selectCustomFieldsCollapsed = createSelector(
  getSelectedInteraction,
  interaction => interaction.customFieldsCollapsed
);

const selectExpandWindowForCrm = (state, props) => {
  const standalonePopup = state.getIn(['agentDesktop', 'standalonePopup']);
  const crmModule = selectCrmModule(state, props);
  const panelCollapsed = selectIsSidePanelCollapsed(state, props);
  const interaction = getSelectedInteraction(state, props);
  return (
    (crmModule !== 'none' || standalonePopup) &&
    !panelCollapsed &&
    ((interaction.script !== undefined &&
      interaction.channelType !== 'voice' &&
      !interaction.isScriptOnly) ||
      (interaction.contact !== undefined && crmModule === 'zendesk'))
  );
};

const areInteractionsInWrapup = createSelector(
  [selectInteractionsList, getSelectedInteractionId],
  interactions => {
    const interactionArrayWrapup = interactions.toJS();
    const wasFoundWrapup = interactionArrayWrapup.findIndex(
      interaction => interaction.status === 'wrapup'
    );
    return wasFoundWrapup >= 0;
  }
);

export const getUriObject = state => selectNewInteractionPanel(state).uriObject;

const selectVoiceInteraction = createSelector(
  selectInteractionsList,
  interactions =>
    interactions.toJS().find(interaction => interaction.channelType === 'voice')
);

const selectVoiceFlowTransLists = createSelector(
  selectVoiceInteraction,
  interaction => {
    let transferListsFromFlow;
    if (interaction && interaction.transferLists) {
      ({ transferListsFromFlow } = interaction.transferLists);
    }
    return transferListsFromFlow;
  }
);

const selectInterAssigVoiceTransLists = createSelector(
  selectVoiceInteraction,
  interaction => {
    if (
      interaction &&
      interaction.transferLists &&
      interaction.transferLists.interactionTransferLists &&
      interaction.transferLists.interactionTransferLists.length > 0
    ) {
      return interaction.transferLists.interactionTransferLists;
    } else {
      return null;
    }
  }
);

const selectInterAssigVoiceTransListsLoadSt = createSelector(
  selectVoiceInteraction,
  interaction => {
    let loadingState;
    if (interaction && interaction.transferLists) {
      ({ loadingState } = interaction.transferLists);
    }
    return loadingState;
  }
);

const selectNonVoiceFlowTransLists = createSelector(
  getSelectedInteraction,
  interaction => {
    let transferListsFromFlow;
    if (interaction.transferLists) {
      ({ transferListsFromFlow } = interaction.transferLists);
    }
    return transferListsFromFlow;
  }
);

const selectInterAssigNonVoiceTransLists = createSelector(
  getSelectedInteraction,
  interaction => {
    if (
      interaction &&
      interaction.transferLists &&
      interaction.transferLists.interactionTransferLists &&
      interaction.transferLists.interactionTransferLists.length > 0
    ) {
      return interaction.transferLists.interactionTransferLists;
    } else {
      return null;
    }
  }
);

const selectInterAssigNonVoiceTransListsLoadSt = createSelector(
  getSelectedInteraction,
  interaction => {
    let loadingState;
    if (interaction.transferLists) {
      ({ loadingState } = interaction.transferLists);
    }
    return loadingState;
  }
);

const selectInterTransListsVisibleStMap = state =>
  state.getIn([
    'agentDesktop',
    'interactionTransferListsVisibleState',
    'individualTransferLists',
  ]);

const selectInterAssigTransListsVisibleSt = createSelector(
  selectInterTransListsVisibleStMap,
  transferListsVisibleState => {
    if (transferListsVisibleState) {
      return transferListsVisibleState.toJS();
    } else {
      return null;
    }
  }
);

const selectInterAssigAllTransListsVisibleSt = state =>
  state.getIn([
    'agentDesktop',
    'interactionTransferListsVisibleState',
    'allTransferLists',
  ]);

const getIsConversationUnread = createSelector(
  getSelectedInteraction,
  interaction => interaction.conversationIsUnread
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
  selectAwaitingScript,
  selectIsEndWrapupDisabled,
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
  selectVoiceInteraction,
  selectVoiceFlowTransLists,
  selectNonVoiceFlowTransLists,
  selectInterAssigVoiceTransLists,
  selectInterAssigNonVoiceTransLists,
  selectInterAssigVoiceTransListsLoadSt,
  selectInterAssigNonVoiceTransListsLoadSt,
  selectInterAssigTransListsVisibleSt,
  selectInterAssigAllTransListsVisibleSt,
  getIsConversationUnread,
};
