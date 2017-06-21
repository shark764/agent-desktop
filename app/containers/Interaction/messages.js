/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * Interaction Messages
 *
 * This contains all the text for the Interaction component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  accept: {
    id: 'app.containers.Interaction.accept',
    defaultMessage: 'Click to accept interaction',
  },
  PSTN: {
    id: 'app.containers.Interaction.PSTN',
    defaultMessage: 'Answer phone to accept interaction',
  },
  wrapup: {
    id: 'app.containers.Interaction.wrapup',
    defaultMessage: 'WRAP UP',
  },
  cancelInteraction: {
    id: 'app.containers.Interaction.cancelInteraction',
    defaultMessage: 'CANCEL',
  },
  pendingScript: {
    id: 'app.containers.Interaction.pendingScript',
    defaultMessage: 'Pending script',
  },
  newInteraction: {
    id: 'app.containers.Interaction.newInteraction',
    defaultMessage: 'New Interaction',
  },
  script: {
    id: 'app.containers.Interaction.script',
    defaultMessage: 'Script',
  },
});
