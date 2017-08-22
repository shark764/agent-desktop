/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * InfoTab Messages
 *
 * This contains all the text for the InfoTab component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  crmUnavailableTitle: {
    id: 'app.containers.InfoTab.crmUnavailableTitle',
    defaultMessage: 'CRM Unavailable',
  },
  crmUnavailableGeneral: {
    id: 'app.containers.InfoTab.crmUnavailableGeneral',
    defaultMessage: 'The contact management functionality is unavailable.',
  },
  crmUnavailableLayout: {
    id: 'app.containers.InfoTab.crmUnavailableLayout',
    defaultMessage:
      'Failed to load a valid contact layout, check tenant config.',
  },
  crmUnavailableAttribute: {
    id: 'app.containers.InfoTab.crmUnavailableAttribute',
    defaultMessage: 'No contact attributes found, check tenant config.',
  },
  newRecord: {
    id: 'app.containers.InfoTab.newRecord',
    defaultMessage: 'Create New Record',
  },
  loading: {
    id: 'app.containers.InfoTab.loading',
    defaultMessage: 'Loading...',
  },
  created: {
    id: 'app.components.InfoTab.created',
    defaultMessage: 'Contact created.',
  },
  saved: {
    id: 'app.components.InfoTab.saved',
    defaultMessage: 'Changes saved.',
  },
  merged: {
    id: 'app.components.InfoTab.merged',
    defaultMessage: 'Contacts Merged.',
  },
  assigned: {
    id: 'app.components.InfoTab.assigned',
    defaultMessage: 'Interaction assigned to contact.',
  },
  deleted: {
    id: 'app.components.InfoTab.deleted',
    defaultMessage: 'Contact deleted.',
  },
  deletedMultiple: {
    id: 'app.components.InfoTab.deletedMultiple',
    defaultMessage: 'Contacts deleted.',
  },
  notSaved: {
    id: 'app.containers.InfoTab.notSaved',
    defaultMessage: 'Your changes have not been saved.',
  },
  notDeleted: {
    id: 'app.containers.InfoTab.notDeleted',
    defaultMessage: 'Contact deletion failed.',
  },
  notDeletedMultiple: {
    id: 'app.containers.InfoTab.notDeletedMultiple',
    defaultMessage: 'Selected contacts were not deleted.',
  },
  notCreated: {
    id: 'app.containers.InfoTab.notCreated',
    defaultMessage: 'Your new contact has not been created.',
  },
  notAssigned: {
    id: 'app.containers.InfoTab.notAssigned',
    defaultMessage: 'Contact was not assigned to the interaction.',
  },
  notMerged: {
    id: 'app.containers.InfoTab.notMerged',
    defaultMessage: 'Contact merge failed.',
  },
  serverError: {
    id: 'app.containers.InfoTab.serverError',
    defaultMessage: 'Server Error',
  },
  networkError: {
    id: 'app.containers.InfoTab.networkError',
    defaultMessage: 'Network Error',
  },
  contactLayoutMissingLocaleTranslations: {
    id: 'app.containers.InfoTab.contactLayoutMissingLocaleTranslations',
    defaultMessage: 'There are missing translations for the contact layout',
  },
});
