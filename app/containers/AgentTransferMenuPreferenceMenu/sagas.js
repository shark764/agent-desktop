import { takeEvery, put, select } from 'redux-saga/effects';

import * as ACTIONS from './constants';

import {
  selectAgentsPreferences,
  selectShowQueues,
  selectShowTransferLists,
} from './selectors';
import {
  setAgentsTransferMenuPreference,
  setShowQueuesTransferMenuPreference,
  setShowTransferListTransferMenuPreference,
} from './actions';

export function* goToggleAgentsTransferMenuPreference() {
  const agentsTransferMenu = yield select(selectAgentsPreferences);
  yield put(setAgentsTransferMenuPreference(!agentsTransferMenu));
}

export function* goToggleShowQueuesTransferMenuPreference() {
  const showQueuesTransferMenu = yield select(selectShowQueues);
  yield put(setShowQueuesTransferMenuPreference(!showQueuesTransferMenu));
}

export function* goToggleShowTransferListTransferMenuPreference() {
  const showTransferListTransferMenu = yield select(selectShowTransferLists);
  yield put(
    setShowTransferListTransferMenuPreference(!showTransferListTransferMenu)
  );
}

export default [
  takeEvery(
    ACTIONS.TOGGLE_AGENTS_TRANSFER_MENU_PREFERENCE,
    goToggleAgentsTransferMenuPreference
  ),
  takeEvery(
    ACTIONS.TOGGLE_SHOW_QUEUES_TRANSFER_MENU_PREFERENCE,
    goToggleShowQueuesTransferMenuPreference
  ),
  takeEvery(
    ACTIONS.TOGGLE_SHOW_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
    goToggleShowTransferListTransferMenuPreference
  ),
];
