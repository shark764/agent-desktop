/*
 *
 * ContactsControl reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_SHOW_CANCEL_DIALOG,
  SET_SHOW_CONFIRM_DIALOG,
  SET_FORM_IS_DIRTY,
  SET_FORM_VALIDITY,
  SET_FORM_FIELD,
  SET_FORM_ERROR,
  SET_SHOW_ERROR,
  SET_UNUSED_FIELD,
  SET_SELECTED_INDEX,
  RESET_FORM,
} from './constants';

const initialState = fromJS({
  showCancelDialog: false,
  showConfirmDialog: false,
  formIsDirty: false,
  formIsValid: false,
  contactForm: {},
  formErrors: {},
  showErrors: {},
  unusedFields: {},
  selectedIndexes: {},
});

function contactsControlReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SHOW_CANCEL_DIALOG:
      return state
        .set('showCancelDialog', action.showCancelDialog);
    case SET_SHOW_CONFIRM_DIALOG:
      return state
        .set('showConfirmDialog', action.showConfirmDialog);
    case SET_FORM_IS_DIRTY:
      return state
        .set('formIsDirty', action.formIsDirty);
    case SET_FORM_VALIDITY:
      return state
        .set('formIsValid', action.formIsValid);
    case SET_FORM_FIELD:
      return state
        .set('contactForm', fromJS({ ...state.get('contactForm').toJS(), [action.field]: action.value }));
    case SET_FORM_ERROR:
      return state
        .set('formErrors', fromJS({ ...state.get('formErrors').toJS(), [action.field]: action.error }));
    case SET_SHOW_ERROR:
      return state
        .set('showErrors', fromJS({ ...state.get('showErrors').toJS(), [action.field]: action.error }));
    case SET_UNUSED_FIELD:
      return state
        .set('unusedFields', fromJS({ ...state.get('unusedFields').toJS(), [action.field]: action.value }));
    case SET_SELECTED_INDEX:
      return state
        .set('selectedIndexes', fromJS({ ...state.get('selectedIndexes').toJS(), [action.field]: action.index }));
    case RESET_FORM:
      return initialState;
    default:
      return state;
  }
}

export default contactsControlReducer;
