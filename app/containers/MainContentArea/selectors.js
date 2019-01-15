/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectCurrentAgentMessageTemplates = (state) =>
  state.getIn(['agentDesktop', 'userConfig', 'messageTemplates']);

const selectMessageTemplates = createSelector(
  selectCurrentAgentMessageTemplates,
  (messageTemplates) =>
    messageTemplates.toJS().filter((template) => template.active === true)
);

export { selectMessageTemplates };
