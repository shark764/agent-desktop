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
});
