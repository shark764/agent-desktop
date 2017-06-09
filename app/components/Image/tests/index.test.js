/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Image from '../index';

describe('<Image />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Image
        id="mockId"
        src="mockSource"
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
