import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import { setUserAssignedTransferLists } from 'containers/TransferMenu/actions';
import { UPDATE_QUEUES } from 'containers/TransferMenu/constants';
import { selectUserAssignedTransferLists } from 'containers/TransferMenu/selectors';
import { takeLeading } from 'utils/takeLeading';
import { setQueues } from 'containers/AgentDesktop/actions';
import {
  selectQueues,
  getSelectedInteraction,
} from 'containers/AgentDesktop/selectors';
import { isAlpha } from 'utils/url';
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

export function* goInitializeTransferMenuPreferences() {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);

  //  Toggle the value to show/hide agent list just if isAlpha, default value in redux is true
  if (isAlpha()) {
    const agentPreference = localStorage.getItem(
      `agentsTransferMenuList-${tenant.id}-${agent.userId}`
    );

    if (agentPreference !== null) {
      yield put(setAgentsTransferMenuPreference(agentPreference === 'true'));
    } else {
      yield put(setAgentsTransferMenuPreference(true));
    }
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
  const localStorageKey = `selectedQueues.${tenant.id}.${agent.userId}`;
  const queues = yield select(selectSelectedQueues);
  window.localStorage.setItem(localStorageKey, queues);
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
  const localStorageKey = `selectedTransferLists.${tenant.id}.${agent.userId}`;
  const transferLists = yield select(selectSelectedTransferLists);
  window.localStorage.setItem(localStorageKey, transferLists);
}

export function* changeAllTransferListState(action) {
  const [tenant, agent, selectedTransferLists] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectSelectedTransferLists),
  ]);
  yield put(
    toggleAllSelectedTransferListsTransferMenuPreferenceOnState(
      action.transferLists
    )
  );
  const localStorageKey = `selectedTransferLists.${tenant.id}.${agent.userId}`;
  if (
    selectedTransferLists.length < action.transferLists.length &&
    action.transferLists.length > 0
  ) {
    const transferLists = yield select(selectUserAssignedTransferLists);
    window.localStorage.setItem(
      localStorageKey,
      transferLists.map((transferList) => transferList.id)
    );
  } else {
    window.localStorage.setItem(localStorageKey, '');
  }
}

export function* updateQueues(action) {
  const [tenant, agent, currentQueues, selectedQueues] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectQueues),
    select(selectSelectedQueues),
  ]);

  let localStorageSelectedQueues = null;
  if (isAlpha()) {
    localStorageSelectedQueues = localStorage.getItem(
      `selectedQueues.${tenant.id}.${agent.userId}`
    );
  }
  let defaultQueues;
  let activeQueues;
  try {
    defaultQueues = yield call(
      sdkCallToPromise,
      CxEngage.entities.getQueues,
      {},
      'AgentTransferMenuPreferenceMenu'
    );
    activeQueues = defaultQueues.result.filter((queue) => queue.active);
    yield put(setQueues(activeQueues));
  } catch (err) {
    // Error handled in error saga
  }
  const newAddedQueues = activeQueues.filter(
    (queue) =>
      !currentQueues.map((x) => x.id).includes(queue.id) &&
      !selectedQueues.includes(queue.id)
  );
  if (currentQueues.length > 0 && newAddedQueues.length > 0) {
    yield all(
      newAddedQueues.map((queue) =>
        call(changeSelectedQueueState, { queue: queue.id })
      )
    );
  } else if (
    currentQueues.length === 0 &&
    localStorageSelectedQueues === null &&
    isAlpha()
  ) {
    //  Setting all queues to visible state just the first time the agent logs in
    yield call(changeAllQueuesState, {
      queues: activeQueues.map((queue) => queue.id),
    });
  }
  if (isAlpha()) {
    //  Storing in local storage just when isAlpha
    const selectedQueuesAfterUpdate = localStorage.getItem(
      `selectedQueues.${tenant.id}.${agent.userId}`
    );

    yield put(
      toggleSelectedQueues(
        selectedQueuesAfterUpdate.split(',').map((queue) => queue)
      )
    );
  }

  if (action && action.refreshQueues) {
    yield call(action.refreshQueues);
  }
}

export function* updateUserAssignedTransferLists() {
  const [
    agent,
    tenant,
    selectedInteraction,
    currentUserAssignedTransferlists,
    selectedTransferLists,
  ] = yield all([
    select(selectAgent),
    select(selectTenant),
    select(getSelectedInteraction),
    select(selectUserAssignedTransferLists),
    select(selectSelectedTransferLists),
  ]);

  let localStorageselectedTransferLists = null;
  if (isAlpha()) {
    localStorageselectedTransferLists = localStorage.getItem(
      `selectedTransferLists.${tenant.id}.${agent.userId}`
    );
  }
  let transferLists;
  try {
    transferLists = yield call(
      sdkCallToPromise,
      CxEngage.entities.getEntity,
      { path: ['users', agent.userId, 'transfer-lists'] },
      'AgentTransferMenuPreferenceMenu'
    );
  } catch (err) {
    // Error handled in error saga
  }
  if (transferLists && transferLists.result.length > 0) {
    const activeTransferLists = transferLists.result.filter(
      (transferList) => transferList.active === true
    );
    // setting user-assigned transfer lists:
    let userAssignedTransferlists = [];
    if (selectedInteraction.channelType === 'voice') {
      userAssignedTransferlists = activeTransferLists.map(
        ({ id, name, endpoints }) => ({
          id,
          name,
          endpoints,
        })
      );
    } else {
      userAssignedTransferlists = activeTransferLists
        .map(({ id, name, endpoints }) => {
          const queueEndPoints = endpoints.filter(
            (endpoint) => endpoint.contactType === 'queue'
          );
          return {
            id,
            name,
            endpoints: queueEndPoints,
          };
        })
        .filter(({ endpoints }) => endpoints.length > 0);
    }

    yield put(setUserAssignedTransferLists(userAssignedTransferlists));
    if (currentUserAssignedTransferlists !== null) {
      const newAddedTransferLists = userAssignedTransferlists.filter(
        (transferList) =>
          !currentUserAssignedTransferlists
            .map((x) => x.id)
            .includes(transferList.id) &&
          !selectedTransferLists.includes(transferList.id)
      );
      if (
        currentUserAssignedTransferlists.length > 0 &&
        newAddedTransferLists.length > 0
      ) {
        if (isAlpha()) {
          yield all(
            newAddedTransferLists.map((transferList) =>
              call(changeSelectedTransferListState, {
                transferList: transferList.id,
              })
            )
          );
        }
      }
    } else if (
      userAssignedTransferlists.length > 0 &&
      localStorageselectedTransferLists === null
    ) {
      if (isAlpha()) {
        yield call(changeAllTransferListState, {
          transferLists: userAssignedTransferlists.map(
            (transferList) => transferList.id
          ),
        });
      }
    }

    if (isAlpha()) {
      const selectedTransferListsAfterUpdate = localStorage.getItem(
        `selectedTransferLists.${tenant.id}.${agent.userId}`
      );

      yield put(
        toggleSelectedTransferLists(
          selectedTransferListsAfterUpdate
            .split(',')
            .map((transferList) => transferList)
        )
      );
    }
  } else {
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
