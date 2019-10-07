import { createSelector } from 'reselect';

import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

export const isMessagingInteractionCopied = createSelector(
  getSelectedInteraction,
  interaction => interaction.isCopied
);

export const customerIsTyping = state => {
  const selectedInteraction = getSelectedInteraction(state);
  return selectedInteraction && selectedInteraction.customerIsTyping;
};

export const customerHasReadLastAgentMessage = state => {
  const selectedInteraction = getSelectedInteraction(state);
  return (
    selectedInteraction && selectedInteraction.customerHasReadLastAgentMessage
  );
};
