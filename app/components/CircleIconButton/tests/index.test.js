/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import CircleIconButton from '../index';

describe('<CircleIconButton />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <CircleIconButton id="mockId" name="config" onClick={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
