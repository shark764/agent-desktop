/*
 * InfoTab Messages
 *
 * This contains all the text for the InfoTab component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  newRecord: {
    id: 'app.containers.InfoTab.newRecord',
    defaultMessage: 'Create New Record',
  },
  loading: {
    id: 'app.containers.InfoTab.loading',
    defaultMessage: 'Loading...',
  },
  created: {
    id: 'app.components.InfoTab.created',
    defaultMessage: 'Contact created.',
  },
  saved: {
    id: 'app.components.InfoTab.saved',
    defaultMessage: 'Changes saved.',
  },
  notSaved: {
    id: 'app.containers.AgentDesktop.notSaved',
    defaultMessage: 'Your changes have not been saved.',
  },
  notCreated: {
    id: 'app.containers.AgentDesktop.notCreated',
    defaultMessage: 'Your new contact has not been created.',
  },
  notAssigned: {
    id: 'app.containers.AgentDesktop.notAssigned',
    defaultMessage: 'Contact was not assigned to the interaction.',
  },
  serverError: {
    id: 'app.containers.AgentDesktop.serverError',
    defaultMessage: 'Server Error',
  },
  networkError: {
    id: 'app.containers.AgentDesktop.networkError',
    defaultMessage: 'Network Error',
  },
});
