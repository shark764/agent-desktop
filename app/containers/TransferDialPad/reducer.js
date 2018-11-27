import { fromJS } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  dialpadText: '',
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_DIAL_PAD_TEXT: {
      return state.set('dialpadText', fromJS(action.dialpadText));
    }
    default:
      return state;
  }
}
