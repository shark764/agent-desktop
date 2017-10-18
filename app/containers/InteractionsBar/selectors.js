/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions').toJS()
);
const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

const selectActiveNonVoiceInteractions = createSelector(
  selectInteractions,
  (interactions) =>
    interactions.filter(
      (interaction) =>
        (interaction.status === 'work-accepting' ||
          interaction.status === 'work-accepted' ||
          interaction.status === 'end-requested' ||
          interaction.status === 'wrapup' ||
          interaction.status === 'work-ended-pending-script' ||
          interaction.status === 'creating-new-interaction' ||
          interaction.status === 'connecting-to-outbound' ||
          interaction.status === 'initializing-outbound' ||
          interaction.status === 'initialized-outbound' ||
          interaction.isScriptOnly === true) &&
        interaction.channelType !== 'voice'
    )
);

const selectActiveVoiceInteraction = createSelector(
  selectInteractions,
  (interactions) =>
    interactions.find(
      (interaction) =>
        (interaction.status === 'work-accepting' ||
          interaction.status === 'work-accepted' ||
          interaction.status === 'end-requested' ||
          interaction.status === 'wrapup' ||
          interaction.status === 'work-ended-pending-script') &&
        interaction.channelType === 'voice'
    )
);

const selectHasInteractions = createSelector(
  selectInteractions,
  (interactions) => interactions.length > 0
);

const selectPendingActiveVoiceInteraction = createSelector(
  selectInteractions,
  (interactions) =>
    interactions.find(
      (interaction) =>
        (interaction.status === 'initializing-outbound' ||
          interaction.status === 'connecting-to-outbound') &&
        interaction.channelType === 'voice'
    )
);

const selectPendingActiveSmsInteraction = createSelector(
  selectInteractions,
  (interactions) =>
    interactions.find(
      (interaction) =>
        (interaction.status === 'initializing-outbound' ||
          interaction.status === 'connecting-to-outbound') &&
        interaction.channelType === 'sms'
    )
);

const selectNewInteractionPanel = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('newInteractionPanel').toJS()
);

const selectPendingInteractions = createSelector(
  selectInteractions,
  (interactions) =>
    interactions.filter(
      (interaction) =>
        // If it's not a voice/email interaction, make sure we have messageHistory before we show it.
        interaction.status === 'work-initiated' &&
        (interaction.autoAnswer === false || interaction.autoAnswer === null) &&
        (interaction.channelType === 'voice' ||
          interaction.channelType === 'email' ||
          interaction.channelType === 'work-item' ||
          interaction.messageHistory !== undefined)
    )
);

const selectShowCollapseButton = createSelector(
  [selectPendingInteractions, selectInteractions],
  (pendingInteractions, interactions) =>
    !pendingInteractions.length && interactions.length < 2
);

export {
  getSelectedInteractionId,
  selectActiveNonVoiceInteractions,
  selectActiveVoiceInteraction,
  selectHasInteractions,
  selectPendingActiveVoiceInteraction,
  selectPendingActiveSmsInteraction,
  selectNewInteractionPanel,
  selectPendingInteractions,
  selectShowCollapseButton,
};
