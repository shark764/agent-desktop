import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectHasActiveInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('interactions').find((interaction) =>
      interaction.get('status') === 'work-accepting' || interaction.get('status') === 'work-accepted'
    ) !== undefined
);

const selectExtensions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('extensions').toJS()
);

const selectActiveExtension = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('activeExtension').toJS()
);

const selectHasActiveWrapup = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('interactions').find((interaction) =>
      interaction.get('status') === 'wrapup'
    ) !== undefined
    );
const selectPresenceReasonLists = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.getIn(['presenceReasonLists']).toJS()
);

const selectSelectedPresenceReason = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('selectedPresenceReason').toJS()
);

export {
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
  selectHasActiveWrapup,
  selectPresenceReasonLists,
  selectSelectedPresenceReason,
};
