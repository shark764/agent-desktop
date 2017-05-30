/*
 *
 * ContactsControl actions
 *
 */

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

export function setShowCancelDialog(showCancelDialog) {
  return {
    type: SET_SHOW_CANCEL_DIALOG,
    showCancelDialog,
  };
}

export function setShowConfirmDialog(showConfirmDialog) {
  return {
    type: SET_SHOW_CONFIRM_DIALOG,
    showConfirmDialog,
  };
}

export function setFormIsDirty(formIsDirty) {
  return {
    type: SET_FORM_IS_DIRTY,
    formIsDirty,
  };
}

export function setFormValidity(formIsValid) {
  return {
    type: SET_FORM_VALIDITY,
    formIsValid,
  };
}

export function setFormField(field, value) {
  return {
    type: SET_FORM_FIELD,
    field,
    value,
  };
}

export function setFormError(field, error) {
  return {
    type: SET_FORM_ERROR,
    field,
    error,
  };
}

export function setShowError(field, error) {
  return {
    type: SET_SHOW_ERROR,
    field,
    error,
  };
}

export function setUnusedField(field, value) {
  return {
    type: SET_UNUSED_FIELD,
    field,
    value,
  };
}

export function setSelectedIndex(field, index) {
  return {
    type: SET_SELECTED_INDEX,
    field,
    index,
  };
}

export function resetForm() {
  return {
    type: RESET_FORM,
  };
}
