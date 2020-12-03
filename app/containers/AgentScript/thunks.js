import sdkCallToPromise from 'utils/sdkCallToPromise';

import { selectInteractionsList } from '../AgentDesktop/selectors';

export function sendScript(
  interactionId,
  { id: scriptId, values: answers, scriptReporting },
  dismissed,
  exitReason
) {
  return () => {
    const scriptMap = {
      interactionId,
      scriptId,
      answers,
      dismissed,
      scriptReporting,
      exitReason,
    };
    try {
      sdkCallToPromise(
        CxEngage.interactions.sendScript,
        scriptMap,
        'AgentScript'
      );
    } catch (error) {
      console.error(error);
    }
  };
}

export function sendTimeoutScript(
  {
    scriptReporting,
    autoScriptDismiss,
    submitAfterTimeoutUnit,
    submitAfterTimeoutValue,
  },
  interactionId,
  scriptId,
  exitReason
) {
  return (dispatch, getState) => {
    let autoSubmitTimeout = parseInt(submitAfterTimeoutValue, 10) * 1000;
    if (submitAfterTimeoutUnit === 'minutes') {
      autoSubmitTimeout *= 60;
    } else if (submitAfterTimeoutUnit === 'hours') {
      autoSubmitTimeout *= 60 * 60;
    }
    setTimeout(() => {
      const interactionsList = selectInteractionsList(getState()).toJS();
      const interactionFound = interactionsList.find(
        (interaction) => interaction.interactionId === interactionId
      );
      /**
       * Avoid sending script if it was already manually sent by Agent
       * */
      if (interactionFound && interactionFound.script) {
        const scriptMap = {
          interactionId,
          scriptId,
          answers: interactionFound.script.values,
          dismissed: autoScriptDismiss,
          scriptReporting,
          exitReason,
        };
        if (
          interactionFound.script.id === scriptId &&
          interactionFound.status !== 'wrapup'
        ) {
          try {
            sdkCallToPromise(
              CxEngage.interactions.sendScript,
              scriptMap,
              'AgentScript'
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    }, autoSubmitTimeout);
  };
}
