import { takeEvery, select, call, put } from 'redux-saga/effects';
import sdkCallToPromise from 'utils/sdkCallToPromise';
import statEqualityCheck from 'utils/statEqualityCheck';

import { selectEnabledStats, selectAvailableStats } from 'containers/AgentStats/selectors';
import { selectTenant, selectAgent } from 'containers/Login/selectors';
import { removeStat, addStat } from './actions';
import { TOGGLE_STAT } from './constants';

export function* goToggleStat(action) {
  const currentStats = yield select(selectEnabledStats);
  const availableStats = yield select(selectAvailableStats);
  const tenant = yield select(selectTenant);
  const agent = yield select(selectAgent);
  const localStorageKey = `agentDesktopStats.${tenant.id}.${agent.userId}`;
  let savedStats = JSON.parse(window.localStorage.getItem(localStorageKey)) || [];

  if (currentStats.filter((item) => statEqualityCheck(item, action.stat)).length) {
    // Remove Stat
    savedStats = savedStats.filter((item) => !statEqualityCheck(item, action.stat));
    window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
    try {
      yield call(
        sdkCallToPromise,
        CxEngage.reporting.removeStatSubscription,
        {
          statId: action.stat.statId,
        },
        'Toolbar'
      );
      yield put(removeStat(action.stat));
    } catch (error) {
      console.error(error); // TODO: Error handling
    }
  } else if (validateStat(action.stat, availableStats, action.queues)) {
    // Add Stat
    const newStat = action.stat;
    if (!action.saved) {
      savedStats.push(newStat);
      window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
    }
    let statRequestBody;
    if (newStat.statSource === 'resource-id') {
      statRequestBody = { statistic: availableStats[newStat.statOption].name, resourceId: action.userId };
    } else if (newStat.statSource === 'queue-id') {
      statRequestBody = { statistic: availableStats[newStat.statOption].name, queueId: newStat.queue };
    } else {
      statRequestBody = { statistic: availableStats[newStat.statOption].name };
    }
    try {
      const response = yield call(
        sdkCallToPromise,
        CxEngage.reporting.addStatSubscription,
        statRequestBody,
        'Toolbar'
      );
      newStat.statId = response.statId;
      yield put(addStat(newStat));
    } catch (error) {
      console.error(error); // TODO: Error handling
    }
  } else {
    // Invalid Stat
    console.warn('[Agent Desktop] - Saved stat failed validation. Removing from saved stats.');
    savedStats = savedStats.filter((item) => !statEqualityCheck(item, action.stat));
    window.localStorage.setItem(localStorageKey, JSON.stringify(savedStats));
  }
}

export function* toggleStat() {
  yield takeEvery(TOGGLE_STAT, goToggleStat);
}

export default [
  toggleStat,
];

function validateStat(stat, availableStats, queues) {
  const statExists = availableStats[stat.statOption];
  const aggregateExists = statExists && Object.keys(availableStats[stat.statOption].responseKeys).includes(stat.statAggregate);
  const filterExists = stat.statSource === 'tenant-id' || (statExists && availableStats[stat.statOption].optionalFilters.includes(stat.statSource));
  let queueExists = true;
  if (stat.statSource === 'queue-id') {
    queueExists = queues.filter((queue) => queue.id === stat.queue).length;
  }
  return aggregateExists && filterExists && queueExists;
}
