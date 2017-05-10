/*
 * ContactsControl Messages
 *
 * This contains all the text for the ContactsControl component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  edit: {
    id: 'app.containers.ContactControl.edit',
    defaultMessage: 'Edit',
  },
  filtersList: {
    id: 'app.containers.ContactControl.filtersList',
    defaultMessage: '(name, email address, mailing address, phone number, organization, customer number)',
  },
  searchText: {
    id: 'app.containers.ContactControl.searchCRM',
    defaultMessage: 'Search the CRM database',
  },
  newRecord: {
    id: 'app.containers.ContactControl.newRecord',
    defaultMessage: 'Create New Record',
  },
  or: {
    id: 'app.containers.ContactControl.or',
    defaultMessage: 'OR',
  },
  loading: {
    id: 'app.containers.ContactControl.loading',
    defaultMessage: 'Loading...',
  },
  newContactBanner: {
    id: 'app.containers.ContactControl.newContact',
    defaultMessage: 'New Customer Record',
  },
  contactEditingBanner: {
    id: 'app.containers.SidePanel.editing',
    defaultMessage: 'Editing Customer Record',
  },
  delete: {
    id: 'app.containers.ContactControl.delete',
    defaultMessage: 'Delete',
  },
  deleteContact: {
    id: 'app.containers.ContactControl.deleteContact',
    defaultMessage: 'Delete Contact?',
  },
  deleteContacts: {
    id: 'app.containers.ContactControl.deleteContacts',
    defaultMessage: 'Delete {count} Contacts?',
  },
});
