/*
 * AgentDesktop Messages
 *
 * This contains all the text for the AgentDesktop component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.AgentDesktop.header',
    defaultMessage: 'This is AgentDesktop container !',
  },
  sqsTypes: {
    resourceStateChange: 'resource-state-change',
    agentNotification: 'agent-notification',
  },
});
