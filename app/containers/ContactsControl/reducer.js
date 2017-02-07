/*
 *
 * ContactsControl reducer
 *
 */

import { fromJS } from 'immutable';
import {
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_SEARCH_RESULTS,
  SET_LOADING,
} from './constants';

const initialState = fromJS({
  query: [],
  results: undefined,
  loading: false,
});

function contactsControlReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SEARCH_FILTER: {
      return state.update('query', (query) => query.push(action.filter)).set('results', undefined);
    }
    case REMOVE_SEARCH_FILTER: {
      return state.update('query', (query) => query.filter((filter) => filter.value !== action.filter.value || filter.sdkName !== action.filter.sdkName)).set('results', undefined);
    }
    case SET_SEARCH_RESULTS: {
      return state.set('results', fromJS(action.response.results)).set('loading', false);
    }
    case SET_LOADING: {
      return state.set('loading', true);
    }
    default:
      return state;
  }
}

export default contactsControlReducer;
