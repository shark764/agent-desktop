/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { call, takeEvery } from 'redux-saga/effects';

import sdkCallToPromise from 'utils/sdkCallToPromise';

import { SEND_SCRIPT } from './constants';

export function* goSendScript(action) {
  const scriptMap = {
    interactionId: action.interactionId,
    scriptId: action.script.id,
    answers: action.script.values,
    dismissed: action.dismissed,
    scriptReporting: action.script.scriptReporting,
  };
  try {
    yield call(
      sdkCallToPromise,
      CxEngage.interactions.sendScript,
      scriptMap,
      'AgentScript'
    );
  } catch (error) {
    console.log(error);
  }
}

export function* sendScript() {
  yield takeEvery(SEND_SCRIPT, goSendScript);
}

// All sagas to be loaded
export default [sendScript];
