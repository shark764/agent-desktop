/*
 * WelcomeStats Messages
 *
 * This contains all the text for the WelcomeStats component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  welcome: {
    id: 'app.containers.WelcomeStats.welcome',
    defaultMessage: 'Welcome, ',
  },
  avgHandleTime: {
    id: 'app.container.WelcomeStats.avgHandleTime',
    defaultMessage: 'Average Handle Time',
  },
  csat: {
    id: 'app.container.WelcomeStats.csat',
    defaultMessage: 'Customer Satisfaction',
  },
  interactionsCount: {
    id: 'app.container.WelcomeStats.interactionsCount',
    defaultMessage: 'Daily Interactions',
  },
});
