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
      'Copyright © 2015-{year} Serenova, LLC ("Serenova"). All rights reserved.',
    values: { year: new Date().getFullYear() },
  },
  legal: {
    id: 'app.containers.Login.legal',
    defaultMessage:
      'By acessing the Service, you agree to the following terms: ',
  },
  legalLabel: {
    id: 'app.containers.Login.legalLabel',
    defaultMessage: 'Link',
  },
});
