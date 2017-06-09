/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import loginReducer from '../reducer';

describe('loginReducer', () => {
  it('returns the initial state', () => {
    expect(loginReducer(undefined, {})).toMatchSnapshot();
  });
});
