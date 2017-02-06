/*
 *
 * SidePanel reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_CONTACT_LAYOUT,
  SET_CONTACT_ATTRIBUTES,
} from './constants';

const initialState = fromJS({
  // XXX ?
  compactLayoutAttributes: [
    // 'mobile', 'email', 'address1'
  ],
  contactLayoutSections: [],
  contactAttributes: [],
});

function sidePanelReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONTACT_LAYOUT:
      return state.set('contactLayoutSections', action.layout);
    case SET_CONTACT_ATTRIBUTES:
      return state.set('contactAttributes', action.attributes);
    default:
      return state;
  }
}

export default sidePanelReducer;
