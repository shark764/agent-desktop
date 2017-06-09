/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import toolbarReducer from '../reducer';

describe('toolbarReducer', () => {
  it('returns the initial state', () => {
    expect(toolbarReducer(undefined, {})).toMatchSnapshot();
  });
});
