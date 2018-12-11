/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * TransferResource Messages
 *
 * This contains all the text for the TransferResource component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  cancelTransfer: {
    id: 'app.containers.TransferResource.cancelTransfer',
    defaultMessage: 'Cancel transfer',
  },
  connecting: {
    id: 'app.containers.TransferResource.connecting',
    defaultMessage: 'connecting',
  },
  onHold: {
    id: 'app.containers.TransferResource.onHold',
    defaultMessage: 'on hold',
  },
  muted: {
    id: 'app.containers.TransferResource.muted',
    defaultMessage: 'muted',
  },
  hangUp: {
    id: 'app.containers.TransferResource.hangUp',
    defaultMessage: 'Hang up',
  },
  transfer: {
    id: 'app.containers.TransferResource.transfer',
    defaultMessage: 'Transfer',
  },
  disconnectParticipant: {
    id: 'app.containers.TransferResource.disconnectParticipant',
    defaultMessage: 'Disconnect Participant',
  },
  holdResource: {
    id: 'app.containers.TransferResource.holdResource',
    defaultMessage: 'Put Participant On Hold',
  },
  unHoldResource: {
    id: 'app.containers.TransferResource.unHoldResource',
    defaultMessage: 'Take Participant Off Hold',
  },
  transferToResource: {
    id: 'app.containers.TransferResource.transferToResource',
    defaultMessage:
      'Transfer Customer To Participant. Disconnect all other participants',
  },
});
