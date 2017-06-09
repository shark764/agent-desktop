/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Select from '../index';

describe('<Select />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Select
        id="mockId"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
