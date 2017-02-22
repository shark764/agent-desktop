/*
 * WelcomeStats Messages
 *
 * This contains all the text for the WelcomeStats component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  welcome: {
    id: 'app.containers.MainContentArea.welcome',
    defaultMessage: 'Welcome, ',
  },
  avgHandleTime: {
    id: 'app.container.MainContentArea.avgHandleTime',
    defaultMessage: 'Average Handle Time',
  },
  csat: {
    id: 'app.container.MainContentArea.csat',
    defaultMessage: 'Customer Satisfaction',
  },
  interactionsCount: {
    id: 'app.container.MainContentArea.interactionsCount',
    defaultMessage: 'Daily Interactions',
  },
});
