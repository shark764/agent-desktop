/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * EmailContentArea actions
 *
 */

import * as ACTIONS from './constants';

export function startOutboundEmail(
  customer,
  contact,
  addedByNewInteractionPanel
) {
  return {
    type: ACTIONS.START_OUTBOUND_EMAIL,
    customer,
    contact,
    addedByNewInteractionPanel,
  };
}

export function addEmail(email, inputType) {
  return {
    type: ACTIONS.ADD_EMAIL,
    email,
    inputType,
  };
}

export function removeEmail(index, list) {
  return {
    type: ACTIONS.REMOVE_EMAIL,
    index,
    list,
  };
}
