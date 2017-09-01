/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { OutboundEmailButton } from '../OutboundEmailButton';

describe('<OutboundEmailButton />', () => {
  it('should be enabled with valid email and email not in existing email interactions', () => {
    const rendered = shallow(
      <OutboundEmailButton email="test@serenova.com" interactionEmails={[]} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should be disabled with invalid email', () => {
    const rendered = shallow(
      <OutboundEmailButton email="invalid" interactionEmails={[]} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should be disabled when email is in existing email interactions', () => {
    const rendered = shallow(
      <OutboundEmailButton
        email="test@serenova.com"
        interactionEmails={['test@serenova.com']}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
