import { generateUUID } from 'utils/uuid';
import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import { setUserAssignedTransferLists } from 'containers/TransferMenu/actions';
import { UPDATE_QUEUES } from 'containers/TransferMenu/constants';
import { selectUserAssignedTransferLists } from 'containers/TransferMenu/selectors';
import { takeLeading } from 'utils/takeLeading';
import { setQueues } from 'containers/AgentDesktop/actions';
import { selectQueues } from 'containers/AgentDesktop/selectors';
import * as ACTIONS from './constants';

import {
  selectAgentsPreferences,
  selectShowQueues,
  selectShowTransferLists,
  selectSelectedQueues,
  selectSelectedTransferLists,
  selectUnSelectSelectedQueues,
  selectUnselectedTransferLists,
} from './selectors';
import {
  setAgentsTransferMenuPreference,
  setShowQueuesTransferMenuPreference,
  setShowTransferListTransferMenuPreference,
  toggleSelectedQueues,
  toggleSelectedTransferLists,
  setPreferenceMenuQueuesLoading,
  setPreferenceMenuTransferListsLoading,
  toggleSelectedTransferListTransferMenuPreferenceOnState,
  toggleAllSelectedTransferListsTransferMenuPreferenceOnState,
  toggleSelectedQueueTransferMenuPreferenceOnState,
  toggleAllSelectedQueuesTransferMenuPreferenceOnState,
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

  yield put(setPreferenceMenuQueuesLoading(true));
  yield put(setPreferenceMenuTransferListsLoading(true));

  yield call(updateQueues);
  yield put(setPreferenceMenuQueuesLoading(false));

  yield call(updateUserAssignedTransferLists);
  yield put(setPreferenceMenuTransferListsLoading(false));
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

export function* changeSelectedQueueState(action) {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  yield put(toggleSelectedQueueTransferMenuPreferenceOnState(action.queue));

  const queuesLocalStorageKey = `selectedQueues.${tenant.id}.${agent.userId}`;
  const selectedQueues = yield select(selectSelectedQueues);
  window.localStorage.setItem(queuesLocalStorageKey, selectedQueues);

  const unSelectedQueuesLocalStorageKey = `unSelectedQueues.${tenant.id}.${
    agent.userId
  }`;
  const unSelectedQueues = yield select(selectUnSelectSelectedQueues);
  window.localStorage.setItem(
    unSelectedQueuesLocalStorageKey,
    unSelectedQueues
  );
}

export function* changeAllQueuesState(action) {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  yield put(
    toggleAllSelectedQueuesTransferMenuPreferenceOnState(action.queues)
  );
  const selectedQueues = yield select(selectSelectedQueues);
  const localStorageKey = `selectedQueues.${tenant.id}.${agent.userId}`;
  window.localStorage.setItem(localStorageKey, selectedQueues);
  const unSelectedQueuesLocalStorageKey = `unSelectedQueues.${tenant.id}.${
    agent.userId
  }`;
  const unSelectedQueues = yield select(selectUnSelectSelectedQueues);
  window.localStorage.setItem(
    unSelectedQueuesLocalStorageKey,
    unSelectedQueues
  );
}

export function* goToggleShowTransferListTransferMenuPreference() {
  const showTransferListTransferMenu = yield select(selectShowTransferLists);
  yield put(
    setShowTransferListTransferMenuPreference(!showTransferListTransferMenu)
  );
}

export function* changeSelectedTransferListState(action) {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  yield put(
    toggleSelectedTransferListTransferMenuPreferenceOnState(action.transferList)
  );
  const transferListsLocalStorageKey = `selectedTransferLists.${tenant.id}.${
    agent.userId
  }`;
  const transferLists = yield select(selectSelectedTransferLists);
  window.localStorage.setItem(transferListsLocalStorageKey, transferLists);
  const unSelectedTransferListsLocalStorageKey = `unSelectedTransferLists.${
    tenant.id
  }.${agent.userId}`;
  const unSelectedTransferLists = yield select(selectUnselectedTransferLists);
  window.localStorage.setItem(
    unSelectedTransferListsLocalStorageKey,
    unSelectedTransferLists
  );
}

export function* changeAllTransferListState(action) {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  yield put(
    toggleAllSelectedTransferListsTransferMenuPreferenceOnState(
      action.transferLists
    )
  );
  const localStorageKey = `selectedTransferLists.${tenant.id}.${agent.userId}`;
  const transferLists = yield select(selectSelectedTransferLists);
  window.localStorage.setItem(localStorageKey, transferLists);
  const unSelectedTransferListsLocalStorageKey = `unSelectedTransferLists.${
    tenant.id
  }.${agent.userId}`;
  const unSelectedTransferLists = yield select(selectUnselectedTransferLists);
  window.localStorage.setItem(
    unSelectedTransferListsLocalStorageKey,
    unSelectedTransferLists
  );
}

export function* updateQueues(action) {
  const [
    tenant,
    agent,
    currentQueues,
    selectedQueues,
    unSelectedQueues,
  ] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectQueues),
    select(selectSelectedQueues),
    select(selectUnSelectSelectedQueues),
  ]);
  let defaultQueues;
  let activeQueues;
  try {
    defaultQueues = yield call(
      sdkCallToPromise,
      CxEngage.entities.getQueues,
      {},
      'AgentTransferMenuPreferenceMenu'
    );
    activeQueues = defaultQueues.result.filter(queue => queue.active);
    yield put(setQueues(activeQueues));
  } catch (err) {
    // Error handled in error saga
  }

  // User just logged in
  if (currentQueues.length === 0) {
    const localStorageSelectedQueues = localStorage.getItem(
      `selectedQueues.${tenant.id}.${agent.userId}`
    );
    const localStorageUnSelectedQueues = localStorage.getItem(
      `unSelectedQueues.${tenant.id}.${agent.userId}`
    );
    // If there's stuff set on localStorage we set it up
    if (localStorageSelectedQueues && localStorageUnSelectedQueues) {
      yield put(
        toggleSelectedQueues(
          localStorageSelectedQueues.length > 0
            ? localStorageSelectedQueues.split(',').map(queue => queue)
            : [],
          localStorageUnSelectedQueues.length > 0
            ? localStorageUnSelectedQueues.split(',').map(queue => queue)
            : []
        )
      );
      // If there were queues added when user was logged out
      const queuesAddedWhenUserWasLoggedOut = activeQueues.filter(
        queue =>
          !localStorageSelectedQueues.includes(queue.id) &&
          !localStorageUnSelectedQueues.includes(queue.id)
      );
      if (queuesAddedWhenUserWasLoggedOut.length > 0) {
        yield all(
          queuesAddedWhenUserWasLoggedOut.map(queue =>
            call(changeSelectedQueueState, {
              queue: queue.id,
            })
          )
        );
      }
    }
    // If not we set up all active queues as selected queues
    else {
      yield put(toggleSelectedQueues(activeQueues.map(queue => queue.id), []));
      const localStorageKey = `selectedQueues.${tenant.id}.${agent.userId}`;
      window.localStorage.setItem(
        localStorageKey,
        activeQueues.map(queue => queue.id)
      );
      const unSelectedQueuesLocalStorageKey = `unSelectedQueues.${tenant.id}.${
        agent.userId
      }`;
      window.localStorage.setItem(unSelectedQueuesLocalStorageKey, []);
    }
  } else {
    const newAddedQueues = activeQueues.filter(
      queue =>
        !currentQueues.map(x => x.id).includes(queue.id) &&
        !selectedQueues.includes(queue.id) &&
        !unSelectedQueues.includes(queue.id)
    );
    if (newAddedQueues.length > 0) {
      yield all(
        newAddedQueues.map(queue =>
          call(changeSelectedQueueState, {
            queue: queue.id,
          })
        )
      );
    }
  }
  if (action && action.refreshQueues) {
    yield call(action.refreshQueues);
  }
}

export function* updateUserAssignedTransferLists() {
  const [
    agent,
    tenant,
    currentUserAssignedTransferlists,
    selectedTransferLists,
    unSelectedTransferLists,
  ] = yield all([
    select(selectAgent),
    select(selectTenant),
    select(selectUserAssignedTransferLists),
    select(selectSelectedTransferLists),
    select(selectUnselectedTransferLists),
  ]);
  let transferLists;
  let userAssignedTransferlists;
  try {
    transferLists = yield call(
      sdkCallToPromise,
      CxEngage.entities.getEntity,
      {
        path: ['users', agent.userId, 'transfer-lists'],
      },
      'AgentTransferMenuPreferenceMenu'
    );
    if (
      transferLists &&
      transferLists.result &&
      transferLists.result.length > 0
    ) {
      const activeTransferLists = transferLists.result.filter(
        transferList => transferList.active === true
      );
      // setting user-assigned transfer lists:
      userAssignedTransferlists = activeTransferLists.map(
        ({ id, name, endpoints }) => {
          const updatedEndpoints = [];
          endpoints.forEach(endpoint => {
            // Creating hierarchy and endpoint UUID's to use them as keys while rendering - similar hierarchy's should have the same UUID
            const existingHierarchy = updatedEndpoints.find(
              val => endpoint.hierarchy === val.hierarchy
            );
            if (existingHierarchy === undefined) {
              updatedEndpoints.push({
                ...endpoint,
                endPointRenderUUID: generateUUID(),
                hierarchyRenderUUID: generateUUID(),
              });
            } else {
              updatedEndpoints.push({
                ...endpoint,
                endPointRenderUUID: generateUUID(),
                hierarchyRenderUUID: existingHierarchy.hierarchyRenderUUID,
              });
            }
          });
          return {
            id,
            name,
            endpoints: updatedEndpoints,
            transferListRenderUUID: generateUUID(),
          };
        }
      );
      yield put(setUserAssignedTransferLists(userAssignedTransferlists));
    } else {
      yield put(setUserAssignedTransferLists(null));
    }
  } catch (err) {
    // Error handled in error saga
  }
  // User just logged in
  if (currentUserAssignedTransferlists === null) {
    const localStorageSelectedTransferLists = localStorage.getItem(
      `selectedTransferLists.${tenant.id}.${agent.userId}`
    );
    const localStorageUnSelectedTransferLists = localStorage.getItem(
      `unSelectedTransferLists.${tenant.id}.${agent.userId}`
    );
    // If there's stuff set on localStorage we set it up
    if (
      localStorageSelectedTransferLists &&
      localStorageUnSelectedTransferLists &&
      userAssignedTransferlists
    ) {
      yield put(
        toggleSelectedTransferLists(
          localStorageSelectedTransferLists.length > 0
            ? localStorageSelectedTransferLists
              .split(',')
              .map(transferList => transferList)
            : [],
          localStorageUnSelectedTransferLists.length > 0
            ? localStorageUnSelectedTransferLists
              .split(',')
              .map(transferList => transferList)
            : []
        )
      );
      // If there were transfer lists added when user was logged out
      const transferListsAddedWhenUserWasLoggedOut = userAssignedTransferlists.filter(
        transferList =>
          !localStorageSelectedTransferLists.includes(transferList.id) &&
          !localStorageUnSelectedTransferLists.includes(transferList.id)
      );
      if (transferListsAddedWhenUserWasLoggedOut.length > 0) {
        yield all(
          transferListsAddedWhenUserWasLoggedOut.map(transferList =>
            call(changeSelectedTransferListState, {
              transferList: transferList.id,
            })
          )
        );
      }
    }
    // If not we set up all active transfer list as selected transfer list
    else if (userAssignedTransferlists) {
      yield put(
        toggleSelectedTransferLists(
          userAssignedTransferlists.map(transferList => transferList.id),
          []
        )
      );
      const localStorageKey = `selectedTransferLists.${tenant.id}.${
        agent.userId
      }`;
      window.localStorage.setItem(
        localStorageKey,
        userAssignedTransferlists.map(transferList => transferList.id)
      );
      const unSelectedTransferListsLocalStorageKey = `unSelectedTransferLists.${
        tenant.id
      }.${agent.userId}`;
      window.localStorage.setItem(unSelectedTransferListsLocalStorageKey, []);
    } else {
      yield put(setUserAssignedTransferLists(null));
    }
  } else if (userAssignedTransferlists) {
    //  Checking if there are transfer lists so we can check if it is a new one
    const newAddedTransferLists = userAssignedTransferlists.filter(
      transferList =>
        !currentUserAssignedTransferlists
          .map(userAssignedTransferList => userAssignedTransferList.id)
          .includes(transferList.id) &&
        !selectedTransferLists.includes(transferList.id) &&
        !unSelectedTransferLists.includes(transferList.id)
    );
    if (newAddedTransferLists.length > 0) {
      yield all(
        newAddedTransferLists.map(transferList =>
          call(changeSelectedTransferListState, {
            transferList: transferList.id,
          })
        )
      );
    }
  } else {
    //  The user has no transfer lists
    yield put(setUserAssignedTransferLists(null));
  }
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
    changeSelectedQueueState
  ),
  takeEvery(
    ACTIONS.TOGGLE_SELECTED_TRANSFER_LIST_TRANSFER_MENU_PREFERENCE,
    changeSelectedTransferListState
  ),
  takeEvery(
    ACTIONS.TOGGLE_ALL_SELECTED_QUEUES_TRANSFER_MENU_PREFERENCE,
    changeAllQueuesState
  ),
  takeEvery(
    ACTIONS.TOGGLE_ALL_SELECTED_TRANSFER_LISTS_TRANSFER_MENU_PREFERENCE,
    changeAllTransferListState
  ),

  takeLeading(UPDATE_QUEUES, updateQueues),
];
