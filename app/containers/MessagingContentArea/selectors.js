import { createSelector } from 'reselect';

import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

export const isMessagingInteractionCopied = createSelector(
  getSelectedInteraction,
  (interaction) => interaction.isCopied
);
