/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * AgentStatusMenu Messages
 *
 * This contains all the text for the AgentStatusMenu component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  ready: {
    id: 'app.containers.AgentStatusMenu.ready',
    defaultMessage: 'Ready',
  },
  notReady: {
    id: 'app.containers.AgentStatusMenu.notReady',
    defaultMessage: 'Not Ready',
  },
  logout: {
    id: 'app.containers.AgentStatusMenu.logout',
    defaultMessage: 'Log Out',
  },
  inbound: {
    id: 'app.containers.AgentStatusMenu.inbound',
    defaultMessage: 'Inbound',
  },
  outbound: {
    id: 'app.containers.AgentStatusMenu.outbound',
    defaultMessage: 'Outbound',
  },
  'agent-initiated': {
    id: 'app.containers.AgentStatusMenu.agent-initiated',
    defaultMessage: 'Do Not Disturb Outbound',
  },
  activeVoicePath: {
    id: 'app.containers.AgentStatusMenu.activeVoicePath',
    defaultMessage: 'Active Voice Pathway',
  },
  mode: {
    id: 'app.containers.AgentStatusMenu.mode',
    defaultMessage: 'Mode',
  },
  tenant: {
    id: 'app.containers.AgentStatusMenu.tenant',
    defaultMessage: 'Tenant',
  },
});
