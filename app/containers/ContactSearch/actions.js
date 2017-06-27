/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactSearch actions
 *
 */

import { SEARCH_CONTACTS } from './constants';

export function searchContacts() {
  return {
    type: SEARCH_CONTACTS,
  };
}
