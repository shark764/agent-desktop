/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InfoTab reducer
 *
 */

import { fromJS, List } from 'immutable';
import * as ACTIONS from './constants';

const initialState = fromJS({
  results: [],
  nextPage: 1,
  loading: false,
  resultsCount: -1,
  checkedContacts: [],
  notifications: [],
  // oneTimeNotifications
  // Used as a bucket to check against before adding another notification
  oneTimeNotifications: [],
  nextNotificationId: 0,
  deletionPending: false,
  confirmingDelete: false,
  searchPending: false,
});

let currentContacts;

function infoTabReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.CLEAR_SEARCH_RESULTS: {
      return state
        .set('results', new List())
        .set('nextPage', 1)
        .set('resultsCount', -1);
    }
    case ACTIONS.SET_SEARCH_RESULTS: {
      let results = state.get('results');
      let validResultsCount = action.response.count;
      if (action.response.page === state.get('nextPage')) {
        action.response.results.forEach((newResult) => {
          if (newResult) {
            // search returns null for contact immediately after it's been deleted
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
    case ACTIONS.SET_CRM_UNAVAILABLE:
      return state.set('crmUnavailable', action.reason || 'generalError');
    case ACTIONS.CHECK_CONTACT:
      currentContacts = state.get('checkedContacts');
      return state.set(
        'checkedContacts',
        currentContacts.push(fromJS(action.contact))
      );
    case ACTIONS.UNCHECK_CONTACT:
      currentContacts = state.get('checkedContacts');
      return state.set(
        'checkedContacts',
        currentContacts.filter(
          (contact) => contact.get('id') !== action.contact.id
        )
      );
    case ACTIONS.CLEAR_CHECKED_CONTACTS:
      return state.set('checkedContacts', new List());
    case ACTIONS.ADD_NOTIFICATION:
      return state
        .set(
          'notifications',
          state.get('notifications').push(fromJS(action.notification))
        )
        .set('nextNotificationId', action.notification.id + 1);
    case ACTIONS.ADD_ONE_TIME_NOTIFICATION:
      return state.update('oneTimeNotifications', (oneTimeNotifications) =>
        oneTimeNotifications.push(fromJS(action.oneTimeNotification))
      );
    case ACTIONS.DISMISS_NOTIFICATION:
      return state.set(
        'notifications',
        state
          .get('notifications')
          .filter((notification) => notification.get('id') !== action.id)
      );
    case ACTIONS.SET_LOADING:
      return state.set('loading', action.loading);
    case ACTIONS.SET_DELETION_PENDING:
      return state.set('deletionPending', action.deletionPending);
    case ACTIONS.SET_CONFIRMING_DELETE:
      return state.set('confirmingDelete', action.confirmingDelete);
    case ACTIONS.SET_SEARCH_PENDING:
      return state.set('searchPending', action.searchPending);
    default:
      return state;
  }
}

export default infoTabReducer;
