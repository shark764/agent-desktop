/**
  CXV1-11408
  There was work done to be able to handle when user logs into Skylight without CRM permissions, it will show everything without the Skylight CRM.
  This work was reverted - a user must have the CRM permissions to log into Skylight (non-toolbar); however, the code structure was still left if
  we want to re-implement this later.
*/

export const requiredPermissions = ['ARTIFACTS_CREATE_ALL'];

export const crmPermissions = [
  'CONTACTS_CREATE',
  'CONTACTS_UPDATE',
  'CONTACTS_READ',
  'CONTACTS_ATTRIBUTES_READ',
  'CONTACTS_LAYOUTS_READ',
  'CONTACTS_ASSIGN_INTERACTION',
  'CONTACTS_INTERACTION_HISTORY_READ',
];
