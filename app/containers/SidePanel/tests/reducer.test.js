/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import sidePanelReducer from '../reducer';

describe('sidePanelReducer', () => {
  it('returns the initial state', () => {
    expect(sidePanelReducer(undefined, {})).toMatchSnapshot();
  });
});
