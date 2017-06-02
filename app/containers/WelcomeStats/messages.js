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
  resourceHandleTime: {
    id: 'app.container.WelcomeStats.resourceHandleTime',
    defaultMessage: 'Average Handle Time',
  },
  customerSatisfactionScore: {
    id: 'app.container.WelcomeStats.customerSatisfactionScore',
    defaultMessage: 'Customer Satisfaction',
  },
  workAcceptedCount: {
    id: 'app.container.WelcomeStats.workAcceptedCount',
    defaultMessage: 'Daily Interactions',
  },
});
