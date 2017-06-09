/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * ContactsControl Messages
 *
 * This contains all the text for the ContactsControl component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
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
