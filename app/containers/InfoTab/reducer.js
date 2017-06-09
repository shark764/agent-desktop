/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InfoTab reducer
 *
 */

import { fromJS, List, Map } from 'immutable';
import {
  SET_CRM_UNAVAILABLE,
  SET_SEARCH_RESULTS,
  CLEAR_SEARCH_RESULTS,
  CHECK_CONTACT,
  UNCHECK_CONTACT,
  CLEAR_CHECKED_CONTACTS,
  SET_CONTACT_MODE,
  SET_EDITING_CONTACT,
  NEW_CONTACT,
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  SET_LOADING,
  SET_DELETION_PENDING,
  SET_CONFIRMING_DELETE,
} from './constants';

const initialState = fromJS({
  results: [],
  nextPage: 1,
  loading: false,
  resultsCount: -1,
  checkedContacts: [],
  contactMode: 'viewing',
  editingContact: {},
  notifications: [],
  nextNotificationId: 0,
  deletionPending: false,
  confirmingDelete: false,
});

let currentContacts;

function infoTabReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_SEARCH_RESULTS: {
      return state
        .set('results', new List())
        .set('nextPage', 1)
        .set('resultsCount', -1);
    }
    case SET_SEARCH_RESULTS: {
      let results = state.get('results');
      let validResultsCount = action.response.count;
      if (action.response.page === state.get('nextPage')) {
        action.response.results.forEach((newResult) => {
          if (newResult) { // search returns null for contact immediately after it's been deleted
            results = results.push(fromJS(newResult));
          } else {
            validResultsCount -= 1;
          }
        });
        return state
          .set('results', results)
          .set('nextPage', action.response.page + 1)
          .set('resultsCount', validResultsCount);
      } else {
        return state;
      }
    }
    case SET_CRM_UNAVAILABLE:
      return state.set('crmUnavailable', action.reason || 'generalError');
    case CHECK_CONTACT:
      currentContacts = state.get('checkedContacts');
      return state
        .set('checkedContacts', currentContacts.push(fromJS(action.contact)));
    case UNCHECK_CONTACT:
      currentContacts = state.get('checkedContacts');
      return state
        .set('checkedContacts', currentContacts.filter((contact) => contact.get('id') !== action.contact.id));
    case CLEAR_CHECKED_CONTACTS:
      return state
        .set('checkedContacts', new List());
    case SET_CONTACT_MODE:
      return state
        .set('contactMode', action.contactMode);
    case SET_EDITING_CONTACT:
      return state
        .set('editingContact', action.editingContact);
    case NEW_CONTACT:
      return state
        .set('contactMode', 'editing')
        .set('editingContact', new Map());
    case ADD_NOTIFICATION:
      return state
        .set('notifications', state.get('notifications').push(fromJS(action.notification)))
        .set('nextNotificationId', action.notification.id + 1);
    case DISMISS_NOTIFICATION:
      return state
        .set('notifications', state.get('notifications').filter((notification) => notification.get('id') !== action.id));
    case SET_LOADING:
      return state
        .set('loading', action.loading);
    case SET_DELETION_PENDING:
      return state
        .set('deletionPending', action.deletionPending);
    case SET_CONFIRMING_DELETE:
      return state
        .set('confirmingDelete', action.confirmingDelete);
    default:
      return state;
  }
}

export default infoTabReducer;
