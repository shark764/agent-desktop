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
const selectPresenceReasons = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.getIn(['presenceReasonList', 'reasons']).toJS()
);

export {
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
  selectHasActiveWrapup,
  selectPresenceReasons,
};
