/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { getCurrentTenantPermissions } from 'containers/App/selectors';

export const selectHasViewStatsPermission = createSelector(
  [getCurrentTenantPermissions],
  (tenantPermissions) =>
    tenantPermissions.includes('AGENT_EXPERIENCE_METRICS_VIEW')
);
