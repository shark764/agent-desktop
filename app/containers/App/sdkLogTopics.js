/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

export default [
  'cxengage/interactions/email/artifact-received', // Do nothing for this case
  'cxengage/interactions/email/send-reply', // Just using work-ended
  'cxengage/interactions/voice/customer-transfer-acknowledged', // Just using cxengage/interactions/voice/transfer-connected
  'cxengage/interactions/voice/dial-send-acknowledged', // Just using cxengage/interactions/work-offer-received
  'cxengage/interactions/voice/start-recording-acknowledged', // Just using cxengage/interactions/voice/recording-start-received
  'cxengage/interactions/voice/stop-recording-acknowledged', // Just using cxengage/interactions/voice/recording-end-received
  'cxengage/interactions/voice/mute-acknowledged', // Just using cxengage/interactions/voice/resource-mute-received
  'cxengage/interactions/voice/unmute-acknowledged', // Just using cxengage/interactions/voice/resource-unmute-received
  'cxengage/interactions/voice/resume-acknowledged', // Just using cxengage/interactions/voice/customer-resume-received
  'cxengage/interactions/voice/hold-acknowledged', // Just using cxengage/interactions/voice/customer-hold-received
  'cxengage/interactions/voice/resource-hold-acknowledged', // Just using cxengage/interactions/voice/resource-hold-received
  'cxengage/interactions/voice/resource-resume-acknowledged', // Just using cxengage/interactions/voice/resource-resume-received
  'cxengage/zendesk/search-and-pop-no-results-received', // Do nothing for this case
  'cxengage/interactions/focus-acknowledged', // Do nothing for this case
  'cxengage/interactions/unfocus-acknowledged', // Do nothing for this case
  'cxengage/interactions/voice/customer-hold-error', // Handling this on the error saga
  'cxengage/interactions/voice/customer-resume-error', // Handling this one on the error saga
  'cxengage/entities/get-user-outbound-identifier-lists-response', // Do nothing for this case
  'cxengage/interactions/email/attachment-removed', // Do nothing for this case
  'cxengage/entities/get-recordings-response', // Handled by saga
];
