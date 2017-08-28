/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { NewInteractionForm } from '../NewInteractionForm';

describe('<NewInteractionForm />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <NewInteractionForm input="" setNewInteractionPanelFormInput={() => {}} />
    );
    expect(rendered).toMatchSnapshot();
  });
});
