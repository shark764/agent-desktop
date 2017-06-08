/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import errorsReducer from '../reducer';

describe('Errors Reducer', () => {
  it('returns the initial state', () => {
    expect(errorsReducer(undefined, {})).toMatchSnapshot();
  });
});
