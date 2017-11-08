/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { CancelButton } from '../CancelButton';

describe('<CancelButton />', () => {
  it('should render when passed in outbound voice', () => {
    const rendered = shallow(
      <CancelButton
        interaction={{
          interactionId: 'mock-interaction-id',
          direction: 'outbound',
          channelType: 'voice',
          status: 'work-initiated',
          initiatedByCurrentAgent: true,
        }}
        cancelClickToDial={() => {}}
        style={{ customStyle: 'awesome' }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('should not render when passed in other', () => {
    const rendered = shallow(
      <CancelButton
        interaction={{
          interactionId: 'mock-interaction-id',
          direction: 'inbound',
          channelType: 'sms',
          status: 'work-accepted',
        }}
        cancelClickToDial={() => {}}
        style={{ customStyle: 'awesome' }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
