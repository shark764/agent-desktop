/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import CollapseInteractionsButton from '../index';

describe('<CollapseInteractionsButton />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <CollapseInteractionsButton
        id="mockId"
        isCollapsed={false}
        toggleInteractionsBar={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
