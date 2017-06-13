/*
 * ContactsSearch Messages
 *
 * This contains all the text for the ContactsSearch component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  searchText: {
    id: 'app.containers.ContactsSearch.searchCRM',
    defaultMessage: 'Search the CRM database',
  },
  filtersList: {
    id: 'app.containers.ContactsSearch.filtersList',
    defaultMessage: '(name, email address, mailing address, phone number, organization, customer number)',
  },
  or: {
    id: 'app.containers.ContactsSearch.or',
    defaultMessage: 'OR',
  },
  noRecords: {
    id: 'app.containers.ContactsSearch.noRecords',
    defaultMessage: 'No records found',
  },
  call: {
    id: 'app.containers.ContactsSearch.call',
    defaultMessage: 'CALL',
  },
  sms: {
    id: 'app.containers.ContactsSearch.sms',
    defaultMessage: 'SMS',
  },
});
