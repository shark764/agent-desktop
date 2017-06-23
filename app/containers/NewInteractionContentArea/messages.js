/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * NewInteractionContentArea Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  search: {
    id: 'app.containers.NewInteractionContentArea.search',
    defaultMessage: 'Search',
  },
  cancel: {
    id: 'app.containers.NewInteractionContentArea.cancel',
    defaultMessage: 'Cancel',
  },
  instructionsTitle: {
    id: 'app.containers.NewInteractionContentArea.instructionsTitle',
    defaultMessage: 'Search the CRM database',
  },
  instructions: {
    id: 'app.containers.NewInteractionContentArea.instructions',
    defaultMessage:
      'Enter a valid phone number to search. If a contact is not found, you may call or SMS that number.',
  },
  searchError: {
    id: 'app.containers.NewInteractionContentArea.searchError',
    defaultMessage:
      'An error occurred with the search. Please try again. If the problem persists, contact your administrator.',
  },
  noRecords: {
    id: 'app.containers.NewInteractionContentArea.noRecords',
    defaultMessage: 'No records found',
  },
  call: {
    id: 'app.containers.NewInteractionContentArea.call',
    defaultMessage: 'CALL',
  },
  sms: {
    id: 'app.containers.NewInteractionContentArea.sms',
    defaultMessage: 'SMS',
  },
});
