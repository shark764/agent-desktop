/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { ContentAreaTop } from '../index';

describe('<ContentAreaTop />', () => {
  const buttonConfig = [
    {
      id: 'test-id-1',
      type: 'primaryRed',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: () => {},
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
    {
      id: 'test-id-2',
      type: 'primaryBlue',
      text: {
        id: 'app.containers.EmailContentArea.send',
        defaultMessage: 'Send',
      },
      onClick: () => {},
      disabled: false,
      style: {
        marginRight: '8px',
      },
    },
  ];

  const mockInteraction = {
    interactionId: 'mock-interaction-1',
    channelType: 'voice',
    status: 'work-accepted',
    wrapupDetails: {
      wrapupUpdateAllowed: false,
      wrapupEnabled: false,
    },
    query: {},
  };

  it('should render correctly', () => {
    const rendered = shallow(
      <ContentAreaTop
        id="mockId"
        interaction={mockInteraction}
        buttonConfig={buttonConfig}
        isSidePanelCollapsed={false}
        sidePanelPx={500}
        isInteractionsBarCollapsed={false}
        hasAssignedContact={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
