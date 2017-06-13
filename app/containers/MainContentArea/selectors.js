/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

const selectAgentDesktopDomain = (state) => state.get('agentDesktop');

const selectMessageTemplates = createSelector(
  selectAgentDesktopDomain,
  (agentDesktop) => agentDesktop.get('userConfig').get('messageTemplates').toJS()
);

export {
  selectMessageTemplates,
};
