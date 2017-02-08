/*
 *
 * ContactsControl reducer
 *
 */

import { fromJS, List } from 'immutable';
import {
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_SEARCH_RESULTS,
} from './constants';

const initialState = fromJS({
  query: [],
  results: [],
  nextPage: 1,
  loading: false,
});

function contactsControlReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SEARCH_FILTER: {
      if (action.filter.id !== 'all') {
        return state
          .update('query', (query) => query.push(fromJS(action.filter)))
          .set('results', new List())
          .set('nextPage', 1)
          .set('resultsCount', undefined);
      } else {
        return state
          .set('query', fromJS([action.filter]))
          .set('results', new List())
          .set('nextPage', 1)
          .set('resultsCount', undefined);
      }
    }
    case REMOVE_SEARCH_FILTER: {
      return state
        .update('query', (query) => query.filter((filter) => filter.get('id') !== action.filter.id))
        .set('results', new List())
        .set('nextPage', 1)
        .set('resultsCount', undefined);
    }
    case SET_SEARCH_RESULTS: {
      let results = state.get('results');
      action.response.results.forEach((result) => {
        results = results.push(fromJS(result));
      });
      return state
        .set('results', results)
        .set('nextPage', action.response.page + 1)
        .set('resultsCount', action.response.count);
    }
    default:
      return state;
  }
}

export default contactsControlReducer;
