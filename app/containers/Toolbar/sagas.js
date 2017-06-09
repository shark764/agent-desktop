/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { takeEvery, select, call, put } from 'redux-saga/effects';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import statEqualityCheck from 'utils/statEqualityCheck';

import { stats as welcomeStatsConfig } from 'containers/WelcomeStats/welcomeStatsConfig';

import { selectQueues } from 'containers/AgentDesktop/selectors';
import { selectEnabledStats, selectAvailableStats } from 'containers/AgentStats/selectors';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import { selectWelcomeStatIds } from './selectors';
import { removeStat, addStat, removeToolbarStatId, addToolbarStatId, addWelcomeStatId, activateToolbarStat as activateToolbarStatAction } from './actions';
import { ACTIVATE_TOOLBAR_STAT, DEACTIVATE_TOOLBAR_STAT, INITIALIZE_STATS } from './constants';

export function* getEnabledStat(stat) {
  const currentStats = yield select(selectEnabledStats);
  return currentStats.find((item) => statEqualityCheck(item, stat));
}

export function* disableStat(statId) {
  try {
    yield call(
      sdkCallToPromise,
      CxEngage.reporting.removeStatSubscription,
      {
        statId,
      },
      'Toolbar'
    );
  } catch (error) {
    console.error(error); // TODO: Error handling
  }
}

export function* enableStat(stat) {
  const agent = yield select(selectAgent);
  const availableStats = yield select(selectAvailableStats);
  let statRequestBody;
  const newStat = { ...stat };
  if (newStat.statSource === 'resource-id') {
    statRequestBody = {
      statistic: availableStats[newStat.statOption].name,
      resourceId: agent.userId,
    };
  } else if (newStat.statSource === 'queue-id') {
    statRequestBody = {
      statistic: availableStats[newStat.statOption].name,
      queueId: newStat.queue,
    };
  } else {
    statRequestBody = {
      statistic: availableStats[newStat.statOption].name,
    };
  }
  try {
    const response = yield call(
      sdkCallToPromise,
      CxEngage.reporting.addStatSubscription,
      statRequestBody,
      'Toolbar'
    );
    newStat.statId = response.statId;
    return newStat;
  } catch (error) {
    return console.error(error); // TODO: Error handling
  }
}

export function* setStatSaved(stat, willSave) {
  const tenant = yield select(selectTenant);
  const agent = yield select(selectAgent);
  const localStorageKey = `agentDesktopStats.${tenant.id}.${agent.userId}`;
  let savedStats = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
  savedStats = savedStats.filter((item) => !statEqualityCheck(item, stat));
  if (willSave) {
    savedStats.push(stat);
  }
  window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
}

export function* goActivateWelcomeStat(stat) {
  let enabledStat = yield call(getEnabledStat, stat);
  if (!enabledStat) {
    enabledStat = yield call(enableStat, stat);
    yield put(addStat(enabledStat));
  }
  yield put(addWelcomeStatId(enabledStat.statId));
}

export function* goActivateToolbarStat(action) {
  if (yield call(validateStat, action.stat)) {
    let enabledStat = yield call(getEnabledStat, action.stat);
    if (!enabledStat) {
      enabledStat = yield call(enableStat, action.stat);
      yield put(addStat(enabledStat));
    }
    yield call(setStatSaved, action.stat, true);
    yield put(addToolbarStatId(enabledStat.statId));
  } else {
    console.warn('[Agent Desktop] - Saved stat failed validation. Removing from saved stats.');
    setStatSaved(action.stat, false);
  }
}

export function* goDeactivateToolbarStat(action) {
  const enabledStat = yield call(getEnabledStat, action.stat);
  if (enabledStat) {
    const welcomeStatIds = yield select(selectWelcomeStatIds());
    if (!welcomeStatIds.includes(enabledStat.statId)) {
      yield (call(disableStat, enabledStat.statId));
      yield put(removeStat(action.stat));
    }
  }
  yield call(setStatSaved, action.stat, false);
  yield put(removeToolbarStatId(action.stat.statId));
}

export function* goInitializeStats() {
  yield welcomeStatsConfig.map((stat) => call(goActivateWelcomeStat, stat));
  const tenant = yield select(selectTenant);
  const agent = yield select(selectAgent);
  const localStorageKey = `agentDesktopStats.${tenant.id}.${agent.userId}`;
  const savedStats = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];
  yield savedStats.map((stat) => put(activateToolbarStatAction(stat)));
}

export function* activateToolbarStat() {
  yield takeEvery(ACTIVATE_TOOLBAR_STAT, goActivateToolbarStat);
}
export function* deactivateToolbarStat() {
  yield takeEvery(DEACTIVATE_TOOLBAR_STAT, goDeactivateToolbarStat);
}
export function* initializeStats() {
  yield takeEvery(INITIALIZE_STATS, goInitializeStats);
}

export default [
  activateToolbarStat,
  deactivateToolbarStat,
  initializeStats,
];

export function* validateStat(stat) {
  const availableStats = yield select(selectAvailableStats);
  const queues = yield select(selectQueues);
  const statExists = availableStats[stat.statOption];
  const aggregateExists = statExists && Object.keys(availableStats[stat.statOption].responseKeys).includes(stat.statAggregate);
  const filterExists = stat.statSource === 'tenant-id' || (statExists && availableStats[stat.statOption].optionalFilters.includes(stat.statSource));
  let queueExists = true;
  if (stat.statSource === 'queue-id') {
    queueExists = queues.filter((queue) => queue.id === stat.queue).length;
  }
  return aggregateExists && filterExists && queueExists;
}
