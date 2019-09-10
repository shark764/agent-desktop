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
  defaultParticipantType: {
    id: 'app.containers.ContactInteractionHistory.defaultParticipantType',
    defaultMessage: 'Customer',
  },
  recordingTitle: {
    id: 'app.containers.ContactInteractionHistory.recordingTitle',
    defaultMessage: '{participantType} Recording{participantIdentifier}',
  },
  recordingStart: {
    id: 'app.containers.ContactInteractionHistory.recordingStart',
    defaultMessage: 'Start Time: {recordingStartTime}',
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
  noNotesBody: {
    id: 'app.containers.ContactInteractionHistory.noNotesBody',
    defaultMessage: 'notes body not written',
  },
  noNotesTitle: {
    id: 'app.containers.ContactInteractionHistory.noNotesTitle',
    defaultMessage: 'notes title not written',
  },
  noDisposition: {
    id: 'app.containers.ContactInteractionHistory.noDisposition',
    defaultMessage: 'Disposition not selected',
  },
});
