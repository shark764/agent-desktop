import { fromJS } from 'immutable';

import { selectHasViewStatsPermission } from '../selectors';

const getCurrentTenantPermissions = {
  login: {
    agent: {
      tenants: [
        {
          tenantId: '1',
          tenantPermissions: ['AGENT_EXPERIENCE_METRICS_VIEW'],
        },
        {
          tenantId: '2',
          tenantPermissions: ['BOGUS_PERMISSON'],
        },
      ],
    },
    tenant: {
      id: '',
    },
  },
};

describe('selectHasViewStatsPermission selector', () => {
  describe('when selecting a tenant with correct permissions', () => {
    it('should return true', () => {
      getCurrentTenantPermissions.login.tenant.id = '1';
      expect(
        selectHasViewStatsPermission(fromJS(getCurrentTenantPermissions))
      ).toBe(true);
    });
  });
  describe('when selecting a tenant with incorrect permission', () => {
    it('should return false', () => {
      getCurrentTenantPermissions.login.tenant.id = '2';
      expect(
        selectHasViewStatsPermission(fromJS(getCurrentTenantPermissions))
      ).toBe(false);
    });
  });
});
