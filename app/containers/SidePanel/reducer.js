/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

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
  contactLayout: { layout: [] },
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
