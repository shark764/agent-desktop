/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import {
  selectAwaitingDisposition,
  selectAwaitingScript,
} from 'containers/AgentDesktop/selectors';

import messages from './messages';

const selectWrapupBtnTooltipText = createSelector(
  selectAwaitingDisposition,
  selectAwaitingScript,
  (awaitingDisposition, awaitingScript) => {
    if (awaitingDisposition) {
      return messages.awaitingDisposition;
    } else if (awaitingScript) {
      return messages.awaitingScript;
    } else {
      return {};
    }
  }
);

export { selectWrapupBtnTooltipText };
