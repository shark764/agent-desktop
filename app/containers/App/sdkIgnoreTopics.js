export default [
  'cxengage/authentication/login-response', // Handled in Login component
  'cxengage/entities/get-users-response', // Handled in TransferMenu
  'cxengage/entities/get-transfer-lists-response', // Handled in TransferMenu
  'cxengage/interactions/accept-acknowledged', // Using cxengage/interactions/work-accepted instead
  'cxengage/interactions/end-acknowledged', // Using cxengage/interactions/work-ended instead
  'cxengage/interactions/email/attachment-received', // Handled in callback of cxengage/interactions/email/details-received
  'cxengage/interactions/messaging/initialize-outbound-sms-response', // Handled in MessagingContentArea saga
  'cxengage/interactions/messaging/send-outbound-sms-response', // Handled in MessagingContentArea saga
  'cxengage/interactions/messaging/send-message-acknowledged', // Using cxengage/messaging/new-message-received instead
  'cxengage/interactions/voice/phone-controls-response', // Using mute-started, mute-ended, etc. instead
  'cxengage/interactions/contact-assign-acknowledged', // Handled in InfoTab
  'cxengage/interactions/voice/transfer-response', // Handled in TransferMenu
  'cxengage/interactions/contact-unassigned-acknowledged', // Handled in InfoTab
  'cxengage/interactions/contact-assigned-acknowledged', // Handled in InfoTab
  'cxengage/interactions/voice/recording-received', // Handled in historicalInteractionBody saga
  'cxengage/interactions/messaging/transcript-received', // Handled in historicalInteractionBody saga
  'cxengage/interactions/create-note-response', // Handled in ContentArea
  'cxengage/interactions/update-note-response', // Handled in ContentArea
  'cxengage/interactions/end-wrapup-acknowledged', // Ignore - comes with a work-ended.
  'cxengage/interactions/voice/send-digits-acknowledged', // Handled in Dialpad
  'cxengage/interactions/get-notes-response', // Handled in contactInteractionHistory
  'cxengage/reporting/get-capacity-response', // Handled in TransferMenu
  'cxengage/reporting/get-stat-query-response', // Handled in TransferMenu
  'cxengage/reporting/polling-started', // Ignore
  'cxengage/reporting/polling-stopped', // Ignore
  'cxengage/reporting/stat-subscription-added', // Handled by Toolbar
  'cxengage/reporting/stat-subscription-removed', // Handled by Toolbar
  'cxengage/session/heartbeat-response', // Ignore
  'cxengage/session/set-active-tenant-response', // Handled in Login component
  'cxengage/session/state-change-request-acknowledged', // Ignore
  'cxengage/session/tenant-list', // Using tenants from login-response
  'cxengage/reporting/get-contact-interaction-history-response', // Handled in contactInteractionHistory saga
  'cxengage/contacts/search-contacts-response', // Handled in InfoTab & AgentDesktop callback
  'cxengage/contacts/create-contact-response', // Handled in Contact
  'cxengage/contacts/delete-contact-response', // Handled in InfoTab
  'cxengage/contacts/merge-contacts-response', // Handled in ContactMerge
];
