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
      return state.set('contactLayout', fromJS(action.layout));
    case SET_CONTACT_ATTRIBUTES:
      return state.set('contactAttributes', fromJS(action.attributes));
    default:
      return state;
  }
}

export default sidePanelReducer;
