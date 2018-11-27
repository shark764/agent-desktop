import { takeEvery, put } from 'redux-saga/effects';
import * as ACTIONS from './constants';
import { setDialpadText } from './actions';

// Workers Sagas:

export function* changeDialPadText(action) {
  let formattedDialpadText = action.dialpadText.replace(/[^0-9+*#]/g, '');
  if (
    formattedDialpadText.length > 0 &&
    formattedDialpadText.indexOf('+') !== 0
  ) {
    formattedDialpadText = `+${formattedDialpadText}`;
  }
  yield put(setDialpadText(formattedDialpadText));
}

// Watcher Sagas:

export default [takeEvery(ACTIONS.UPDATE_DIAL_PAD_TEXT, changeDialPadText)];
