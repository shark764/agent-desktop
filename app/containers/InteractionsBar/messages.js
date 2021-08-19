/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * InteractionsBar Messages
 *
 * This contains all the text for the InteractionsBar component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  newInteraction: {
    id: 'app.containers.InteractionsBar.newInteraction',
    defaultMessage: 'New Interaction',
  },
  pendingInteraction: {
    id: 'app.containers.InteractionsBar.pendingInteraction',
    defaultMessage: 'Pending Interaction',
  },
  unrespondedMessage: {
    id: 'app.containers.InteractionsBar.unrespondedMessage',
    defaultMessage: 'Unresponded Message',
  },
  currentCrmItemHistory: {
    id: 'app.containers.InteractionsBar.currentCrmItemHistory',
    defaultMessage: 'Search interaction history for:',
  },
  retrievingMessages: {
    id: 'app.containers.InteractionsBar.retrievingMessages',
    defaultMessage: 'Retrieving messages...',
  },
  formResponse: {
    id: 'app.containers.InteractionsBar.formResponse',
    defaultMessage: 'Form response',
  },
});
