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
  nameFilter: {
    id: 'app.containers.ContactSearchBar.nameFilter',
    defaultMessage: 'Name',
  },
  mobileFilter: {
    id: 'app.containers.ContactSearchBar.mobileFilter',
    defaultMessage: 'Phone',
  },
  emailFilter: {
    id: 'app.containers.ContactSearchBar.emailFilter',
    defaultMessage: 'Email',
  },
  addressFilter: {
    id: 'app.containers.ContactSearchBar.addressFilter',
    defaultMessage: 'Address',
  },
  organizationFilter: {
    id: 'app.containers.ContactSearchBar.organizationFilter',
    defaultMessage: 'Organization',
  },
  qFilter: {
    id: 'app.containers.ContactSearchBar.qFilter',
    defaultMessage: 'All',
  },
});
