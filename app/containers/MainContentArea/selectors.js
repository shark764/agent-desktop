/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { createSelector } from 'reselect';

import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';
import { generateErrorMessage } from 'utils/errorMessage';

const selectCurrentAgentMessageTemplates = (state) =>
  state.getIn(['agentDesktop', 'userConfig', 'messageTemplates']);

const selectMessageTemplates = createSelector(
  selectCurrentAgentMessageTemplates,
  (messageTemplates) =>
    messageTemplates.toJS().filter((template) => template.active === true)
);

// Right now only working for interaction errors
const selectLastInteractionNotification = createSelector(
  getSelectedInteraction,
  (state, props) => props.intl.formatMessage,
  (selectedInteraction, formatMessage) => {
    const { notifications } = selectedInteraction;
    if (notifications) {
      const lastNotification = notifications.pop();
      if (lastNotification && lastNotification.isError) {
        const errorDescriptionMessage = generateErrorMessage(
          lastNotification,
          formatMessage
        );
        return {
          ...lastNotification,
          errorDescriptionMessage,
        };
      }
    }
    return null;
  }
);

export { selectMessageTemplates, selectLastInteractionNotification };
