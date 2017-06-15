/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * ContactBulkActions Messages
 *
 * This contains all the text for the ContactBulkActions component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  delete: {
    id: 'app.components.contactBulkActions.delete',
    defaultMessage: 'Delete',
  },
  deleteContact: {
    id: 'app.components.contactBulkActions.deleteContact',
    defaultMessage: 'Delete Contact?',
  },
  deleteContacts: {
    id: 'app.components.contactBulkActions.deleteContacts',
    defaultMessage: 'Delete {count} Contacts?',
  },
});
