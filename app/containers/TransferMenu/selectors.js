import { createSelector } from 'reselect';

const selectLoginDomain = (state) => state.get('login');
const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectAgentId = createSelector(
  selectLoginDomain,
  (login) => login.get('agent').get('userId')
);

const selectWarmTransfers = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop.get('interactions').find((interaction) =>
      interaction.get('channelType') === 'voice'
    ).get('warmTransfers').toJS()
);

export {
  selectAgentId,
  selectWarmTransfers,
};
