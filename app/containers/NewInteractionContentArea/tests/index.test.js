/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { NewInteractionContentArea } from '../index';

describe('<NewInteractionContentArea />', () => {
  it('should render <NewInteractionForm /> when in toolbar mode', () => {
    const rendered = shallow(
      <NewInteractionContentArea closeNewInteractionPanel={() => {}} />,
      { toolbarMode: true }
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should render <ContactSearch /> when not in toolbar mode, having crm permissions', () => {
    const rendered = shallow(
      <NewInteractionContentArea
        hasCrmPermissions
        closeNewInteractionPanel={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
