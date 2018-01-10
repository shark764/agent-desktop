/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * LanguageProvider actions
 *
 */

import * as ACTIONS from './constants';

export function changeLocale(languageLocale) {
  return {
    type: ACTIONS.CHANGE_LOCALE,
    locale: languageLocale,
  };
}
