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
    id: 'app.containers.WelcomeStats.avgHandleTime',
    defaultMessage: 'Average Handle Time',
  },
  csat: {
    id: 'app.containers.WelcomeStats.csat',
    defaultMessage: 'Customer Satisfaction',
  },
  interactionsCount: {
    id: 'app.containers.WelcomeStats.interactionsCount',
    defaultMessage: 'Daily Interactions',
  },
});
