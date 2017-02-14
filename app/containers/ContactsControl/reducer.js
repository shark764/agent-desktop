/*
 *
 * ContactsControl reducer
 *
 */

import { fromJS, List } from 'immutable';
import {
  SET_SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
} from './constants';

const initialState = fromJS({
  query: [],
  results: [],
  nextPage: 1,
  loading: false,
  resultsCount: -1,
});

function contactsControlReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_SEARCH_RESULTS: {
      return state
        .set('results', new List())
        .set('nextPage', 1)
        .set('resultsCount', -1);
    }
    case SET_SEARCH_RESULTS: {
      let results = state.get('results');
      if (action.response.page === state.get('nextPage')) {
        action.response.results.forEach((result) => {
          results = results.push(fromJS(result));
        });
        return state
          .set('results', results)
          .set('nextPage', action.response.page + 1)
          .set('resultsCount', action.response.count);
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}

export default contactsControlReducer;
