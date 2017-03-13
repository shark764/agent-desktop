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
  contactLayout: undefined,
  // uncomment below line for mocking
  // contactLayout: { layout: [] },
  contactAttributes: [],
});

function sidePanelReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONTACT_LAYOUT:
      if (action.layout.length === 0) {
        throw new Error('No contact layout found for this tenant');
      } else if (action.layout.length > 1) {
        console.warn('More than one layout found. Only using first one.');
      }
      return state.set('contactLayout', fromJS(action.layout[0]));
    case SET_CONTACT_ATTRIBUTES:
      return state.set('contactAttributes', fromJS(action.attributes));
    default:
      return state;
  }
}

export default sidePanelReducer;
