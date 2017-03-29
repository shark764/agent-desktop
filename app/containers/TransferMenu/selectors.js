import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectWarmTransfers = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('interactions').find((interaction) =>
      interaction.get('channelType') === 'voice'
    ).get('warmTransfers').toJS()
);

export {
  selectWarmTransfers,
};
