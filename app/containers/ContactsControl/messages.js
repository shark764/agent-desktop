/*
 * ContactsControl Messages
 *
 * This contains all the text for the ContactsControl component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  searchText: {
    id: 'app.containers.ContactsControl.searchCRM',
    defaultMessage: 'Search the CRM database',
  },
  filtersList: {
    id: 'app.containers.ContactsControl.filtersList',
    defaultMessage: '(name, email address, mailing address, phone number, organization, customer number)',
  },
  or: {
    id: 'app.containers.ContactsControl.or',
    defaultMessage: 'OR',
  },
  noRecords: {
    id: 'app.containers.ContactsControl.noRecords',
    defaultMessage: 'No records found',
  },
  call: {
    id: 'app.containers.ContactsControl.call',
    defaultMessage: 'CALL',
  },
  sms: {
    id: 'app.containers.ContactsControl.sms',
    defaultMessage: 'SMS',
  },
  errorRequired: {
    id: 'app.containers.ContactsControl.errorRequired',
    defaultMessage: 'Required',
  },
  errorEmail: {
    id: 'app.containers.ContactsControl.errorEmail',
    defaultMessage: 'Invalid Email',
  },
  errorPhone: {
    id: 'app.containers.ContactsControl.errorPhone',
    defaultMessage: 'Invalid Phone Number',
  },
  errorLink: {
    id: 'app.containers.ContactsControl.errorLink',
    defaultMessage: 'Invalid URL',
  },
  errorNumber: {
    id: 'app.containers.ContactsControl.errorNumber',
    defaultMessage: 'Invalid Number',
  },
});
