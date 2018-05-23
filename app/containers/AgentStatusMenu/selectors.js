/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectHasActiveInteractions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .get('interactions')
      .find(
        (interaction) =>
          interaction.get('status') === 'work-accepting' ||
          interaction.get('status') === 'work-accepted'
      ) !== undefined
);

const selectExtensions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('extensions').toJS()
);

const selectActiveExtension = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('activeExtension').toJS()
);

const selectHasActiveWrapup = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .get('interactions')
      .find((interaction) => interaction.get('status') === 'wrapup') !==
    undefined
);

const selectHasActiveScript = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .get('interactions')
      .find((interaction) => interaction.get('script') !== undefined) !==
    undefined
);

const selectPresenceReasonLists = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .getIn(['presenceReasonLists'])
      .filter((list) => list.get('name') !== 'System Presence Reasons')
      .toJS()
);

const selectSelectedPresenceReason = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('presenceReason').toJS()
);

const selectAgentDirection = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('agentDirection').toJS()
);

export {
  selectHasActiveInteractions,
  selectExtensions,
  selectActiveExtension,
  selectHasActiveWrapup,
  selectHasActiveScript,
  selectPresenceReasonLists,
  selectSelectedPresenceReason,
  selectAgentDirection,
};
