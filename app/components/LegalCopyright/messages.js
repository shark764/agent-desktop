/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * Logo Messages
 *
 * This contains all the text for the Logo component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  copyright: {
    id: 'app.containers.Login.copyright',
    defaultMessage:
      'Copyright © 2015-{year} Lifesize, Inc. All rights reserved.',
  },
  legal: {
    id: 'app.containers.Login.legal',
    defaultMessage:
      'By accessing the Service, you agree to the following terms: ',
  },
  legalLabel: {
    id: 'app.containers.Login.legalLabel',
    defaultMessage: 'Link',
  },
});
