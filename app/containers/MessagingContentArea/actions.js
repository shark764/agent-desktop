/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * MessagingContentArea actions
 *
 */

import {
  INITIALIZE_OUTBOUND_SMS_FROM_MESSAGING,
  SEND_OUTBOUND_SMS,
  COPY_CHAT_TRANSCRIPT,
} from './constants';

export function initializeOutboundSmsFromMessaging(
  interactionId,
  phoneNumber,
  contactId,
  message,
  popUri
) {
  return {
    type: INITIALIZE_OUTBOUND_SMS_FROM_MESSAGING,
    interactionId,
    phoneNumber,
    contactId,
    message,
    popUri,
  };
}

export function sendOutboundSms(interactionId, message) {
  return {
    type: SEND_OUTBOUND_SMS,
    interactionId,
    message,
  };
}

export function copyChatTranscript(interaction) {
  return {
    type: COPY_CHAT_TRANSCRIPT,
    interaction,
  };
}
