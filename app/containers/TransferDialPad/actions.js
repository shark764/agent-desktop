import * as ACTIONS from './constants';

// Reducer Actions:

export function setDialpadText(dialpadText) {
  return {
    type: ACTIONS.SET_DIAL_PAD_TEXT,
    dialpadText,
  };
}

// Saga Actions:

export function updateDialpadText(dialpadText) {
  return {
    type: ACTIONS.UPDATE_DIAL_PAD_TEXT,
    dialpadText,
  };
}
