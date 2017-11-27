/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import DesktopActionsButtons from '../index';

describe('<DesktopActionsButtons />', () => {
  const interaction = { interactionId: 'aaa', status: 'work-accepted' };
  const buttonConfig = [
    {
      id: 'end-chat-button',
      type: 'primaryBlue',
      text: 'End Chat',
      onClick: () => {},
      disabled: false,
    },
  ];
  it('should render correctly', () => {
    const rendered = shallow(
      <DesktopActionsButtons
        interaction={interaction}
        buttonConfig={buttonConfig}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
