/*
 * OutboundInteractionButtons Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  voice: {
    id: 'app.containers.ContactsSearch.call',
    defaultMessage: 'CALL',
  },
  mustBeReady: {
    id: 'app.containers.OutboundInteractionButtons.mustBeReady',
    defaultMessage: 'You must be in the ready state',
  },
  enterValidPhone: {
    id: 'app.containers.OutboundInteractionButtons.enterValidPhone',
    defaultMessage: 'Enter a valid phone number',
  },
  voiceInteractionAlreadyExists: {
    id:
      'app.containers.OutboundInteractionButtons.voiceInteractionAlreadyExists',
    defaultMessage: 'A voice interaction already exists',
  },
  sms: {
    id: 'app.containers.OutboundInteractionButtons.sms',
    defaultMessage: 'SMS',
  },
  numberInUse: {
    id: 'app.containers.OutboundInteractionButtons.numberInUse',
    defaultMessage: 'SMS number is used in existing interaction',
  },
  email: {
    id: 'app.containers.NewInteractionContentArea.email',
    defaultMessage: 'EMAIL',
  },
  enterValidEmail: {
    id: 'app.containers.OutboundInteractionButtons.enterValidEmail',
    defaultMessage: 'Enter a valid email',
  },
  emailInUse: {
    id: 'app.containers.OutboundInteractionButtons.emailInUse',
    defaultMessage: 'Email is used in existing interaction',
  },
});
