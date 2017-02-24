import { createSelector } from 'reselect';

const selectAgentStatusMenuDomain = () => (state) => state.get('agentStatusMenu');
const selectAgentStatusMenu = () => createSelector(
  selectAgentStatusMenuDomain(),
  (substate) => substate.toJS()
);

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

export default selectAgentStatusMenu;
export {
  selectAgentStatusMenuDomain,
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
};
