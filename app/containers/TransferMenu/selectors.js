/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectWarmTransfers = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => {
    if (agentDesktop.interactions !== undefined) {
      return agentDesktop
        .get('interactions')
        .find((interaction) => interaction.get('channelType') === 'voice')
        .get('warmTransfers')
        .toJS();
    } else {
      return null;
    }
  }
);

const selectQueues = createSelector(selectAgentDesktopDomain, (agentDesktop) =>
  agentDesktop.get('queues').toJS()
);

export { selectWarmTransfers, selectQueues };
