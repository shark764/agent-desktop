/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import contactsControlReducer from '../reducer';

describe('ContactsControl Reducer', () => {
  it('returns the initial state', () => {
    expect(contactsControlReducer(undefined, {})).toMatchSnapshot();
  });
});
