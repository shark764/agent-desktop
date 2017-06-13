/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Logo from '../index';

describe('<Logo />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Logo
        id="mockId"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
