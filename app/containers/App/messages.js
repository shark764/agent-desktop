/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * App Messages
 *
 * This contains all the text for the App component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  criticalError: {
    id: 'app.containers.App.criticalError',
    defaultMessage: 'Critical Error',
  },
  reload: {
    id: 'app.containers.App.reload',
    defaultMessage: 'Click Here To Reload',
  },
  nonCriticalError: {
    id: 'app.containers.App.nonCriticalError',
    defaultMessage: 'Error!',
  },
});
