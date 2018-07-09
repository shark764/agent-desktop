/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { getCurrentTenantPermissions } from 'containers/App/selectors';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

export const selectHasActiveInteractions = createSelector(
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

export const selectExtensions = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('extensions').toJS()
);

export const selectActiveExtension = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('activeExtension').toJS()
);

export const selectHasActiveWrapup = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .get('interactions')
      .find((interaction) => interaction.get('status') === 'wrapup') !==
    undefined
);

export const selectHasActiveScript = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .get('interactions')
      .find((interaction) => interaction.get('script') !== undefined) !==
    undefined
);

export const selectPresenceReasonLists = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) =>
    agentDesktop
      .getIn(['presenceReasonLists'])
      .filter((list) => list.get('name') !== 'System Presence Reasons')
      .toJS()
);

export const selectSelectedPresenceReason = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('presenceReason').toJS()
);

export const selectAgentDirection = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('agentDirection').toJS()
);

export const selectHasDirectionChangePermission = createSelector(
  [getCurrentTenantPermissions],
  (tenantPermissions) =>
    tenantPermissions.includes('MANAGE_ALL_USERS_DIRECTION') ||
    tenantPermissions.includes('MANAGE_MY_DIRECTION')
);

export const selectIsSelectedDirection = (state, props) =>
  selectAgentDesktopDomain(state).getIn(['agentDirection', 'direction']) ===
  props.direction;
