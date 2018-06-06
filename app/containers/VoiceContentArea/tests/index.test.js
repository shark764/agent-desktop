/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { VoiceContentArea } from '../index';

describe('<VoiceContentArea />', () => {
  const mockInteraction = {
    interactionId: 'mock-interaction-1',
    status: 'work-accepted',
    channelType: 'work-item',
    subject: 'Test subject',
    customFields: [{ label: 'label', value: 'value' }],
    script: { something: 'something' },
    contact: { attributes: { name: 'Contact name' } },
  };

  it('should render correctly', () => {
    const rendered = shallow(
      <VoiceContentArea
        selectedInteraction={mockInteraction}
        endInteraction={() => {}}
        awaitingScript={false}
        isEndWrapupDisabled={false}
        wrapupBtnTooltipText={{}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly when waiting on script', () => {
    const rendered = shallow(
      <VoiceContentArea
        selectedInteraction={mockInteraction}
        endInteraction={() => {}}
        awaitingScript
        isEndWrapupDisabled
        wrapupBtnTooltipText={{ id: 'testId', defaultMessage: 'test message' }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
