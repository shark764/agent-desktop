/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import NotificationBanner from '../index';

const mockMessage = { id: 'app.test.mockMessage', defaultMessage: 'mockMessage' };

describe('<NotificationBanner />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <NotificationBanner.WrappedComponent
        id="mockId"
        titleMessage={mockMessage}
        descriptionMessage={mockMessage}
        dismiss={() => {}}
        isError
        intl={getIntlContext()}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
