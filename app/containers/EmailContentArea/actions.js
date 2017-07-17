/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * EmailContentArea actions
 *
 */

import { START_OUTBOUND_EMAIL } from './constants';

export function startOutboundEmail(
  customer,
  contact,
  addedByNewInteractionPanel
) {
  return {
    type: START_OUTBOUND_EMAIL,
    customer,
    contact,
    addedByNewInteractionPanel,
  };
}
