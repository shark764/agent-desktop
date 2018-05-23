/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentScript actions
 *
 */

import { SEND_SCRIPT } from './constants';

export function sendScript(interactionId, script, dismissed) {
  return {
    type: SEND_SCRIPT,
    interactionId,
    script,
    dismissed,
  };
}
