/*
 *
 * EmailContentArea actions
 *
 */

import {
  START_OUTBOUND_EMAIL,
} from './constants';

export function startOutboundEmail(customer, contact) {
  return {
    type: START_OUTBOUND_EMAIL,
    customer,
    contact,
  };
}
