import { takeEvery, put, all, select } from 'redux-saga/effects';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import { selectQueues } from 'containers/AgentDesktop/selectors';
import { selectTransferLists } from 'containers/TransferMenu/selectors';

import * as ACTIONS from './constants';

import {
  selectAgentsPreferences,
  selectShowQueues,
  selectShowTransferLists,
  selectSelectedQueues,
  selectSelectedTransferLists,
} from './selectors';
import {
  setAgentsTransferMenuPreference,
  setShowQueuesTransferMenuPreference,
  setShowTransferListTransferMenuPreference,
  toggleSelectedQueues,
  toggleSelectedTransferLists,
  toggleAllSelectedQueuesTransferMenuPreference,
  toggleAllSelectedTransferListsTransferMenuPreference,
} from './actions';

export function* goInitializeTransferMenuPreferences() {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  const agentPreference = localStorage.getItem(
    `agentsTransferMenuList-${tenant.id}-${agent.userId}`
  );

  if (agentPreference !== null) {
    yield put(setAgentsTransferMenuPreference(agentPreference === 'true'));
  } else {
    yield put(setAgentsTransferMenuPreference(true));
  }

  const selectedQueues = localStorage.getItem(
    `selectedQueues.${tenant.id}.${agent.userId}`
  );
  //  Checking if key exists in localstorage, so we use the ones already stored
  if (
    selectedQueues !== undefined &&
    selectedQueues !== '' &&
    selectedQueues !== null
  ) {
    yield put(
      toggleSelectedQueues(selectedQueues.split(',').map((queue) => queue))
    );
  } else if (selectedQueues === null) {
    //  If key doesn't exist, all will be selected by default
    const defaultQueues = yield select(selectQueues);
    yield put(
      toggleAllSelectedQueuesTransferMenuPreference(
        defaultQueues.map((queue) => queue.id)
      )
    );
  }

  const selectedTransferLists = localStorage.getItem(
    `selectedTransferLists.${tenant.id}.${agent.userId}`
  );
  //  Checking if key exists in localstorage, so we use the ones already stored
  if (
    selectedTransferLists !== undefined &&
    selectedTransferLists !== '' &&
    selectedTransferLists !== null
  ) {
    yield put(
      toggleSelectedTransferLists(
        selectedTransferLists.split(',').map((transferList) => transferList)
      )
    );
  } else if (selectedTransferLists === null) {
    //  If key doesn't exist, all will be selected by default
    const defaultTransferLists = yield select(selectTransferLists);
    if (
      defaultTransferLists !== 'loading' &&
      defaultTransferLists !== 'noTransferListsAvailable'
    ) {
      yield put(
        toggleAllSelectedTransferListsTransferMenuPreference(
          defaultTransferLists.map((transferList) => transferList.id)
        )
      );
    }
  }
}

export function* goToggleAgentsTransferMenuPreference() {
  const agentsTransferMenu = yield select(selectAgentsPreferences);
  yield put(setAgentsTransferMenuPreference(!agentsTransferMenu));
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  localStorage.setItem(
    `agentsTransferMenuList-${tenant.id}-${agent.userId}`,
    !agentsTransferMenu
  );
}

export function* goToggleShowQueuesTransferMenuPreference() {
  const showQueuesTransferMenu = yield select(selectShowQueues);
  yield put(setShowQueuesTransferMenuPreference(!showQueuesTransferMenu));
}

export function* changeSelectedQueuesState() {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  const selectedQueues = yield select(selectSelectedQueues);
  const localStorageKey = `selectedQueues.${tenant.id}.${agent.userId}`;
  window.localStorage.setItem(localStorageKey, selectedQueues);
}

export function* goToggleShowTransferListTransferMenuPreference() {
  const showTransferListTransferMenu = yield select(selectShowTransferLists);
  yield put(
    setShowTransferListTransferMenuPreference(!showTransferListTransferMenu)
  );
}

export function* changeSelectedTransferListsState() {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  const selectedTransferLists = yield select(selectSelectedTransferLists);
  const localStorageKey = `selectedTransferLists.${tenant.id}.${agent.userId}`;
  window.localStorage.setItem(localStorageKey, selectedTransferLists);
}

export default [
  takeEvery(
    ACTIONS.INITIALIZE_TRANSFER_MENU_PREFERENCES,
    goInitializeTransferMenuPreferences
  ),
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
  takeEvery(
    ACTIONS.TOGGLE_SELECTED_QUEUE_TRANSFER_MENU_PREFERENCE,
    changeSelectedQueuesState
  ),
  takeEvery(
    ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE,
    changeSelectedTransferListsState
  ),
  takeEvery(
    ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
    changeSelectedQueuesState
  ),
  takeEvery(
    ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
    changeSelectedTransferListsState
  ),
];
