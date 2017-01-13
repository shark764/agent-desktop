/*
 *
 * SidePanel actions
 *
 */

import {
  SET_CONTACT_LAYOUT,
  SET_CONTACT_ATTRIBUTES,
} from './constants';

export function setContactLayout(layout) {
  return {
    type: SET_CONTACT_LAYOUT,
    layout,
  };
}
export function setContactAttributes(attributes) {
  return {
    type: SET_CONTACT_ATTRIBUTES,
    attributes,
  };
}
