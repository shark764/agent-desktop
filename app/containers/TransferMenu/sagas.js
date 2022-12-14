import { takeEvery, put, call, all, select } from 'redux-saga/effects';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import {
  startWarmTransferring,
  transferCancelled,
  setIsColdTransferring,
  setInteractionTransferListsLoadingState,
} from 'containers/AgentDesktop/actions';
import {
  getSelectedInteraction,
  selectVoiceInteraction,
} from 'containers/AgentDesktop/selectors';
import { updateUserAssignedTransferLists } from 'containers/AgentTransferMenuPreferenceMenu/sagas';

import * as ACTIONS from './constants';
import {
  setQueuesListVisibleState,
  setAgentsListVisibleState,
  setTransferSearchInput,
  setTransferTabIndex,
  setShowTransferDialPad,
  setUserAssignedTransferLists,
  setUserAssignedTransferListsLoadingState,
  setUserAssignedTransferListsVisibleState,
  setVisibleStateOfAllUserAssignedTransferLists,
} from './actions';
import {
  selectQueuesListVisibleState,
  selectAgentsListVisibleState,
  selectTransferTabIndex,
  selectUserAssignedTransferLists,
  selectUserAssigTransListsVisibleSt,
  selectUserAssigAllTransListsVisibleSt,
} from './selectors';

// Worker Saga for Setting Initial States:

export function* callUserAssignedTransferListsAndUpdateState(action) {
  const [tenant, agent] = yield all([
    select(selectTenant),
    select(selectAgent),
  ]);
  yield call(updateUserAssignedTransferLists);
  const userAssignedTransferLists = yield select(
    selectUserAssignedTransferLists
  );
  // setting user assigned transfer lists for non-voice interactions type:
  if (action.channelType === 'nonVoice') {
    if (userAssignedTransferLists) {
      const nonVoiceTransferLists = userAssignedTransferLists
        .map(({ id, name, endpoints, transferListRenderUUID }) => {
          const queueEndPoints = endpoints.filter(
            endpoint => endpoint.contactType === 'queue'
          );
          return {
            id,
            name,
            endpoints: queueEndPoints,
            transferListRenderUUID,
          };
        })
        .filter(({ endpoints }) => endpoints.length > 0);
      yield put(
        setUserAssignedTransferLists(nonVoiceTransferLists, action.channelType)
      );
    } else {
      yield put(setUserAssignedTransferLists(null, action.channelType));
    }
  }
  // setting initial individual transfer-lists visible state:
  if (userAssignedTransferLists && userAssignedTransferLists.length > 0) {
    const userAssignedTransferListsVisibleState = userAssignedTransferLists.reduce(
      (newObj, list) => ({
        ...newObj,
        [list.id]:
          localStorage.getItem(
            `assignedTransferListHiddenState/${tenant.id}/${agent.userId}/${
              list.id
            }`
          ) !== 'false',
      }),
      {}
    );
    yield put(
      setUserAssignedTransferListsVisibleState(
        userAssignedTransferListsVisibleState
      )
    );
    // setting initial visible state for all of the user-assigned transfer lists:
    const visibleStateOfAllAssignedTransferLists =
      localStorage.getItem(
        `visibleStateOfAllAssignedTransferLists/${tenant.id}/${agent.userId}`
      ) !== 'false';
    yield put(
      setVisibleStateOfAllUserAssignedTransferLists(
        visibleStateOfAllAssignedTransferLists
      )
    );
  } else {
    yield put(setUserAssignedTransferListsVisibleState(null));
    yield put(setVisibleStateOfAllUserAssignedTransferLists(null));
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

export function* changeUserAssignedTransferListVisibleState(action) {
  const [tenant, agent, prevTransferListsVisibleState] = yield all([
    select(selectTenant),
    select(selectAgent),
    select(selectUserAssigTransListsVisibleSt),
  ]);
  const userAssignedTransferLists = { ...prevTransferListsVisibleState };
  userAssignedTransferLists[action.transferListId] = !userAssignedTransferLists[
    action.transferListId
  ];
  yield put(
    setUserAssignedTransferListsVisibleState(userAssignedTransferLists)
  );
  localStorage.setItem(
    `assignedTransferListHiddenState/${tenant.id}/${agent.userId}/${
      action.transferListId
    }`,
    userAssignedTransferLists[action.transferListId]
  );
}

export function* changeVisibleStateofAllUserAssignedTransferLists() {
  const [tenant, agent, visibleStateOfAllUserAssignedTransferLists] = yield all(
    [
      select(selectTenant),
      select(selectAgent),
      select(selectUserAssigAllTransListsVisibleSt),
    ]
  );
  yield put(
    setVisibleStateOfAllUserAssignedTransferLists(
      !visibleStateOfAllUserAssignedTransferLists
    )
  );
  localStorage.setItem(
    `visibleStateOfAllAssignedTransferLists/${tenant.id}/${agent.userId}`,
    !visibleStateOfAllUserAssignedTransferLists
  );
}

export function* tearDownTransferMenuStates(action) {
  const [selectedInteraction, voiceInteraction] = yield all([
    select(getSelectedInteraction),
    select(selectVoiceInteraction),
  ]);
  yield put(setTransferSearchInput(''));
  yield put(setTransferTabIndex(0));
  yield put(setShowTransferDialPad(false));
  if (action.channelType === 'voice' && voiceInteraction !== undefined) {
    yield put(
      setInteractionTransferListsLoadingState(
        voiceInteraction.interactionId,
        true
      )
    );
  } else if (
    action.channelType === 'nonVoice' &&
    selectedInteraction !== undefined
  ) {
    yield put(
      setInteractionTransferListsLoadingState(
        selectedInteraction.interactionId,
        true
      )
    );
  }
  yield put(setUserAssignedTransferListsLoadingState(action.channelType, true));
}

export function* transferInteraction(action) {
  const {
    setShowTransferMenu,
    isTransferringInteractionNonVoice,
    name,
    resourceId,
    queueId,
    transferExtension,
  } = action;

  let interactionId;
  let transferType;

  if (!isTransferringInteractionNonVoice) {
    ({ interactionId } = yield select(selectVoiceInteraction));
  } else if (isTransferringInteractionNonVoice) {
    ({ interactionId } = yield select(getSelectedInteraction));
  }
  const transferTabIndex = yield select(selectTransferTabIndex);

  // We do this in here so the TransferMenu hides before doing anything else
  yield call(setShowTransferMenu);

  if (transferTabIndex === 0 && !isTransferringInteractionNonVoice) {
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
    yield put(setIsColdTransferring(interactionId, true));
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
      } else {
        yield put(setIsColdTransferring(interactionId, false));
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
      } else {
        yield put(setIsColdTransferring(interactionId, false));
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
      } else {
        yield put(setIsColdTransferring(interactionId, false));
      }
    }
  } else {
    throw new Error(
      'neither resourceId, queueId, nor transferExtension passed in'
    );
  }
}

// Watcher Sagas for Setting Initial States & updating Previous States:

export default [
  takeEvery(
    ACTIONS.UPDATE_USER_ASSIGNED_TRANSFER_LISTS,
    callUserAssignedTransferListsAndUpdateState
  ),
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
    ACTIONS.UPDATE_USER_ASSIGNED_TRANSFER_LIST_VISIBLE_STATE,
    changeUserAssignedTransferListVisibleState
  ),
  takeEvery(
    ACTIONS.UPDATE_VISIBLE_STATE_OF_ALL_USER_ASSIGNED_TRANSFER_LISTS,
    changeVisibleStateofAllUserAssignedTransferLists
  ),
  takeEvery(ACTIONS.TEAR_DOWN_TRANSFER_MENU_STATES, tearDownTransferMenuStates),
  takeEvery(ACTIONS.TRANSFER_INTERACTION, transferInteraction),
];
