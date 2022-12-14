/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

export default [
  'cxengage/authentication/login-response', // Handled in Login component
  'cxengage/authentication/auth-info-response', // Handled in Login component
  'cxengage/authentication/cognito-auth-response', // Handled in Login component
  'cxengage/authentication/identity-window-response', // Handled in Login component
  'cxengage/authentication/update-default-tenant-response', // Ignore
  'cxengage/contacts/get-contact-response', // Handled in App callback
  'cxengage/entities/get-transfer-lists-response', // Handled in TransferMenu
  'cxengage/entities/get-user-response', // Handled in calls to CxEngage.entities.getUser
  'cxengage/logging/logs-saved', // Ignore
  'cxengage/interactions/accept-acknowledged', // Using cxengage/interactions/work-accepted instead
  'cxengage/interactions/end-acknowledged', // Using cxengage/interactions/work-ended instead
  'cxengage/interactions/email/attachment-received', // Handled in callback of cxengage/interactions/email/details-received
  'cxengage/interactions/flow-action-acknowledged', // Ignore
  'cxengage/interactions/messaging/initialize-outbound-sms-response', // Handled in MessagingContentArea saga
  'cxengage/interactions/messaging/send-outbound-sms-response', // Handled in MessagingContentArea saga
  'cxengage/interactions/messaging/send-message-acknowledged', // Using cxengage/messaging/new-message-received instead
  'cxengage/interactions/voice/phone-controls-response', // Using mute-started, mute-ended, etc. instead
  'cxengage/interactions/contact-assign-acknowledged', // Handled in InfoTab
  'cxengage/interactions/contact-unassign-acknowledged', // Handled in InfoTab
  'cxengage/interactions/voice/transfer-response', // Handled in TransferMenu
  'cxengage/entities/get-entity-response', // Handled by TransferMenu
  'cxengage/interactions/voice/recording-received', // Handled in historicalInteractionBody saga
  'cxengage/interactions/messaging/transcript-received', // Handled in historicalInteractionBody saga
  'cxengage/interactions/create-note-response', // Handled in ContentArea
  'cxengage/interactions/update-note-response', // Handled in ContentArea
  'cxengage/interactions/send-custom-interrupt-acknowledged', // Handled in ContentArea
  'cxengage/interactions/end-wrapup-acknowledged', // Ignore - comes with a work-ended.
  'cxengage/interactions/voice/send-digits-acknowledged', // Handled in Dialpad
  'cxengage/interactions/voice/cancel-dial-acknowledged', // Handled in cancelClickToDial saga in AgentDesktop
  'cxengage/interactions/get-notes-response', // Handled in contactInteractionHistory
  'cxengage/reporting/get-capacity-response', // Handled in TransferMenu
  'cxengage/reporting/get-stat-query-response', // Handled in TransferMenu
  'cxengage/entities/get-queues-response', // Handled in TransferMenu
  'cxengage/reporting/polling-started', // Ignore
  'cxengage/reporting/polling-stopped', // Ignore
  'cxengage/reporting/stat-subscription-added', // Handled by Toolbar
  'cxengage/reporting/bulk-stat-subscription-added', // Handled by Toolbar
  'cxengage/reporting/stat-subscription-removed', // Handled by Toolbar
  'cxengage/reporting/bulk-stat-subscription-removed', // Handled by Toolbar
  'cxengage/session/heartbeat-response', // Ignore
  'cxengage/session/get-tenant-details', // Handled in Login component
  'cxengage/session/set-active-tenant-response', // Handled in Login component
  'cxengage/session/state-change-request-acknowledged', // Ignore
  'cxengage/session/tenant-list', // Using tenants from login-response
  'cxengage/reporting/get-contact-interaction-history-response', // Handled in contactInteractionHistory saga
  'cxengage/reporting/get-crm-interactions-response', // Handled in loadCrmInteractions (AgentDesktop) saga
  'cxengage/contacts/search-contacts-response', // Handled in InfoTab & AgentDesktop callback
  'cxengage/contacts/create-contact-response', // Handled in ContactEdit
  'cxengage/contacts/update-contact-response', // Handled in ContactEdit
  'cxengage/contacts/delete-contact-response', // Handled in InfoTab
  'cxengage/contacts/merge-contacts-response', // Handled in ContactMerge
  'cxengage/interactions/email/start-outbound-email', // Handled in EmailContentArea saga
  'cxengage/logging/error', // Handled in App container index
  'cxengage/interactions/email/agent-reply-started-acknowledged', // Ignore
  'cxengage/interactions/email/agent-cancel-reply-acknowledged', // Ignore
  'cxengage/interactions/email/agent-no-reply-acknowledged', // Ignore
  'cxengage/zendesk/set-dimensions-response', // Ignore
  'cxengage/salesforce-classic/set-dimensions-response', // Ignore
  'cxengage/salesforce-classic/set-visibility-response', // Ignore
  'cxengage/salesforce-lightning/set-dimensions-response', // Ignore
  'cxengage/salesforce-lightning/is-visible-response', // Ignore
  'cxengage/interactions/smooch-messaging/typing-agent-received', // Ignore
  'cxengage/interactions/smooch-messaging/conversation-read-agent-received', // Ignore
  'cxengage/interactions/smooch-messaging/attachment-added', // Ignore
  'cxengage/interactions/smooch-messaging/attachment-removed', // Ignore
];
