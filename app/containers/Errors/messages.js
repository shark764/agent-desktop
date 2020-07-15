/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * Error Messages
 *
 * This contains all the text for the Errors component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  default: {
    id: 'app.containers.Errors.default',
    defaultMessage:
      'An unknown error has occurred. Please try to finish your work as you may need to refresh the page to continue.',
  },
  code: {
    id: 'app.containers.Errors.code',
    defaultMessage: ' (Code: {code})',
  },
  errorDescription: {
    id: 'app.containers.Errors.errorDescription',
    defaultMessage: ' Error Description: {errorDescription}',
  },
  'AD-1000': {
    id: 'app.containers.Errors.AD-1000',
    defaultMessage: 'No presence reason lists were found for this tenant.',
  },
  'AD-1001': {
    id: 'app.containers.Errors.AD-1001',
    defaultMessage: 'No extensions were found for this user.',
  },
  'AD-1002': {
    id: 'app.containers.Errors.AD-1002',
    defaultMessage: 'The username or password you have entered is not correct.',
  },
  'AD-1003': {
    id: 'app.containers.Errors.AD-1003',
    defaultMessage: 'You must first select a tenant.',
  },
  'AD-1004': {
    id: 'app.containers.Errors.AD-1004',
    defaultMessage: 'You have insufficient permissions to access tenant.',
  },
  'AD-1005': {
    id: 'app.containers.Errors.AD-1005',
    defaultMessage:
      'This account is not currently associated with an active tenant. Please reach out to your system administrator for assistance.',
  },
  'AD-1006': {
    id: 'app.containers.Errors.AD-1006',
    defaultMessage:
      'You must allow notifications through your browser to enable visual notifications.',
  },
  'AD-1007': {
    id: 'app.containers.Errors.AD-1007',
    defaultMessage: 'Failed to copy the chat transcript',
  },
  /**
   * context :general
   */
  1000: {
    id: 'app.containers.Errors.1000',
    defaultMessage:
      'Invalid SDK initialization options provided. Verify your values against the SDK documentation.',
  },
  1001: {
    id: 'app.containers.Errors.1001',
    defaultMessage:
      'Incorrect number of arguments provided to SDK initialization. Verify your values against the SDK documentation.',
  },
  1002: {
    id: 'app.containers.Errors.1002',
    defaultMessage:
      'A required SDK module failed to start, unable to initialize the SDK.',
  },
  1003: {
    id: 'app.containers.Errors.1003',
    defaultMessage:
      'The parameters object passed to the SDK function did not adhere to the spec defined. Verify your values against the SDK documentation.',
  },
  1004: {
    id: 'app.containers.Errors.1004',
    defaultMessage:
      'Incorrect number of arguments passed to SDK function. All SDK functions support up to 2 arguments; the first being the parameters map, the second being an optional callback. Verify your values against the SDK documentation.',
  },
  1005: {
    id: 'app.containers.Errors.1005',
    defaultMessage:
      'Received an unknown agent notification type. Unable to parse agent notification.',
  },
  /**
   * context :session
   */
  2000: {
    id: 'app.containers.Errors.2000',
    defaultMessage:
      'You lack sufficient permissions in order to perform this action.',
  },
  2001: {
    id: 'app.containers.Errors.2001',
    defaultMessage: 'Failed to get user configuration. Please try again.',
  },
  2002: {
    id: 'app.containers.Errors.2002',
    defaultMessage:
      'Failed to start an agent session. The server returned an error.',
  },
  2003: {
    id: 'app.containers.Errors.2003',
    defaultMessage:
      'Session Expired. If this persists, please check your internet connection and ensure you are not logged in elsewhere.',
  },
  2004: {
    id: 'app.containers.Errors.2004',
    defaultMessage:
      'Failed to change agent state. The server returned an error.',
  },
  2005: {
    id: 'app.containers.Errors.2005',
    defaultMessage:
      'The extension selected is no longer valid. Please select a new extension.',
  },
  2006: {
    id: 'app.containers.Errors.2006',
    defaultMessage: 'Failed to update user extension. Please try again.',
  },
  2007: {
    id: 'app.containers.Errors.2007',
    defaultMessage:
      'Reason code selected is invalid. Please select a different reason code.',
  },
  2008: {
    id: 'app.containers.Errors.2008',
    defaultMessage:
      'Failed to set user direction. The server returned an error.',
  },
  2009: {
    id: 'app.containers.Errors.2009',
    defaultMessage:
      'Failed to go ready; unable to retrieve user extensions. The server returned an error.',
  },
  2010: {
    id: 'app.containers.Errors.2010',
    defaultMessage: 'Unable to retrieve tenant data.',
  },
  2011: {
    id: 'app.containers.Errors.2011',
    defaultMessage: 'Unable to retrieve region data.',
  },
  2012: {
    id: 'app.containers.Errors.2012',
    defaultMessage:
      "Unable to retrieve user's tenant. The server returned an error.",
  },
  2013: {
    id: 'app.containers.Errors.2013',
    defaultMessage:
      'Failed to set user presence state. The server returned an error.',
  },
  /**
   * context :authentication
   */
  3000: {
    id: 'app.containers.Errors.3000',
    defaultMessage: 'Cannot login due to service issues.',
  },
  3001: {
    id: 'app.containers.Errors.3001',
    defaultMessage: 'Cannot logout due to service issues.',
  },
  3002: {
    id: 'app.containers.Errors.3002',
    defaultMessage: 'Cannot login due to a bad request.',
  },
  3003: {
    id: 'app.containers.Errors.3003',
    defaultMessage: 'Cannot login. SSO initialization failed.',
  },
  3004: {
    id: 'app.containers.Errors.3004',
    defaultMessage: 'Failed to authenticate with SSO.',
  },
  3005: {
    id: 'app.containers.Errors.3005',
    defaultMessage: 'Failed to retrieve SSO authentication information.',
  },
  /**
   * context :interaction
   */
  4000: {
    id: 'app.containers.Errors.4000',
    defaultMessage:
      'Unable to perform this action as there are interactions still active.',
  },
  4001: {
    id: 'app.containers.Errors.4001',
    defaultMessage: 'Attempted to accept a work offer that is already expired.',
  },
  4002: {
    id: 'app.containers.Errors.4002',
    defaultMessage: 'Failed to acknowledge action.',
  },
  4003: {
    id: 'app.containers.Errors.4003',
    defaultMessage: 'Failed to end interaction.',
  },
  4004: {
    id: 'app.containers.Errors.4004',
    defaultMessage: 'Failed to accept interaction.',
  },
  4005: {
    id: 'app.containers.Errors.4005',
    defaultMessage: 'Failed to focus interaction.',
  },
  4006: {
    id: 'app.containers.Errors.4006',
    defaultMessage: 'Failed to unfocus interaction.',
  },
  4007: {
    id: 'app.containers.Errors.4007',
    defaultMessage: 'Failed to assign specified contact to interaction.',
  },
  4008: {
    id: 'app.containers.Errors.4008',
    defaultMessage: 'Failed to unassign specified contact to interaction.',
  },
  4009: {
    id: 'app.containers.Errors.4009',
    defaultMessage: 'Failed to enable wrapup.',
  },
  4010: {
    id: 'app.containers.Errors.4010',
    defaultMessage: 'Failed to disable wrapup.',
  },
  4011: {
    id: 'app.containers.Errors.4011',
    defaultMessage: 'Failed to end wrapup.',
  },
  4012: {
    id: 'app.containers.Errors.4012',
    defaultMessage: 'Failed to deselect disposition code.',
  },
  4013: {
    id: 'app.containers.Errors.4013',
    defaultMessage: 'Failed to select disposition code.',
  },
  4014: {
    id: 'app.containers.Errors.4014',
    defaultMessage: 'Failed to get specified interaction note.',
  },
  4015: {
    id: 'app.containers.Errors.4015',
    defaultMessage:
      'Failed to list interaction notes for specified interaction.',
  },
  4016: {
    id: 'app.containers.Errors.4016',
    defaultMessage: 'Failed to update specified interaction note.',
  },
  4017: {
    id: 'app.containers.Errors.4017',
    defaultMessage: 'Failed to create interaction note.',
  },
  4018: {
    id: 'app.containers.Errors.4018',
    defaultMessage: 'Failed to send script reply.',
  },
  4019: {
    id: 'app.containers.Errors.4019',
    defaultMessage: 'Failed to send custom interrupt.',
  },
  4020: {
    id: 'app.containers.Errors.4020',
    defaultMessage: 'Invalid disposition code provided.',
  },
  4021: {
    id: 'app.containers.Errors.4021',
    defaultMessage: 'Unable to find a script that matches that ID.',
  },
  /**
   * context :sqs
   */
  5000: {
    id: 'app.containers.Errors.5000',
    defaultMessage:
      'Failed to refresh SQS Queue object. Unable to continue agent notification polling.',
  },
  5001: {
    id: 'app.containers.Errors.5001',
    defaultMessage:
      'Failed to delete sqs message. Will likely receive the previous message again.',
  },
  5002: {
    id: 'app.containers.Errors.5002',
    defaultMessage: 'Failed to receive sqs message. Will retry in 2 seconds.',
  },
  5003: {
    id: 'app.containers.Errors.5003',
    defaultMessage:
      'An uncaught exception was thrown. You may need to refresh the browser if you are not able to perform any actions or receive any work.',
  },
  5004: {
    id: 'app.containers.Errors.5004',
    defaultMessage:
      'Exited the SQS loop. This is likely because the session ended, but could indicate an unintended exit from the loop.',
  },
  5005: {
    id: 'app.containers.Errors.5005',
    defaultMessage:
      'Failed to process message. You may need to refresh the browser if you are not able to perform any actions or receive any work.',
  },
  /**
   * context :messaging
   */
  6000: {
    id: 'app.containers.Errors.6000',
    defaultMessage: 'Failed to retrieve messaging interaction history.',
  },
  6001: {
    id: 'app.containers.Errors.6001',
    defaultMessage: 'Failed to retrieve messaging interaction metadata.',
  },
  6002: {
    id: 'app.containers.Errors.6002',
    defaultMessage: 'Failed to retrieve messaging transcripts.',
  },
  6003: {
    id: 'app.containers.Errors.6003',
    defaultMessage: 'Failed to create outbound SMS interaction.',
  },
  6004: {
    id: 'app.containers.Errors.6004',
    defaultMessage: 'Failed to send outbound SMS reply.',
  },
  6005: {
    id: 'app.containers.Errors.6005',
    defaultMessage: 'Failed to retrieve specific messaging transcript.',
  },
  6006: {
    id: 'app.containers.Errors.6006',
    defaultMessage: 'Failed to retrieve smooch messaging interaction history.',
  },
  6007: {
    id: 'app.containers.Errors.6007',
    defaultMessage: 'Failed to send message.',
  },
  6008: {
    id: 'app.containers.Errors.6008',
    defaultMessage: 'Failed to send read indicator.',
  },
  6009: {
    id: 'app.containers.Errors.6009',
    defaultMessage: 'Failed to send typing indicator.',
  },
  6010: {
    id: 'app.containers.Errors.6010',
    defaultMessage: 'Failed to send attachment.',
  },
  /**
   * context :voice
   */
  7000: {
    id: 'app.containers.Errors.7000',
    defaultMessage: 'Failed to refresh Twilio credentials.',
  },
  7001: {
    id: 'app.containers.Errors.7001',
    defaultMessage:
      'Unable to send digits to specified interaction. Interaction must be active and of type voice.',
  },
  7002: {
    id: 'app.containers.Errors.7002',
    defaultMessage: 'Unable to perform action - no twilio integration set up.',
  },
  7003: {
    id: 'app.containers.Errors.7003',
    defaultMessage: 'Failed to place resource on hold.',
  },
  7004: {
    id: 'app.containers.Errors.7004',
    defaultMessage: 'Failed to resume resource from hold.',
  },
  7005: {
    id: 'app.containers.Errors.7005',
    defaultMessage: 'Failed to mute target resource.',
  },
  7006: {
    id: 'app.containers.Errors.7006',
    defaultMessage: 'Failed to unmute target resource.',
  },
  7007: {
    id: 'app.containers.Errors.7007',
    defaultMessage: 'Failed to resume all resources.',
  },
  7008: {
    id: 'app.containers.Errors.7008',
    defaultMessage: 'Failed to start recording on interaction.',
  },
  7009: {
    id: 'app.containers.Errors.7009',
    defaultMessage: 'Failed to transfer customer to another resource.',
  },
  7010: {
    id: 'app.containers.Errors.7010',
    defaultMessage: 'Failed to cancel pending transfer to resource.',
  },
  7011: {
    id: 'app.containers.Errors.7011',
    defaultMessage: 'Failed to place customer on hold.',
  },
  7012: {
    id: 'app.containers.Errors.7012',
    defaultMessage: 'Failed to stop recording on interaction.',
  },
  7013: {
    id: 'app.containers.Errors.7013',
    defaultMessage: 'Failed to resume customer from hold.',
  },
  7014: {
    id: 'app.containers.Errors.7014',
    defaultMessage: 'Failed to remove the resource from the interaction.',
  },
  7015: {
    id: 'app.containers.Errors.7015',
    defaultMessage: 'Failed to transfer customer to queue.',
  },
  7016: {
    id: 'app.containers.Errors.7016',
    defaultMessage: 'Failed to cancel pending transfer to queue.',
  },
  7017: {
    id: 'app.containers.Errors.7017',
    defaultMessage: 'Failed to transfer customer to extension.',
  },
  7018: {
    id: 'app.containers.Errors.7018',
    defaultMessage: 'Failed to cancel pending transfer to extension.',
  },
  7019: {
    id: 'app.containers.Errors.7019',
    defaultMessage: 'Failed to perform outbound dial.',
  },
  7020: {
    id: 'app.containers.Errors.7020',
    defaultMessage: 'Failed to cancel outbound dial.',
  },
  7022: {
    id: 'app.containers.Errors.7022',
    defaultMessage: 'Failed to start silent monitoring on interaction.',
  },
  7023: {
    id: 'app.containers.Errors.7023',
    defaultMessage: 'Twilio Device encountered an error.',
  },
  7025: {
    id: 'app.containers.Errors.7025',
    defaultMessage: 'There is no extension to use to start silent monitoring.',
  },
  /**
   * context :twilio
   */
  8000: {
    id: 'app.containers.Errors.8000',
    defaultMessage:
      'Failed to connect to Twilio. Microphone access must be enabled within your browser to utilize voice features.',
  },
  8001: {
    id: 'app.containers.Errors.8001',
    defaultMessage:
      'Failed to send digits via Twilio. Potentially invalid dial tones.',
  },
  8002: {
    id: 'app.containers.Errors.8002',
    defaultMessage: 'Failed to find the twilio connection object in state.',
  },
  8003: {
    id: 'app.containers.Errors.8003',
    defaultMessage:
      'Force-killed the connection with Twilio; previous attempts to end it naturally were unsuccessful.',
  },
  /**
   * context :mqtt
   */
  9000: {
    id: 'app.containers.Errors.9000',
    defaultMessage: 'Unable to connect to MQTT.',
  },
  9001: {
    id: 'app.containers.Errors.9001',
    defaultMessage: 'The connection to MQTT has been lost.',
  },
  /**
   * context :email
   */
  10000: {
    id: 'app.containers.Errors.10000',
    defaultMessage: 'Failed to create email artifact for email reply.',
  },
  10001: {
    id: 'app.containers.Errors.10001',
    defaultMessage: 'Failed to retrieve email artifact data.',
  },
  10002: {
    id: 'app.containers.Errors.10002',
    defaultMessage:
      'Outbound email failed. Please try again or refresh your browser.',
  },
  10003: {
    id: 'app.containers.Errors.10003',
    defaultMessage:
      'Failed to send agent reply started signal. Reporting around this email may be affected.',
  },
  10004: {
    id: 'app.containers.Errors.10004',
    defaultMessage:
      'Failed to send agent no reply signal. Reporting around this email may be affected.',
  },
  10005: {
    id: 'app.containers.Errors.10005',
    defaultMessage: 'Failed to send email reply. The server returned an error.',
  },
  10006: {
    id: 'app.containers.Errors.10006',
    defaultMessage:
      'Failed to fetch attachment URL. The server returned an error.',
  },
  10007: {
    id: 'app.containers.Errors.10007',
    defaultMessage:
      'Failed to send agent cancelled reply signal. Reporting around this email may be affected.',
  },
  10008: {
    id: 'app.containers.Errors.10008',
    defaultMessage:
      'Failed to send email reply. There is no artifact for the interaction.',
  },
  /**
   * context :entities
   */
  11000: {
    id: 'app.containers.Errors.11000',
    defaultMessage: 'Failed to get specified user.',
  },
  11001: {
    id: 'app.containers.Errors.11001',
    defaultMessage: 'Failed to get user list.',
  },
  11003: {
    id: 'app.containers.Errors.11003',
    defaultMessage: 'Failed to get queue list.',
  },
  11005: {
    id: 'app.containers.Errors.11005',
    defaultMessage: 'Failed to get transfer lists.',
  },
  11027: {
    id: 'app.containers.Errors.11027',
    defaultMessage: 'Failed to get artifacts.',
  },
  11068: {
    id: 'app.containers.Errors.11068',
    defaultMessage: "Failed to get user's outbound identifier lists.",
  },
  11069: {
    id: 'app.containers.Errors.11069',
    defaultMessage: 'Failed to get entity.',
  },
  11137: {
    id: 'app.containers.Errors.11137',
    defaultMessage:
      'Failed to retrieve the recordings for the interaction-id specified.',
  },
  /**
   * context :reporting
   */
  12000: {
    id: 'app.containers.Errors.12000',
    defaultMessage: 'Reporting batch request failed.',
  },
  12001: {
    id: 'app.containers.Errors.12001',
    defaultMessage:
      'Failed to retrieve reporting information for the interaction id specified.',
  },
  12002: {
    id: 'app.containers.Errors.12002',
    defaultMessage:
      'Failed to get interaction history for the contact id specified.',
  },
  12003: {
    id: 'app.containers.Errors.12003',
    defaultMessage: 'Failed to get available stats.',
  },
  12004: {
    id: 'app.containers.Errors.12004',
    defaultMessage: 'Failed to perform stat query.',
  },
  12005: {
    id: 'app.containers.Errors.12005',
    defaultMessage: 'Failed to get capacity.',
  },
  12006: {
    id: 'app.containers.Errors.12006',
    defaultMessage: 'Failed to retrieve CRM Interaction information.',
  },
  12007: {
    id: 'app.containers.Errors.12007',
    defaultMessage: 'Failed to perform bulk stat query.',
  },
  /**
   * context :contacts
   */
  13000: {
    id: 'app.containers.Errors.13000',
    defaultMessage:
      '"Failed to retrieve list of contact layouts. The server returned an error.',
  },
  13001: {
    id: 'app.containers.Errors.13001',
    defaultMessage:
      'Failed to retrieve specified contact layout. The server returned an error.',
  },
  13002: {
    id: 'app.containers.Errors.13002',
    defaultMessage:
      'Failed to list contact attributes. The server returned an error.',
  },
  13003: {
    id: 'app.containers.Errors.13003',
    defaultMessage: 'Failed to merge contacts. The server returned an error.',
  },
  13004: {
    id: 'app.containers.Errors.13004',
    defaultMessage: 'Failed to delete contact. The server returned an error.',
  },
  13005: {
    id: 'app.containers.Errors.13005',
    defaultMessage: 'Failed to update contact. The server returned an error.',
  },
  13006: {
    id: 'app.containers.Errors.13006',
    defaultMessage: 'Failed to create contact. The server returned an error.',
  },
  13007: {
    id: 'app.containers.Errors.13007',
    defaultMessage: 'Failed to search contacts. The server returned an error.',
  },
  13008: {
    id: 'app.containers.Errors.13008',
    defaultMessage:
      'Failed to retrieve all contacts. The server returned an error.',
  },
  13009: {
    id: 'app.containers.Errors.13009',
    defaultMessage:
      'Failed to retrieve specified contact. The server returned an error.',
  },
  /**
   * context :logging
   */
  14000: {
    id: 'app.containers.Errors.14000',
    defaultMessage: 'Failed to save logs to API.',
  },
  /**
   * context :salesforce-classic
   */
  15000: {
    id: 'app.containers.Errors.15000',
    defaultMessage: 'Failed to assign item. The server returned an error.',
  },
  15001: {
    id: 'app.containers.Errors.15001',
    defaultMessage: 'Failed to update interaction tab id.',
  },
  15002: {
    id: 'app.containers.Errors.15002',
    defaultMessage: 'Failed to unassign item. The server returned an error.',
  },
  15003: {
    id: 'app.containers.Errors.15003',
    defaultMessage: 'Failed to focus salesforce classic interaction.',
  },
  15004: {
    id: 'app.containers.Errors.15004',
    defaultMessage:
      'Failed to assign item. Interaction already has been assigned to an item.',
  },
  15005: {
    id: 'app.containers.Errors.15005',
    defaultMessage: 'Failed to unassign item. No item has been assigned.',
  },
  15006: {
    id: 'app.containers.Errors.15006',
    defaultMessage:
      'Failed to assign/unassign item. Interaction id does not correspond to active interaction.',
  },
  15007: {
    id: 'app.containers.Errors.15007',
    defaultMessage: 'Failed to assign item. Cannot assign blank active tab.',
  },
  15008: {
    id: 'app.containers.Errors.15008',
    defaultMessage:
      'Failed to get current salesforce classic user ID. Managed package may not have been installed or not be the correct version.',
  },
  15009: {
    id: 'app.containers.Errors.15009',
    defaultMessage:
      'Failed to get current salesforce classic organization ID. Managed package may not have been installed or not be the correct version.',
  },
  /**
   * context :salesforce-lightning
   */
  16000: {
    id: 'app.containers.Errors.16000',
    defaultMessage: 'Failed to assign item. The server returned an error.',
  },
  16001: {
    id: 'app.containers.Errors.16001',
    defaultMessage: 'Failed to assign item. The server returned an error.',
  },
  16002: {
    id: 'app.containers.Errors.16002',
    defaultMessage: 'Failed to unassign item. The server returned an error.',
  },
  16003: {
    id: 'app.containers.Errors.16003',
    defaultMessage: 'Failed to focus salesforce lightning interaction.',
  },
  16004: {
    id: 'app.containers.Errors.16004',
    defaultMessage:
      'Failed to assign item. Interaction already has been assigned to an item.',
  },
  16005: {
    id: 'app.containers.Errors.16005',
    defaultMessage: 'Failed to unassign item. No item has been assigned.',
  },
  16006: {
    id: 'app.containers.Errors.16006',
    defaultMessage:
      'Failed to assign/unassign item. Interaction id does not correspond to active interaction.',
  },
  16007: {
    id: 'app.containers.Errors.16007',
    defaultMessage: 'Failed to assign item. Cannot assign blank active tab.',
  },
  16008: {
    id: 'app.containers.Errors.16008',
    defaultMessage: 'Failed to retrieve Salesforce Lightning user id.',
  },
  16009: {
    id: 'app.containers.Errors.16009',
    defaultMessage:
      'Failed to get Salesforce Lightning organization ID. Managed package may not have been installed or not be the correct version.',
  },
  /**
   * context :zendesk
   */
  17000: {
    id: 'app.containers.Errors.17000',
    defaultMessage: 'Failed to initialize Zendesk Client.',
  },
  17001: {
    id: 'app.containers.Errors.17001',
    defaultMessage: 'Failed to focus Zendesk interaction.',
  },
  17002: {
    id: 'app.containers.Errors.17002',
    defaultMessage: 'Failed to set visibility of Zendesk Toolbar.',
  },
  17003: {
    id: 'app.containers.Errors.17003',
    defaultMessage: 'Failed to set dimensions of Zendesk Toolbar.',
  },
  17004: {
    id: 'app.containers.Errors.17004',
    defaultMessage: 'Failed to assign item. The server returned an error.',
  },
  interactionFailed: {
    id: 'app.components.Errors.interactionFailed',
    defaultMessage:
      'Your interaction failed, please try again. If this issue continues please contact your administrator.',
  },
  ssoFailed: {
    id: 'app.components.Errors.ssoFailed',
    defaultMessage:
      'SSO Login Failed, please try again. If this issue continues please contact your administrator.',
  },
  sessionEnded: {
    id: 'app.components.Errors.sessionEnded',
    defaultMessage:
      '{icon} {title} - Your current session has been disconnected by your supervisor - {name}.',
  },
  incorrectContactsSync: {
    id: 'app.containers.Errors.incorrectContactsSync',
    defaultMessage:
      'The new contact that you created the interaction from cannot be searched. Please try searching again to assign the contact to the interaction.',
  },
});
