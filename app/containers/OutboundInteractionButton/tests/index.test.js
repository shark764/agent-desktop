/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { OutboundInteractionButton } from '../index';

describe('<OutboundInteractionButton />', () => {
  it('renders correctly for voice channel', () => {
    const rendered = shallow(
      <OutboundInteractionButton
        channelType="voice"
        endpoint="+15064701234"
        isEnabled
        title="+15064701234"
        isAgentReady
        selectedInteractionIsCreatingNewInteraction
        startOutboundInteraction={() => {}}
        startOutboundEmail={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly for sms channel', () => {
    const rendered = shallow(
      <OutboundInteractionButton
        channelType="sms"
        endpoint="+15064701234"
        isEnabled
        title="+15064701234"
        isAgentReady
        selectedInteractionIsCreatingNewInteraction
        startOutboundInteraction={() => {}}
        startOutboundEmail={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders correctly for email channel', () => {
    const rendered = shallow(
      <OutboundInteractionButton
        channelType="email"
        endpoint="test@serenova.com"
        isEnabled
        title="test@serenova.com"
        isAgentReady
        selectedInteractionIsCreatingNewInteraction
        startOutboundInteraction={() => {}}
        startOutboundEmail={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('is disabled when agent is not ready', () => {
    const rendered = shallow(
      <OutboundInteractionButton
        channelType="voice"
        endpoint="+15064701234"
        isEnabled
        title="+15064701234"
        isAgentReady={false}
        selectedInteractionIsCreatingNewInteraction
        startOutboundInteraction={() => {}}
        startOutboundEmail={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('is disabled isEnabled prop type is false', () => {
    const rendered = shallow(
      <OutboundInteractionButton
        channelType="voice"
        endpoint="+15064701234"
        isEnabled={false}
        title="Voice interaction already exists"
        isAgentReady
        selectedInteractionIsCreatingNewInteraction
        startOutboundInteraction={() => {}}
        startOutboundEmail={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
