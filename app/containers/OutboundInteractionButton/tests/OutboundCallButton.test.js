/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { OutboundCallButton } from '../OutboundCallButton';

describe('<OutboundCallButton />', () => {
  it('should be enabled with valid phone number and no voice interaction', () => {
    const rendered = shallow(
      <OutboundCallButton
        phoneNumber="+15064702497"
        hasVoiceInteraction={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should be disabled with invalid phone number', () => {
    const rendered = shallow(
      <OutboundCallButton phoneNumber="invalid" hasVoiceInteraction={false} />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should be disabled when there is a voice interaction', () => {
    const rendered = shallow(
      <OutboundCallButton phoneNumber="+15064702497" hasVoiceInteraction />
    );
    expect(rendered).toMatchSnapshot();
  });
});
