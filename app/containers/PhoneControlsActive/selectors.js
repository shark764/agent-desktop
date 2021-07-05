/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';
import { selectActiveVoiceInteraction } from 'containers/VoiceInteractionNotifications/selectors';

export const selectActiveExtensionIsNotPstn = createSelector(
  selectActiveExtension,
  (activeExtension) => activeExtension.type !== 'pstn'
);

export const isCustomerNotConnected = createSelector(
  selectActiveVoiceInteraction,
  (activeVoiceInteraction) =>
    activeVoiceInteraction &&
    (activeVoiceInteraction.get('isCallbackInteraction') ||
      activeVoiceInteraction.get('direction') === 'outbound' ||
      activeVoiceInteraction.get('direction') === 'agent-initiated') &&
    !activeVoiceInteraction.get('customerConnected')
);
