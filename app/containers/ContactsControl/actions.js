/*
 *
 * ContactsControl actions
 *
 */

import {
  CLEAR_SEARCH_RESULTS,
  SET_SEARCH_RESULTS,
} from './constants';

export function clearSearchResults() {
  return {
    type: CLEAR_SEARCH_RESULTS,
  };
}

export function setSearchResults(response) {
  return {
    type: SET_SEARCH_RESULTS,
    response,
  };
}
