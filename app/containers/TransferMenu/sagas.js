import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import {
  startWarmTransferring,
  transferCancelled,
} from 'containers/AgentDesktop/actions';
import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';
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
  selectTransferTabIndex,
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
      'TransferMenu'
    );
  } catch (err) {
    // Error handled in error saga
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
  } else {
    yield put(getAndSetTransferLists('noTransferListsAvailable'));
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

export function* transferInteraction(action) {
  const {
    setShowTransferMenu,
    name,
    resourceId,
    queueId,
    transferExtension,
  } = action;
  const [{ interactionId, channelType }, transferTabIndex] = yield all([
    select(getSelectedInteraction),
    select(selectTransferTabIndex),
  ]);
  let transferType;
  if (transferTabIndex === 0 && channelType === 'voice') {
    transferType = 'warm';
    let id;
    let type;
    if (queueId !== undefined) {
      id = queueId;
      type = 'queue';
    } else if (resourceId !== undefined) {
      id = resourceId;
      type = 'agent';
    } else if (transferExtension !== undefined) {
      id = transferExtension;
      type = 'transferExtension';
    } else {
      throw new Error(
        'warm transfer: neither resourceId, queueId, nor transferExtension passed in'
      );
    }
    const transferringTo = {
      id,
      type,
      name,
    };
    yield put(startWarmTransferring(interactionId, transferringTo));
  } else {
    transferType = 'cold';
  }

  if (queueId !== undefined) {
    console.log('transferToQueue()', interactionId, transferType, queueId);
    try {
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.transferToQueue,
        {
          interactionId,
          queueId,
          transferType,
        },
        'TransferMenu'
      );
    } catch (error) {
      console.error(error);
      if (transferType === 'warm') {
        yield put(transferCancelled(interactionId));
      }
    }
  } else if (resourceId !== undefined) {
    console.log(
      'transferToResource()',
      interactionId,
      transferType,
      resourceId
    );
    try {
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.transferToResource,
        {
          interactionId,
          resourceId,
          transferType,
        },
        'TransferMenu'
      );
    } catch (error) {
      console.error(error);
      if (transferType === 'warm') {
        yield put(transferCancelled(interactionId));
      }
    }
  } else if (transferExtension !== undefined) {
    console.log(
      'transferToExtension()',
      interactionId,
      transferType,
      transferExtension
    );
    try {
      yield call(
        sdkCallToPromise,
        CxEngage.interactions.transferToExtension,
        {
          interactionId,
          transferExtension,
          transferType,
        },
        'TransferMenu'
      );
    } catch (error) {
      console.error(error);
      if (transferType === 'warm') {
        yield put(transferCancelled(interactionId));
      }
    }
  } else {
    throw new Error(
      'neither resourceId, queueId, nor transferExtension passed in'
    );
  }
  yield call(setShowTransferMenu);
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
  takeEvery(ACTIONS.TRANSFER_INTERACTION, transferInteraction),
];
