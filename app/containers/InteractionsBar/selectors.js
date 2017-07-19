/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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

const selectActiveNonVoiceInteractions = createSelector(
  selectInteractions,
  (interactions) =>
    interactions
      .toJS()
      .filter(
        (interaction) =>
          (interaction.status === 'work-accepting' ||
            interaction.status === 'work-accepted' ||
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
    interactions
      .toJS()
      .find(
        (interaction) =>
          (interaction.status === 'work-accepting' ||
            interaction.status === 'work-accepted' ||
            interaction.status === 'wrapup' ||
            interaction.status === 'work-ended-pending-script') &&
          interaction.channelType === 'voice'
      )
);

const selectPendingActiveVoiceInteraction = createSelector(
  selectInteractions,
  (interactions) =>
    interactions
      .toJS()
      .find(
        (interaction) =>
          (interaction.status === 'initializing-outbound' ||
            interaction.status === 'connecting-to-outbound') &&
          interaction.channelType === 'voice'
      )
);

const selectPendingActiveSmsInteraction = createSelector(
  selectInteractions,
  (interactions) =>
    interactions
      .toJS()
      .find(
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
    interactions.toJS().filter(
      (interaction) =>
        // If it's not a voice/email interaction, make sure we have messageHistory before we show it.
        interaction.status === 'work-initiated' &&
        (interaction.autoAnswer === false || interaction.autoAnswer === null) &&
        (interaction.channelType === 'voice' ||
          interaction.channelType === 'email' ||
          interaction.messageHistory !== undefined)
    )
);

export {
  getSelectedInteractionId,
  selectActiveNonVoiceInteractions,
  selectActiveVoiceInteraction,
  selectPendingActiveVoiceInteraction,
  selectPendingActiveSmsInteraction,
  selectNewInteractionPanel,
  selectPendingInteractions,
};
