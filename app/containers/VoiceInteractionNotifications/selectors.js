/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { selectInteractionsList } from 'containers/AgentDesktop/selectors';

export const selectActiveVoiceInteraction = createSelector(
  [selectInteractionsList],
  interactions =>
    interactions.find(interaction => {
      const status = interaction.get('status');
      return (
        interaction.get('channelType') === 'voice' &&
        (status === 'work-initiated' ||
          status === 'work-accepting' ||
          status === 'work-accepted')
      );
    })
);

export const selectActiveVoiceInteractionId = createSelector(
  selectActiveVoiceInteraction,
  activeVoiceInteraction => {
    if (activeVoiceInteraction) {
      return activeVoiceInteraction.get('interactionId');
    }
    return undefined;
  }
);

export const selectActiveVoiceInteractionNotifications = createSelector(
  selectActiveVoiceInteraction,
  activeVoiceInteraction => {
    if (activeVoiceInteraction) {
      return activeVoiceInteraction
        .get('notifications')
        .filter(notification => notification.get('messageKey'));
    }
    return undefined;
  }
);
