/*
 * Contact Messages
 *
 * This contains all the text for the SearchBar component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  saveBtn: {
    id: 'app.containers.Contact.save',
    defaultMessage: 'Save Changes',
  },
  cancelBtn: {
    id: 'app.containers.Contact.cancel',
    defaultMessage: 'Cancel',
  },
  warnNew: {
    id: 'app.containers.Contact.warningNew',
    defaultMessage: 'Abandon Record Creation?',
  },
  warnEdit: {
    id: 'app.containers.Contact.warningEdit',
    defaultMessage: 'Abandon Record Edit?',
  },
  errorRequired: {
    id: 'app.containers.Contact.errorRequired',
    defaultMessage: 'Required',
  },
  errorEmail: {
    id: 'app.containers.Contact.errorEmail',
    defaultMessage: 'Invalid Email',
  },
  errorPhone: {
    id: 'app.containers.Contact.errorPhone',
    defaultMessage: 'Invalid Phone Number',
  },
  assignButton: {
    id: 'app.containers.Contact.assignButton',
    defaultMessage: 'Assign',
  },
  editButton: {
    id: 'app.containers.Contact.editButton',
    defaultMessage: 'Edit',
  },
});
