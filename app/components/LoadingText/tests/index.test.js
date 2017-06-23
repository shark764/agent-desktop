/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import LoadingText from '../index';

describe('<LoadingText />', () => {
  it('should render correctly', () => {
    const rendered = shallow(<LoadingText id="mockId" />);
    expect(rendered).toMatchSnapshot();
  });
});

describe('<LoadingText />', () => {
  it('Expect LoadingText with attribute withSquare to render correctly', () => {
    const rendered = shallow(<LoadingText id="mockId" withSquare />);
    expect(rendered).toMatchSnapshot();
  });
});
