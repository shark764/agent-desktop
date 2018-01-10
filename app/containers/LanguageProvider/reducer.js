/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';

import { DEFAULT_LOCALE } from 'containers/AgentDesktop/constants';
import * as ACTIONS from './constants';

const storage = window.localStorage;

const initialState = fromJS({
  locale: storage.getItem('locale') || DEFAULT_LOCALE,
});

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.CHANGE_LOCALE:
      return state.set('locale', action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
