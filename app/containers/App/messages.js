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
  sessionEnded: {
    id: 'app.containers.App.sessionEnded',
    defaultMessage: 'Session Ended',
  },
  directionChanged: {
    id: 'app.containers.App.directionChanged',
    defaultMessage:
      '{icon} Your direction has been changed to "{direction}" by your supervisor - {name}',
  },
  ready: {
    id: 'app.containers.App.ready',
    defaultMessage: 'Available',
  },
  inbound: {
    id: 'app.containers.App.inbound',
    defaultMessage: 'Inbound',
  },
  outbound: {
    id: 'app.containers.App.outbound',
    defaultMessage: 'Outbound',
  },
  agentInitiated: {
    id: 'app.containers.App.agentInitiated',
    defaultMessage: 'Do Not Disturb Outbound',
  },
  notready: {
    id: 'app.containers.App.notready',
    defaultMessage: 'Unavailable ({reason})',
  },
  presenceStateChanged: {
    id: 'app.containers.App.presenceStateChanged',
    defaultMessage:
      '{icon} Your state has been changed to "{state}" by your supervisor - {name}',
  },
  reload: {
    id: 'app.containers.App.reload',
    defaultMessage: 'Click Here To Reload',
  },
  nonCriticalError: {
    id: 'app.containers.App.nonCriticalError',
    defaultMessage: 'Error!',
  },
  newVersion: {
    id: 'app.containers.App.newVersion',
    defaultMessage: 'There is a new version available! Click to refresh.',
  },
  newInteraction: {
    id: 'app.containers.App.newInteraction',
    defaultMessage: 'New interaction!',
  },
  newMessage: {
    id: 'app.containers.App.newMessage',
    defaultMessage: 'New message!',
  },
  offline: {
    id: 'app.containers.App.offline',
    defaultMessage: 'You are currently offline',
  },
});
