/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * MessagingContentArea actions
 *
 */

import {
  INITIALIZE_OUTBOUND_SMS,
  SEND_OUTBOUND_SMS,
} from './constants';

export function initializeOutboundSms(interactionId, phoneNumber, message) {
  return {
    type: INITIALIZE_OUTBOUND_SMS,
    interactionId,
    phoneNumber,
    message,
  };
}

export function sendOutboundSms(interactionId, message) {
  return {
    type: SEND_OUTBOUND_SMS,
    interactionId,
    message,
  };
}
