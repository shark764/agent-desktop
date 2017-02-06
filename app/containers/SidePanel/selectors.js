import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const getSelectedInteractionId = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('selectedInteractionId')
);

export {
  getSelectedInteractionId,
};
