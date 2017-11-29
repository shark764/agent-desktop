/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { WrapUpToggle } from '../index';

describe('<WrapUpToggle />', () => {
  const interaction = {
    interactionId: 'aaa',
    status: 'work-accepted',
    wrapupDetails: {},
  };
  it('should render correctly', () => {
    const rendered = shallow(<WrapUpToggle interaction={interaction} />);
    expect(rendered).toMatchSnapshot();
  });
});
