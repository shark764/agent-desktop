/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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
  performance: {
    id: 'app.containers.WelcomeStats.performance',
    defaultMessage: 'PERFORMANCE',
  },
  resourceHandleTime: {
    id: 'app.containers.WelcomeStats.resourceHandleTime',
    defaultMessage: 'Average Handle Time',
  },
  customerSatisfactionScore: {
    id: 'app.containers.WelcomeStats.customerSatisfactionScore',
    defaultMessage: 'Customer Satisfaction',
  },
  workAcceptedCount: {
    id: 'app.containers.WelcomeStats.workAcceptedCount',
    defaultMessage: 'Daily Interactions',
  },
});
