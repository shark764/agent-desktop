import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import * as ACTIONS from './constants';
import {
  getAndSetTransferLists,
  setQueuesListVisibleState,
  setAgentsListVisibleState,
  setTransferListsVisibleState,
  setTransferSearchInput,
  setTransferTabIndex,
  setShowTransferDialPad,
} from './actions';
import {
  selectQueuesListVisibleState,
  selectAgentsListVisibleState,
  selectTransferListsVisibleState,
} from './selectors';

// Worker Saga for Setting Initial States:

export function* callTransferListsAndUpdateState() {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  let transferLists;
  try {
    transferLists = yield call(
      sdkCallToPromise,
      CxEngage.entities.getEntity,
      { path: ['users', agent.userId, 'transfer-lists'] },
      'transferMenu'
    );
  } catch (err) {
    console.log(err);
  }
  if (transferLists && transferLists.result.length > 0) {
    const activeTransferLists = transferLists.result
      .filter((transferList) => transferList.active === true)
      .map((transferList) => ({
        id: transferList.id,
        name: transferList.name,
        endpoints: transferList.endpoints,
      }));
    const transferListsVisibleState = activeTransferLists.reduce(
      (newObj, list) => ({
        ...newObj,
        [list.id]:
          localStorage.getItem(
            `transferListHiddenState-${list.id}-${tenant.id}-${agent.userId}`
          ) !== 'false',
      }),
      {}
    );
    yield put(getAndSetTransferLists(activeTransferLists));
    yield put(setTransferListsVisibleState(transferListsVisibleState));
  }
}

export function* setAgentsQueuesInitialVisibleState() {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  const queuesListVisibleState =
    localStorage.getItem(
      `queuesListVisibleState-${tenant.id}-${agent.userId}`
    ) !== 'false';
  const agentsListVisibleState =
    localStorage.getItem(
      `agentsListVisibleState-${tenant.id}-${agent.userId}`
    ) !== 'false';
  yield put(setQueuesListVisibleState(queuesListVisibleState));
  yield put(setAgentsListVisibleState(agentsListVisibleState));
}

// Worker Sagas for Updating Previous States:

export function* changeQueuesListVisibleState() {
  const [tenant, agent, prevQueuesListVisibleState] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectQueuesListVisibleState),
  ]);
  yield put(setQueuesListVisibleState(!prevQueuesListVisibleState));
  localStorage.setItem(
    `queuesListVisibleState-${tenant.id}-${agent.userId}`,
    !prevQueuesListVisibleState
  );
}

export function* changeAgentsListVisibleState() {
  const [tenant, agent, prevAgentsListVisibleState] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectAgentsListVisibleState),
  ]);
  yield put(setAgentsListVisibleState(!prevAgentsListVisibleState));
  localStorage.setItem(
    `agentsListVisibleState-${tenant.id}-${agent.userId}`,
    !prevAgentsListVisibleState
  );
}

export function* changeTransferListVisibleState(action) {
  const [tenant, agent, prevTransferListsVisibleState] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectTransferListsVisibleState),
  ]);
  const activeTransferLists = { ...prevTransferListsVisibleState };
  activeTransferLists[action.transferListId] = !activeTransferLists[
    action.transferListId
  ];
  yield put(setTransferListsVisibleState(activeTransferLists));
  localStorage.setItem(
    `transferListHiddenState-${action.transferListId}-${tenant.id}-${
      agent.userId
    }`,
    activeTransferLists[action.transferListId]
  );
}

export function* tearDownTransferMenuStates() {
  yield put(setTransferSearchInput(''));
  yield put(setTransferTabIndex(0));
  yield put(setShowTransferDialPad(false));
}

// Watcher Sagas for Setting Initial States & updating Previous States:

export default [
  takeEvery(ACTIONS.SET_TRANSFER_LISTS, callTransferListsAndUpdateState),
  takeEvery(
    ACTIONS.SET_INITIAL_TRANSFER_MENUS_VISIBLE_STATE,
    setAgentsQueuesInitialVisibleState
  ),
  takeEvery(
    ACTIONS.UPDATE_QUEUES_LIST_VISIBLE_STATE,
    changeQueuesListVisibleState
  ),
  takeEvery(
    ACTIONS.UPDATE_AGENTS_LIST_VISIBLE_STATE,
    changeAgentsListVisibleState
  ),
  takeEvery(
    ACTIONS.UPDATE_TRANSFER_LIST_VISIBLE_STATE,
    changeTransferListVisibleState
  ),
  takeEvery(ACTIONS.TEAR_DOWN_TRANSFER_MENU_STATES, tearDownTransferMenuStates),
];
