import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import NotificationBanner from '../index';

describe('<NotificationBanner />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <NotificationBanner.WrappedComponent
        id="mockId"
        errorType="serverError"
        messageType="notSaved"
        dismiss={() => {}}
        isError
        intl={getIntlContext()}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
