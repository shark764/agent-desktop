/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';
import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

export const selectActiveExtensionIsNotPstn = createSelector(
  selectActiveExtension,
  (activeExtension) => activeExtension.type !== 'pstn'
);
