/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import { selectHasCrmPermissions } from '../selectors';

const mockState = {
  login: {
    agent: {
      tenants: [
        {
          tenantId: 'NO_CRM',
          tenantPermissions: ['INCORRECT_PERMISSIONS'],
        },
        {
          tenantId: 'CRM_ENABLED',
          tenantPermissions: [
            'ARTIFACTS_CREATE_ALL',
            'CONTACTS_CREATE',
            'CONTACTS_UPDATE',
            'CONTACTS_READ',
            'CONTACTS_ATTRIBUTES_READ',
            'CONTACTS_LAYOUTS_READ',
            'CONTACTS_ASSIGN_INTERACTION',
            'CONTACTS_INTERACTION_HISTORY_READ',
          ],
        },
      ],
    },
    tenant: {
      id: '',
    },
  },
};

describe('selectHasCrmPermissions selector', () => {
  describe('when selecting a tenant with incorrect permissions', () => {
    it('should return false', () => {
      mockState.login.tenant.id = 'NO_CRM';
      expect(selectHasCrmPermissions(fromJS(mockState))).toBe(false);
    });
  });
  describe('when selecting a tenant with all crm permissions', () => {
    it('should return true', () => {
      mockState.login.tenant.id = 'CRM_ENABLED';
      expect(selectHasCrmPermissions(fromJS(mockState))).toBe(true);
    });
  });
});
