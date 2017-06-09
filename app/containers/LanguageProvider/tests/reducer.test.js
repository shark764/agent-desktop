/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import interactionsBarReducer from '../reducer';

describe('interactionsBarReducer', () => {
  it('returns the initial state', () => {
    expect(interactionsBarReducer(undefined, {})).toMatchSnapshot();
  });
});
