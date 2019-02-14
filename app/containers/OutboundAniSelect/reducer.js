import { fromJS } from 'immutable';

import * as ACTIONS from './constants';

const initialState = fromJS({
  outboundIdentifierList: undefined,
  selectedEmailOutboundIdentifier: undefined,
  selectedPhoneOutboundIdentifier: undefined,
});

export default function(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_OUTBOUND_IDENTIFICATION_LISTS: {
      return state.set(
        'outboundIdentifierLists',
        fromJS(action.response.result)
      );
    }
    case ACTIONS.SELECT_OUTBOUND_IDENTIFICATION: {
      return state.set(
        'selectedEmailOutboundIdentifier',
        fromJS(action.response)
      );
    }
    case ACTIONS.SELECT_OUTBOUND_PHONE_IDENTIFICATION: {
      return state.set(
        'selectedPhoneOutboundIdentifier',
        fromJS(action.response)
      );
    }
    default:
      return state;
  }
}
