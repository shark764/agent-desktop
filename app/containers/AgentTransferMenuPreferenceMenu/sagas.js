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

export function* goInitializeTransferMenuAgentsPreference() {
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
}

export function* goInitializeTransferMenuPreferences() {
  yield call(goInitializeTransferMenuAgentsPreference);

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
  const queuesLocalStorageKey = `queuesVisibleStateMap.${tenant.id}.${
    agent.userId
  }`;
  const selectedQueues = yield select(selectSelectedQueues);
  window.localStorage.setItem(
    queuesLocalStorageKey,
    JSON.stringify(selectedQueues)
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
  const queuesLocalStorageKey = `queuesVisibleStateMap.${tenant.id}.${
    agent.userId
  }`;
  window.localStorage.setItem(
    queuesLocalStorageKey,
    JSON.stringify(selectedQueues)
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
  const transferListsLocalStorageKey = `transferListsVisibleStateMap.${
    tenant.id
  }.${agent.userId}`;
  const transferLists = yield select(selectSelectedTransferLists);
  window.localStorage.setItem(
    transferListsLocalStorageKey,
    JSON.stringify(transferLists)
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
  const transferListsLocalStorageKey = `transferListsVisibleStateMap.${
    tenant.id
  }.${agent.userId}`;
  const transferLists = yield select(selectSelectedTransferLists);
  window.localStorage.setItem(
    transferListsLocalStorageKey,
    JSON.stringify(transferLists)
  );
}

export function* updateQueues(action) {
  const [tenant, agent, currentQueues, selectedQueues] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectQueues),
    select(selectSelectedQueues),
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
    const localStorageSelectedQueues =
      JSON.parse(
        localStorage.getItem(
          `queuesVisibleStateMap.${tenant.id}.${agent.userId}`
        )
      ) || [];
    // If there is not stuff set on localStorage we set it up all active queues as selected queues
    if (
      Object.keys(localStorageSelectedQueues).length === 0 // If empty, it is the first time setting the configuration to the user
    ) {
      // Making the new rewritten Tranfer Menu Preference Menu backward compatible
      // First we check for the older keys where the selected queues values were hold on local storage
      const oldSelectedQueues = localStorage.getItem(
        `selectedQueues.${tenant.id}.${agent.userId}`
      )
        ? localStorage
          .getItem(`selectedQueues.${tenant.id}.${agent.userId}`)
          .split(',')
        : [];
      const oldUnselectedQueues = localStorage.getItem(
        `unSelectedQueues.${tenant.id}.${agent.userId}`
      )
        ? localStorage
          .getItem(`unSelectedQueues.${tenant.id}.${agent.userId}`)
          .split(',')
        : [];

      // Getting rid of the old keys on localStorage
      localStorage.removeItem(`selectedQueues.${tenant.id}.${agent.userId}`);
      localStorage.removeItem(`unSelectedQueues.${tenant.id}.${agent.userId}`);

      // Merging the values received from the API with the config we already have stored on the old keys on LocalStorage and then removing any duplicate that could've been caused
      const queuesVisibleStateMap = activeQueues
        .concat(
          oldSelectedQueues.map(id => ({ id })),
          oldUnselectedQueues.map(id => ({ id }))
        )
        .filter(
          (item, i, res) => res.findIndex(({ id }) => item.id === id) === i
        )
        .reduce((result, { id }) => {
          const transferListState = {
            [id]:
              (oldSelectedQueues.includes(id) &&
                !oldUnselectedQueues.includes(id)) ||
              (!oldSelectedQueues.includes(id) &&
                !oldUnselectedQueues.includes(id)),
          };
          return { ...result, ...transferListState };
        }, {});
      yield put(toggleSelectedQueues(queuesVisibleStateMap));
      const queuesLocalStorageKey = `queuesVisibleStateMap.${tenant.id}.${
        agent.userId
      }`;
      window.localStorage.setItem(
        queuesLocalStorageKey,
        JSON.stringify(queuesVisibleStateMap)
      );
    }
    // If there is stuff in localStorage, we set up
    else {
      yield put(
        toggleSelectedQueues(
          Object.keys(localStorageSelectedQueues).length > 0
            ? localStorageSelectedQueues
            : []
        )
      );
      // If there were queues added when user was logged out
      const queuesAddedWhenUserWasLoggedOut = activeQueues.filter(
        queue => !Object.keys(localStorageSelectedQueues).includes(queue.id)
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
  } else {
    const newAddedQueues = activeQueues.filter(
      queue =>
        !currentQueues.map(x => x.id).includes(queue.id) &&
        !Object.keys(selectedQueues).includes(queue.id)
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
  ] = yield all([
    select(selectAgent),
    select(selectTenant),
    select(selectUserAssignedTransferLists),
    select(selectSelectedTransferLists),
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
    const localStorageSelectedTransferLists =
      JSON.parse(
        localStorage.getItem(
          `transferListsVisibleStateMap.${tenant.id}.${agent.userId}`
        )
      ) || [];

    // If there is not stuff set on localStorage we set it up all active transfer list as selected transfer list
    if (
      Object.keys(localStorageSelectedTransferLists).length === 0 &&
      userAssignedTransferlists
    ) {
      // Making the new rewritten Tranfer Menu Preference Menu backward compatible
      // First we check for the older keys where the selected transfer lists values were hold on local storage
      const oldSelectedTransferLists = localStorage.getItem(
        `selectedTransferLists.${tenant.id}.${agent.userId}`
      )
        ? localStorage
          .getItem(`selectedTransferLists.${tenant.id}.${agent.userId}`)
          .split(',')
        : [];
      const oldUnselectedTransferLists = localStorage.getItem(
        `unSelectedTransferLists.${tenant.id}.${agent.userId}`
      )
        ? localStorage
          .getItem(`unSelectedTransferLists.${tenant.id}.${agent.userId}`)
          .split(',')
        : [];

      // Getting rid of the old keys on localStorage
      localStorage.removeItem(
        `selectedTransferLists.${tenant.id}.${agent.userId}`
      );
      localStorage.removeItem(
        `unSelectedTransferLists.${tenant.id}.${agent.userId}`
      );

      // Merging the values received from the API with the config we already have stored on the old keys on LocalStorage and then removing any duplicate that could've been caused
      const transferListsVisibleStateMap = userAssignedTransferlists
        .concat(
          oldSelectedTransferLists.map(id => ({ id })),
          oldUnselectedTransferLists.map(id => ({ id }))
        )
        .filter(
          (item, i, res) => res.findIndex(({ id }) => item.id === id) === i
        )
        .reduce((result, { id }) => {
          const transferListState = {
            [id]:
              (oldSelectedTransferLists.includes(id) &&
                !oldUnselectedTransferLists.includes(id)) ||
              (!oldSelectedTransferLists.includes(id) &&
                !oldUnselectedTransferLists.includes(id)),
          };
          return { ...result, ...transferListState };
        }, {});

      yield put(toggleSelectedTransferLists(transferListsVisibleStateMap));
      const selectedTransferListsLocalStorageKey = `transferListsVisibleStateMap.${
        tenant.id
      }.${agent.userId}`;
      window.localStorage.setItem(
        selectedTransferListsLocalStorageKey,
        JSON.stringify(transferListsVisibleStateMap)
      );
    }
    // If there is stuff in localStorage, we set up
    else if (userAssignedTransferlists) {
      yield put(
        toggleSelectedTransferLists(
          Object.keys(localStorageSelectedTransferLists).length > 0
            ? localStorageSelectedTransferLists
            : []
        )
      );
      // If there were transfer lists added when user was logged out
      const transferListsAddedWhenUserWasLoggedOut = userAssignedTransferlists.filter(
        transferList =>
          !Object.keys(localStorageSelectedTransferLists).includes(
            transferList.id
          )
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
        !Object.keys(selectedTransferLists).includes(transferList.id)
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
    ACTIONS.INITIALIZE_TRANSFER_MENU_AGENTS_PREFERENCE,
    goInitializeTransferMenuAgentsPreference
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
