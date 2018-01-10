/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * SidePanel actions
 *
 */

import * as ACTIONS from './constants';

export function setContactLayout(layout) {
  return {
    type: ACTIONS.SET_CONTACT_LAYOUT,
    layout,
  };
}
export function setContactAttributes(attributes) {
  return {
    type: ACTIONS.SET_CONTACT_ATTRIBUTES,
    attributes,
  };
}
