/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * ContactInteractionHistory Messages
 *
 * This contains all the text for the ContactInteractionHistory component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  customerSatisfaction: {
    id: 'app.containers.ContactInteractionHistory.customerSatisfaction',
    defaultMessage: 'Customer Satisfaction',
  },
  minutes: {
    id: 'app.containers.ContactInteractionHistory.minutes',
    defaultMessage: 'minutes',
  },
  seconds: {
    id: 'app.containers.ContactInteractionHistory.seconds',
    defaultMessage: 'seconds',
  },
  audioRecording: {
    id: 'app.containers.ContactInteractionHistory.audioRecording',
    defaultMessage: 'Audio Recording',
  },
  noRecordings: {
    id: 'app.containers.ContactInteractionHistory.noRecordings',
    defaultMessage: 'No recordings (processing can take up to 10 minutes).',
  },
  transcript: {
    id: 'app.containers.ContactInteractionHistory.transcript',
    defaultMessage: 'Transcript',
  },
  noTranscript: {
    id: 'app.containers.ContactInteractionHistory.noTranscript',
    defaultMessage: 'No Transcript Currently Available',
  },
});