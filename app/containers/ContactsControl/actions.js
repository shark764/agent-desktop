/*
 *
 * ContactsControl actions
 *
 */

import {
  ADD_SEARCH_FILTER,
  REMOVE_SEARCH_FILTER,
  SET_SEARCH_RESULTS,
  SET_LOADING,
} from './constants';

export function addSearchFilter(filter) {
  return {
    type: ADD_SEARCH_FILTER,
    filter,
  };
}

export function removeSearchFilter(filter) {
  return {
    type: REMOVE_SEARCH_FILTER,
    filter,
  };
}

export function setSearchResults(response) {
  return {
    type: SET_SEARCH_RESULTS,
    response,
  };
}

export function setLoading() {
  return {
    type: SET_LOADING,
  };
}
