import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectIsAgentReady = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('presence') === 'ready'
);

export {
  selectIsAgentReady,
};
