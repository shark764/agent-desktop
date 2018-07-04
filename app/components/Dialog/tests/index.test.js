/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Dialog from '../index';

describe('<Dialog />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <Dialog id="mockId">
        <p>
          {'Mock Child'}
        </p>
      </Dialog>
    );
    expect(rendered).toMatchSnapshot();
  });
});
