/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * TransferMenu Messages
 *
 * This contains all the text for the TransferMenu component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  addParticipant: {
    id: 'app.containers.TransferMenu.addParticipant',
    defaultMessage: 'Add participant',
  },
  transfer: {
    id: 'app.containers.TransferMenu.transfer',
    defaultMessage: 'Transfer',
  },
  search: {
    id: 'app.containers.TransferMenu.search',
    defaultMessage: 'Search',
  },
  queues: {
    id: 'app.containers.TransferMenu.queues',
    defaultMessage: 'Queues',
  },
  agents: {
    id: 'app.containers.TransferMenu.agents',
    defaultMessage: 'Agents',
  },
  checking: {
    id: 'app.containers.TransferMenu.checking',
    defaultMessage: 'Checking Availability...',
  },
  checkingUserAssignedTransferLists: {
    id: 'app.containers.TransferMenu.checkingUserAssignedTransferLists',
    defaultMessage: 'Checking Assigned Transfer Lists Availability...',
  },
  checkingInteractionTransferLists: {
    id: 'app.containers.TransferMenu.checkingInteractionTransferLists',
    defaultMessage: 'Checking Interaction Transfer Lists Availability...',
  },
  interactionTransferLists: {
    id: 'app.containers.TransferMenu.interactionTransferLists',
    defaultMessage: 'Transfer lists for this Interaction',
  },
  userAssignedTransferLists: {
    id: 'app.containers.TransferMenu.assignedTransferLists',
    defaultMessage: 'Transfer lists assigned to you',
  },
});
