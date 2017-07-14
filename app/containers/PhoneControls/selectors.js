/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');
const selectInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('interactions')
);

const selectActiveVoiceInteraction = createSelector(
  [selectInteractions],
  (interactions) => {
    const activeVoiceInteraction = interactions
      .toJS()
      .find(
        (interaction) =>
          (interaction.status === 'work-accepted' ||
            interaction.status === 'fatal') &&
          interaction.channelType === 'voice'
      );
    return activeVoiceInteraction;
  }
);

export { selectActiveVoiceInteraction };
