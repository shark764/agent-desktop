/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { crmPermissions } from './permissions';

const agentTenantListSelector = (state) =>
  state
    .get('login')
    .get('agent')
    .get('tenants');
const selectedTenantSelector = (state) => state.get('login').get('tenant');

const getCurrentTenantPermissions = createSelector(
  agentTenantListSelector,
  selectedTenantSelector,
  (agentTenantsList, selectedTenant) => {
    const currentTenant = agentTenantsList.find(
      (tenant) => tenant.get('tenantId') === selectedTenant.get('id')
    );

    if (currentTenant) {
      return currentTenant.get('tenantPermissions');
    } else {
      return [];
    }
  }
);

const selectHasCrmPermissions = createSelector(
  getCurrentTenantPermissions,
  (currentTenantPermissions) =>
    crmPermissions.every((permission) =>
      currentTenantPermissions.includes(permission)
    )
);

export { selectHasCrmPermissions };
