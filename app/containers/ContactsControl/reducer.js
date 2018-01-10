/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactsControl reducer
 *
 */

import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  showCancelDialog: false,
  showConfirmDialog: false,
});

function contactsControlReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_SHOW_CANCEL_DIALOG:
      return state.set('showCancelDialog', action.showCancelDialog);
    case ACTIONS.SET_SHOW_CONFIRM_DIALOG:
      return state.set('showConfirmDialog', action.showConfirmDialog);
    default:
      return state;
  }
}

export default contactsControlReducer;
