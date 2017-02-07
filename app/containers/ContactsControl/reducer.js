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
      if (action.filter.id !== 'all') {
        return state.update('query', (query) => query.push(fromJS(action.filter))).set('results', undefined);
      } else {
        return state.set('query', fromJS([action.filter])).set('results', undefined);
      }
    }
    case REMOVE_SEARCH_FILTER: {
      return state.update('query', (query) => query.filter((filter) => filter.get('id') !== action.filter.id)).set('results', undefined);
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
