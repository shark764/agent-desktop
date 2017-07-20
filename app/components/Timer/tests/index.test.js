/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Timer from '../index';

describe('<Timer />', () => {
  it('should render correctly', () => {
    const rendered = shallow(<Timer id="mockId" />);
    const props = rendered.props();
    props.timer.timestamp = 0;
    expect(rendered).toMatchSnapshot();
  });
});
