/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { WorkItemContentArea } from '../index';

describe('<WorkItemContentArea />', () => {
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
      <WorkItemContentArea
        selectedInteraction={mockInteraction}
        endInteraction={() => {}}
        awaitingDisposition={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
