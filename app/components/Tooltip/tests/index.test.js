/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Tooltip from '../index';

describe('<Tooltip />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <div id="mockWrapper" data-tip data-for="mockId">
        <Tooltip
          id="mockId"
          text={{ id: 'mockId', defaultMessage: 'mockMsg' }}
        />
      </div>
    );
    expect(rendered).toMatchSnapshot();
  });
});
