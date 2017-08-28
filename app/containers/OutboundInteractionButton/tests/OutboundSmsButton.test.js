/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { OutboundSmsButton } from '../OutboundSmsButton';

describe('<OutboundSmsButton />', () => {
  it('should be enabled with valid phone number and phone number not in existing sms interactions', () => {
    const rendered = shallow(
      <OutboundSmsButton
        phoneNumber="+15064702497"
        smsInteractionNumbers={[]}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should be disabled with invalid phone number', () => {
    const rendered = shallow(
      <OutboundSmsButton phoneNumber="invalid" smsInteractionNumbers={[]} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should be disabled when phone number is in existing sms interactions', () => {
    const rendered = shallow(
      <OutboundSmsButton
        phoneNumber="+15064701234"
        smsInteractionNumbers={['+15064701234']}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
