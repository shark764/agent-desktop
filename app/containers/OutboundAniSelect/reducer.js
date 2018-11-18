import { fromJS } from 'immutable';

import * as ACTIONS from './constants';

const initialState = fromJS({
  outboundIdentifierList: undefined,
  selectedOutboundIdentifier: undefined,
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
      return state.set('selectedOutboundIdentifier', fromJS(action.response));
    }
    default:
      return state;
  }
}
