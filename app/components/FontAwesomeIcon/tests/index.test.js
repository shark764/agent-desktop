/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import FontAwesomeIcon from '../index';

describe('<FontAwesomeIcon />', () => {
  it('should render correctly', () => {
    const rendered = shallow(<FontAwesomeIcon name="globe" id="globeIcon" />);
    expect(rendered).toMatchSnapshot();
  });
  it('should render correctly with additional props', () => {
    const rendered = shallow(
      <FontAwesomeIcon
        name="globe"
        faSize="3"
        alt="testing icon"
        style={{ color: 'blue' }}
        id="globeIcon"
        onclick={() => {
          console.log('test');
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
